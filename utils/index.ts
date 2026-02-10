import { getLangAppData } from '../data';
import { ChampionDto, ChampionItemDto, LocalChromaItem, SkinlineDto } from '../models';

const cDragon = 'https://raw.communitydragon.org';
const dDragon = 'https://ddragon.leagueoflegends.com';

export const getVersions = async () => {
  try {
    const url = `${dDragon}/api/versions.json`;
    const response = await fetch(url);
    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.log('[DEV][ERROR][getVersions]', (error as any).message);
  }
};

export const getLanguages = async () => {
  try {
    const url = `${dDragon}/cdn/languages.json`;
    const response = await fetch(url);
    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.log('[DEV][ERROR][getLanguages]', (error as any).message);
  }
};

export const getSkinlines = async (lang: string = 'default') => {
  try {
    lang = lang.toLowerCase();
    const language = lang === 'en_us' ? 'default' : lang;
    const url = `${cDragon}/latest/plugins/rcp-be-lol-game-data/global/${language}/v1/skinlines.json`;
    const response = await fetch(url);
    const data: SkinlineDto[] = await response.json();
    return data;
  } catch (error) {
    console.log('[DEV][ERROR][getSkinlines]', (error as any).message);
  }
};

export const getChampionsList = async (version: string, lang: string = 'en_US') => {
  try {
    const url = `${dDragon}/cdn/${version}/data/${lang}/champion.json`;
    const response = await fetch(url);
    const { data } = await response.json();
    const champions: ChampionItemDto[] = Object.values(data);
    return champions;
  } catch (error) {
    console.log('[DEV][ERROR][getChampionsList]', (error as any).message);
  }
};

export const getChampionData = async (championKey: string, lang: string = 'default') => {
  try {
    lang = lang.toLowerCase();
    const language = lang === 'en_us' ? 'default' : lang;
    const url = `${cDragon}/latest/plugins/rcp-be-lol-game-data/global/${language}/v1/champions/${championKey}.json`;
    const response = await fetch(url);
    const data: ChampionDto = await response.json();
    return data;
  } catch (error) {
    console.log('[DEV][ERROR][getChampionData]', (error as any).message);
  }
};

export const getCDragonPath = (assetPath: string) => {
  if (!assetPath) return null;

  const path = assetPath.replace(/^\/?lol-game-data\/assets\//i, '').toLowerCase();
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${path}`;
};

export const getChromasList = async (lang: string = 'en_US') => {
  try {
    const data = await getLangAppData(lang);

    if (data) {
      const chromas = data.skins
        .filter((skin) => skin.chromas.length)
        .map((skin) =>
          skin.chromas?.map((chroma) => {
            const regex = /.*\(([^)]+)\)/;
            const match = chroma.name.match(regex);
            const colors = [...new Set(chroma.colors)];

            const chromaName =
              lang === 'ru_RU' ? chroma.name.split("'")[chroma.name.split("'").length - 3] : (match?.[1] ?? chroma.name);

            return {
              name: chromaName,
              skinName: skin.name,
              colors,
            };
          }),
        )
        .flat()
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.name === value.name && t.colors.sort().join(',') === value.colors.sort().join(',')),
        );

      const counts: { [chromaName: string]: number } = {};

      (chromas ?? []).forEach((chroma) => {
        counts[chroma.name] = counts[chroma.name] ? counts[chroma.name] + 1 : 1;
      });

      return chromas.map((chroma) => ({
        ...chroma,
        isUnique: counts[chroma.name] === 1,
      })) as LocalChromaItem[];
    }
  } catch (error) {
    console.log('[DEV][ERROR][getChromaColors]', (error as any).message);
  }
};

export const getRaritiesList = async () => {
  try {
    const data = await getLangAppData();

    if (data) {
      const rarities = [...new Set(data.skins.map((skin) => skin.rarity))];
      return rarities;
    }
  } catch (error) {
    console.log('[DEV][ERROR][getChromaColors]', (error as any).message);
  }
};
