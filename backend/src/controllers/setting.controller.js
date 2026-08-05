import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all settings (public)
export const getSettings = async (req, res) => {
  try {
    const settingsList = await prisma.setting.findMany();
    const settings = {};
    settingsList.forEach(s => {
      settings[s.key] = s.value;
    });

    res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch settings'
    });
  }
};

// Update multiple settings (Admin only)
export const updateSettings = async (req, res) => {
  try {
    const settingsData = req.body; // e.g. { promo_banner_active: true, promo_banner_text_fr: "..." }

    if (!settingsData || typeof settingsData !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid settings payload'
      });
    }

    const updatedSettings = {};

    // Use a transaction to update all settings
    await prisma.$transaction(async (tx) => {
      for (const [key, value] of Object.entries(settingsData)) {
        // Json field can store any JSON type directly
        const jsonValue = value;
        const updated = await tx.setting.upsert({
          where: { key },
          update: { value: jsonValue },
          create: { key, value: jsonValue }
        });
        updatedSettings[updated.key] = updated.value;
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update settings'
    });
  }
};
