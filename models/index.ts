export interface SkinlineDto {
  id: number;
  name: string;
  description: string;
}

export interface ChromaDto {
  id: number;
  name: string;
  contentId: string;
  chromaPath: string;
  tilePath: string;
  colors: string[];
}

export interface SkinDto {
  id: number;
  contentId: string;
  isBase: boolean;
  name: string;
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  rarity: string;
  chromaPath: string;
  chromas: ChromaDto[];
  skinLines: { id: number }[];
  description: string;
}

export interface ChampionDto {
  id: string;
  name: string;
  alias: string;
  title: string;
  squarePortraitPath: string;
  skins: SkinDto[];
}

export interface ChampionItemDto {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    w: number;
    h: number;
  };
}

// LOCAL STORAGE MODELS

export interface LocalSkinline {
  id: number;
  name: string;
}

export interface LocalChampion {
  id: string;
  key: string;
  name: string;
  image: {
    full: string | null;
    loading: string | null;
    icon: string | null;
  };
}

export interface LocalChroma {
  id: number;
  name: string;
  contentId: string;
  path: string | null;
  colors: string[];
}

export interface LocalSkin {
  id: number;
  championId: string;
  championName: string;
  contentId: string;
  name: string;
  image: {
    full: string | null;
    loading: string | null;
  };
  rarity: string;
  chromaPath: string | null;
  chromas: LocalChroma[];
  skinlines: LocalSkinline[];
}

export interface LocalData {
  lang: string;
  updated: Date;
  skinlines: LocalSkinline[];
  champions: LocalChampion[];
  skins: LocalSkin[];
}

export interface LocalAppData {
  [language: string]: LocalData;
}

export interface LocalChromaItem {
  name: string;
  skinName: string;
  colors: string[];
  isUnique: boolean;
}

// SHARED API GENERICS

export interface PaginatedData<T> {
  count: number;
  data: T;
}
