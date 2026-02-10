import { Router } from 'express';
import { getSkinlinesController } from '../controllers/skinline';

const router = Router();

router.get('/', getSkinlinesController);

export default router;
