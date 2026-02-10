import { NextFunction, Request, Response } from 'express';
import { getLangAppData } from '../data';
import { LocalChampion, PaginatedData } from '../models';

export const getChampionsController = async (
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response<PaginatedData<LocalChampion[]>>,
  next: NextFunction,
) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const appData = await getLangAppData(language);
    const { search } = req.query;

    if (!appData) {
      return res.status(500).json({ count: 0, data: [] });
    }

    const champions = appData.champions.filter(champion => {
      if (search) return champion.name.toLowerCase().includes(search.toLowerCase());
      return true;
    });

    return res.json({ count: champions.length, data: champions });
  } catch (error) {
    next(error);
  }
};

export const getChampionController = async (
  req: Request<{ id: string }>,
  res: Response<LocalChampion | null>,
  next: NextFunction,
) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const appData = await getLangAppData(language);

    if (!appData) {
      return res.status(500).json(null);
    }

    const champion = appData.champions.find((champion) => champion.id === req.params.id);

    if (!champion) {
      return res.status(404).json(null);
    }

    return res.json(champion);
  } catch (error) {
    next(error);
  }
};
