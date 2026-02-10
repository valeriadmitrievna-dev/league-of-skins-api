import { Router } from 'express';
import { getSkinsController } from '../controllers/skin';

const router = Router();

router.get('/', getSkinsController);

export default router;
