import {environment} from '../../../environments/environment';

export class PropertyConstant {
  public static readonly pageSize: number = 25;
  public static readonly searchDebounceTime: number = 300;
  public static readonly host: string = environment.production ? 'api.rsi205.ru' : 'localhost:8082';
  public static readonly restUrl: string = environment.production ? `https://${PropertyConstant.host}/sp/v2` : `http://${PropertyConstant.host}`;
  public static readonly wsUrl: string = environment.production ? `wss://${PropertyConstant.host}/sp/v2/ws` : `ws://${PropertyConstant.host}`;

  public static readonly dateFormat: string = 'yyyy-MM-dd';
}
