import { LocalChampion, LocalData, LocalSkin, LocalSkinline } from './models';
import { getCDragonPath, getChampionData, getChampionsList, getLanguages, getSkinlines } from './utils';
import config from './config/config';
import { writeFile } from 'fs';
import app from './app';
import { getLangAppData } from './data';

const diffHours = (date1: Date, date2: Date) => {
  const diffMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  const diffHours = diffMilliseconds / (1000 * 60 * 60);
  return Math.round(diffHours);
};

const saveToJson = <T>(path: string, data: T) => {
  try {
    writeFile(path, JSON.stringify(data), 'utf-8', () => {});
  } catch (error) {
    console.log('[DEV][ERROR]', '-- ERROR SAVING DATA --');
  }
};

const getDataByLang = async (lang: string) => {
  const data: Pick<LocalData, 'champions' | 'skinlines' | 'skins'> = {
    champions: [],
    skins: [],
    skinlines: [],
  };

  const skinlines: LocalSkinline[] = (await getSkinlines(lang)) ?? [];
  const champions = (await getChampionsList(config.riotVersion, lang)) ?? [];
  const rChampions: LocalChampion[] = champions.map((champion) => ({
    id: champion.id,
    key: champion.key,
    name: champion.name,
    image: {
      full: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`,
      loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`,
      icon: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.key}.png`,
    },
  }));

  const rSkins: LocalSkin[] = [];
  for (const champion of rChampions) {
    const data = await getChampionData(champion.key, lang);

    if (data) {
      const skins = data.skins.filter((skin) => !skin.isBase);

      const mappedSkins: LocalSkin[] = skins.map((skin) => ({
        id: skin.id,
        contentId: skin.contentId,
        championId: champion.id,
        championName: champion.name,
        name: skin.name,
        image: {
          full: getCDragonPath(skin.splashPath),
          loading: getCDragonPath(skin.loadScreenPath),
        },
        rarity: skin.rarity,
        chromaPath: getCDragonPath(skin.chromaPath),
        chromas:
          (skin.chromas ?? []).map((chroma) => ({
            id: chroma.id,
            name: chroma.name,
            contentId: chroma.contentId,
            path: getCDragonPath(chroma.chromaPath),
            colors: chroma.colors,
          })) ?? [],
        skinlines: (skin.skinLines ?? [])
          .map((skinline) => {
            const skinlineData = skinlines.find((sl) => sl.id === skinline.id);
            if (!skinlineData) return null;

            return {
              id: skinline.id,
              name: skinlineData.name,
            };
          })
          .filter((skinline) => !!skinline),
      }));

      rSkins.push(...mappedSkins);
    }
  }

  data.skinlines.push(...skinlines);
  data.champions.push(...rChampions);
  data.skins.push(...rSkins);

  return data;
};

const prepareData = async () => {
  try {
    const languages = (await getLanguages()) ?? [];
    const updateDate = new Date();

    console.log();
    console.log('[DEV]', '-- PREPARE START --');
    const prepareStartTime = performance.now();

    for await (const language of languages) {
      const langData = await getLangAppData(language);
      const lastUpdated = langData?.updated;
      const updateDiff = config.dataUpdateDays * 24;
      const diffInHours = lastUpdated ? diffHours(new Date(lastUpdated), new Date()) : updateDiff;

      if (langData && diffInHours < updateDiff) {
        continue;
      }

      console.log('[DEV]', `-- LOAD ${language} --`);

      const dataByLang = await getDataByLang(language);
      const data: LocalData = {
        lang: language,
        updated: updateDate,
        ...dataByLang,
      };
      saveToJson(`./data/${language}.json`, data);
    }

    const prepareEndTime = performance.now();
    console.log('[DEV]', '-- PREPARE END --');
    console.log('[DEV]', `-- TIME: ${Math.round(prepareEndTime - prepareStartTime) / 1000}s --`);
    console.log();
  } catch (error) {
    console.log('[DEV][ERROR]', '-- NOT PREPARED --');
    console.error(error);
  }
};

app.listen(config.port, async () => {
  await prepareData();

  console.log(`Server running on port ${config.port}`);
});
