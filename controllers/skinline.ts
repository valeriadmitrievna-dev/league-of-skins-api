import { NextFunction, Request, Response } from 'express';
import { getLangAppData } from '../data';
import { LocalSkinline, PaginatedData } from '../models';
import { checkSearch } from '../utils/checkSearch';

export const getSkinlinesController = async (
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response<PaginatedData<LocalSkinline[]>>,
  next: NextFunction,
) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const appData = await getLangAppData(language);

    if (!appData) {
      return res.status(500).json({ count: 0, data: [] });
    }

    const skinlines = appData.skinlines
      .filter((skinline) => skinline.name)
      .filter((skinline) => {
        if (req.query.search) return checkSearch(skinline.name, req.query.search);
        else return true;
      });

    return res.json({ count: skinlines.length, data: skinlines });
  } catch (error) {
    next(error);
  }
};
