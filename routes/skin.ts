import { Router } from 'express';
import { getSkinController, getSkinsController } from '../controllers/skin';

const router = Router();

router.get('/', getSkinsController);
router.get('/:id', getSkinController);

export default router;
