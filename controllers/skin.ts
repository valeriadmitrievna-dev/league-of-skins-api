import { NextFunction, Request, Response } from 'express';
import { getLangAppData } from '../data';
import { getRaritiesList } from '../utils';
import { LocalSkin, PaginatedData } from '../models';
import { checkSearch } from '../utils/checkSearch';

export const getSkinsController = async (
  req: Request<
    {},
    {},
    {},
    {
      championId?: string;
      skinlineId?: string;
      search?: string;
      colors?: string;
      rarity?: string;
    }
  >,
  res: Response<PaginatedData<LocalSkin[]>>,
  next: NextFunction,
) => {
  try {
    const language = req.get('App-Language') ?? 'en_US';
    const appData = await getLangAppData(language);

    if (!appData) {
      return res.status(500).json({ count: 0, data: [] });
    }

    const { championId, skinlineId, search, colors: queryColors, rarity } = req.query;
    const colors = queryColors?.split(',').map((color) => '#' + color.toLowerCase());

    const checker = (arr: string[], target: string[]) => target.every((v) => arr.includes(v));

    const skins = appData.skins.filter((skin) => {
      const allColors = skin.chromas
        .map((chroma) => chroma.colors)
        .flat()
        .map((color) => color.toLowerCase());
      const championIdFilter = championId ? skin.championId === championId : true;
      const searchFilter = search ? checkSearch(skin.name, search) : true;
      const skinlineFilter = skinlineId ? !!skin.skinlines.find((skinline) => skinline.id.toString() === skinlineId) : true;
      const colorsFilter = colors?.length ? checker(allColors, colors) : true;
      const rarityFilter = rarity ? skin.rarity === rarity : true;

      return championIdFilter && skinlineFilter && searchFilter && colorsFilter && rarityFilter;
    });

    return res.json({ count: skins.length, data: skins });
  } catch (error) {
    next(error);
  }
};
