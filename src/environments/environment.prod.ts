import { EnvironmentType } from './environment-type';
import { IEnvironment } from './ienvironment';

export const environment: IEnvironment = {
  production: true,
  version: '1.1.1-66',
  type: EnvironmentType.PRODUCTION,
  host: 'api.ar.zone',
  restUrl: 'https://api.ar.zone/sp/v2',
  wsUrl: 'https://api.ar.zone/sp/v2/ws'
};
