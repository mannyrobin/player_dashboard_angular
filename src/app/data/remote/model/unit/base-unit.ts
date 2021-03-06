import {DictionaryType} from '../../misc/dictionary-type';
import {UnitTypeEnum} from '../../misc/unit-type-enum';
import {ShortNameObject} from '../../base/short-name-object';
import {ExternalResource} from '../external-resource';

export class BaseUnit extends ShortNameObject {
  public discriminator: DictionaryType;
  public unitTypeEnum: UnitTypeEnum;

  //#region Transient
  public unitVersionId: number;
  public updated: Date;
  public externalResources: ExternalResource[];
  //#endregion
}
