import { NextFunction, Request, Response } from 'express';
import { getLangAppData } from '../data';
import { LocalSkinline, PaginatedData } from '../models';

export const getSkinlinesController = async (req: Request, res: Response<PaginatedData<LocalSkinline[]>>, next: NextFunction) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const appData = await getLangAppData(language);

    if (!appData) {
      return res.status(500).json({ count: 0, data: [] });
    }

    const skinlines = appData.skinlines.filter(skinline => skinline.name)

    return res.json({ count: skinlines.length, data: skinlines });
  } catch (error) {
    next(error);
  }
};
