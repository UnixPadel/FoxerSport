import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import fs from 'fs';

const prisma = new PrismaClient();

// Setup Nodemailer transporter based on .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.unixpadel.com',
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// GET all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Also fetch users for statistics if needed, but for now just return
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { targetIds: true } // not a real relation but array
        }
      }
    });
    
    if (!campaign) {
      return res.status(404).json({ message: "Campagne introuvable" });
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST create campaign
export const createCampaign = async (req, res) => {
  try {
    const { name, type, targetType, targetIds, subject, emailHtml, emailJson, waMessage, scheduledAt } = req.body;
    
    const campaign = await prisma.campaign.create({
      data: {
        name,
        type,
        targetType,
        targetIds: targetIds || [],
        subject,
        emailHtml,
        emailJson,
        waMessage,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'draft'
      }
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// PUT update campaign
export const updateCampaign = async (req, res) => {
  try {
    const { name, type, targetType, targetIds, subject, emailHtml, emailJson, waMessage, status } = req.body;
    
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: {
        name,
        type,
        targetType,
        targetIds: targetIds || [],
        subject,
        emailHtml,
        emailJson,
        waMessage,
        status: status || undefined
      }
    });
    
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// DELETE campaign
export const deleteCampaign = async (req, res) => {
  try {
    await prisma.campaign.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Campagne supprimée" });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// POST send campaign
export const sendCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    
    if (!campaign) {
      return res.status(404).json({ message: "Campagne introuvable" });
    }

    if (campaign.status === 'sending' || campaign.status === 'completed') {
      return res.status(400).json({ message: "Campagne déjà envoyée ou en cours" });
    }

    // Mark as sending
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'sending' }
    });

    // We don't await the actual sending so we can return response immediately
    processCampaignSending(campaign).catch(err => console.error("Background sending error:", err));

    res.json({ message: "Envoi de la campagne démarré" });
  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({ message: "Erreur lors du lancement de l'envoi" });
  }
};

// Helper for background sending
async function processCampaignSending(campaign) {
  try {
    let users = [];
    
    if (campaign.targetType === 'all') {
      users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, email: true, phone: true, firstName: true, lastName: true }
      });
    } else {
      users = await prisma.user.findMany({
        where: { id: { in: campaign.targetIds } },
        select: { id: true, email: true, phone: true, firstName: true, lastName: true }
      });
    }

    // Process Emails
    if (campaign.type === 'email' || campaign.type === 'mixed') {
      for (const user of users) {
        if (user.email) {
          try {
            // Replace variables if needed
            let personalizedHtml = campaign.emailHtml || '';
            personalizedHtml = personalizedHtml.replace(/{{firstName}}/g, user.firstName || '');
            
            await transporter.sendMail({
              from: `"Foxer Sport" <${process.env.SMTP_USER}>`,
              to: user.email,
              subject: campaign.subject || 'Nouvelle offre Foxer Sport',
              html: personalizedHtml,
              text: htmlToText(personalizedHtml),
              headers: {
                'List-Unsubscribe': `<mailto:unsubscribe@unixpadel.com?subject=Unsubscribe%20${user.email}>`
              }
            });

            await prisma.campaignLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                contact: user.email,
                channel: 'email',
                status: 'success'
              }
            });
          } catch (err) {
            console.error(`Failed to send email to ${user.email}:`, err);
            await prisma.campaignLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                contact: user.email,
                channel: 'email',
                status: 'failed',
                errorMessage: err.message
              }
            });
          }
        }
      }
    }

    // Process WhatsApp
    if (campaign.type === 'whatsapp' || campaign.type === 'mixed') {
      for (const user of users) {
        if (user.phone) {
          try {
            // Here you would integrate with Twilio or Meta WhatsApp API
            // For now, we simulate success
            console.log(`[WhatsApp Simulé] Message envoyé à ${user.phone}: ${campaign.waMessage}`);
            
            await prisma.campaignLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                contact: user.phone,
                channel: 'whatsapp',
                status: 'success'
              }
            });
          } catch (err) {
            await prisma.campaignLog.create({
              data: {
                campaignId: campaign.id,
                userId: user.id,
                contact: user.phone,
                channel: 'whatsapp',
                status: 'failed',
                errorMessage: err.message
              }
            });
          }
        }
      }
    }

    // Mark as completed
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'completed' }
    });

  } catch (error) {
    console.error("Critical error in background campaign sending:", error);
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'failed' }
    });
  }
}

// POST send test email
export const sendTestEmail = async (req, res) => {
  try {
    const { emailHtml, testEmail, subject } = req.body;
    
    if (!testEmail || !emailHtml) {
      return res.status(400).json({ message: "Email de test et contenu requis" });
    }
    
    // DEBUG: Write received HTML to disk to inspect it
    fs.writeFileSync('debug_email_payload.txt', emailHtml);

    let personalizedHtml = emailHtml.replace(/{{firstName}}/g, 'Client Test');

    await transporter.sendMail({
      from: `"Foxer Sport" <${process.env.SMTP_USER}>`,
      to: testEmail,
      subject: (subject || 'Test de campagne') + ' [TEST]',
      html: personalizedHtml,
      text: htmlToText(personalizedHtml)
    });

    res.json({ message: "Email de test envoyé avec succès !" });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email de test", error: error.message });
  }
};

// POST upload image
export const uploadCampaignImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucune image uploadée" });
  }
  
  res.status(200).json({ imageUrl: `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${req.file.filename}` });
};
