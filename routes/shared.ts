import { Router } from 'express';
import {
  getChromasController,
  getLanguagesController,
  getRaritiesController,
  getVersionsController,
} from '../controllers/shared';

const router = Router();

router.get('/chromas', getChromasController);
router.get('/languages', getLanguagesController);
router.get('/rarities', getRaritiesController);
router.get('/versions', getVersionsController);

export default router;
