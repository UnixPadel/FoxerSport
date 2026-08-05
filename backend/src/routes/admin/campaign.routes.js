import express from 'express';
import { verifyToken, isAdmin } from '../../middleware/auth.js';
import { upload, optimizeImage } from '../../middleware/upload.js';
import * as campaignController from '../../controllers/admin/campaign.controller.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(verifyToken, isAdmin);

router.get('/', campaignController.getAllCampaigns);
router.post('/', campaignController.createCampaign);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

// Trigger sending a campaign
router.post('/:id/send', campaignController.sendCampaign);

// Upload image for email editor
router.post('/upload-image', upload.single('image'), optimizeImage, campaignController.uploadCampaignImage);

// Send a test email
router.post('/test', campaignController.sendTestEmail);

export default router;
