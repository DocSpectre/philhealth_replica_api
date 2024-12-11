import express from 'express';
import { BASE_PATH } from '../../config/constants';
import apiRoutes from './api';

const router = express.Router();

router.use(BASE_PATH, apiRoutes);

export default router;