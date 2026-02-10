import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  riotVersion: string;
  dataUpdateDays: number;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  riotVersion: process.env.RIOT_VERSION || '16.3.1',
  dataUpdateDays: parseInt(process.env.DATA_UPDATE_DAYS || '7'),
};

export default config;
