import { Router } from 'express';
import { getChampionController, getChampionsController } from '../controllers/champion';

const router = Router();

router.get('/', getChampionsController);
router.get('/:id', getChampionController);

export default router;
