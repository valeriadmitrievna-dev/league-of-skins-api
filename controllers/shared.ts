import { NextFunction, Request, Response } from 'express';
import { getChromasList, getLanguages, getRaritiesList, getVersions } from '../utils';
import { LocalChromaItem, PaginatedData } from '../models';

export const getVersionsController = async (req: Request, res: Response<string[]>, next: NextFunction) => {
  try {
    const versions = await getVersions();
    return res.json(versions);
  } catch (error) {
    next(error);
  }
};

export const getLanguagesController = async (req: Request, res: Response<string[]>, next: NextFunction) => {
  try {
    const versions = await getLanguages();
    return res.json(versions);
  } catch (error) {
    next(error);
  }
};

export const getChromasController = async (
  req: Request,
  res: Response<PaginatedData<LocalChromaItem[]>>,
  next: NextFunction,
) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const chromas = await getChromasList(language);

    return res.json({ count: (chromas ?? []).length, data: chromas ?? [] });
  } catch (error) {
    next(error);
  }
};

export const getRaritiesController = async (req: Request, res: Response<string[]>, next: NextFunction) => {
  try {
    const rarities = await getRaritiesList();
    return res.json(rarities);
  } catch (error) {
    next(error);
  }
};
