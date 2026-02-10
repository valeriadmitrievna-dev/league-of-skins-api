import { readdir, readFile } from 'fs/promises';
import { LocalAppData, LocalData } from './models';

export const readDirectory = async (dirpath: string): Promise<Record<string, string>> => {
  try {
    const filenames = await readdir(dirpath);
    const result: Record<string, string> = {};

    for (const filename of filenames) {
      const fullPath = `${dirpath}/${filename}`;
      const content = await readFile(fullPath, 'utf-8');
      result[filename] = content;
    }

    return result;
  } catch (error) {
    console.log('[DEV][ERROR] DIRECTORY READ FAILED', (error as any).message);
    return {};
  }
};

export const readFileText = async (filepath: string): Promise<string> => {
  try {
    return await readFile(filepath, 'utf-8');
  } catch (error) {
    console.log('[DEV][ERROR] FILE READ FAILED', (error as any).message);
    throw error;
  }
};

export const readJsonFile = async <T>(filepath: string): Promise<T> => {
  const text = await readFileText(filepath);
  return JSON.parse(text) as T;
};

export const getAppData = async (): Promise<LocalAppData> => {
  const dir = await readDirectory('./data');
  const appData: LocalAppData = {};

  for (const [filename, content] of Object.entries(dir)) {
    const lang = filename.replace('.json', '');
    const parsed = JSON.parse(content) as LocalData;

    appData[lang] = {
      ...parsed,
      lang,
    };
  }

  return appData;
};

export const getLangAppData = async (lang: string = 'en_US'): Promise<LocalData | null> => {
  try {
    return await readJsonFile<LocalData>(`./data/${lang}.json`);
  } catch {
    return null;
  }
};
