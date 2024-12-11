import express from 'express';
import apiMemberRoute from './api-member';
import apiEmployerRoute from './api-employer';

const router = express.Router();

// router.use('/contribution');
// router.use('/dependent');
router.use('/employer', apiEmployerRoute);
router.use('/member', apiMemberRoute);

export default router;