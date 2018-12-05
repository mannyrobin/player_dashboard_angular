import {Injectable} from '@angular/core';
import {BaseTraining} from '../../data/remote/model/training/base/base-training';
import {PropertyConstant} from '../../data/local/property-constant';
import {TranslateObjectService} from '../../shared/translate-object.service';
import {AppHelper} from '../../utils/app-helper';
import {Person} from '../../data/remote/model/person';

@Injectable({
  providedIn: 'root'
})
export class HtmlService {

  constructor(private _translateObjectService: TranslateObjectService,
              private _appHelper: AppHelper) {
  }

  public getUrlLinkTag(url: string, content: string = null, target: LinkTarget = LinkTarget.SELF) {
    return `<a href="${url}" target="${target}">${content}</a>`;

  }

  public async getEventPreview<T extends BaseTraining>(event: T): Promise<string> {
    const eventTypeLabelName = await this._translateObjectService.getTranslation('eventType');
    const eventTypeName = await this._translateObjectService.getTranslation(`trainingDiscriminator.${event.discriminator}`);

    const startDateLabelName = await this._translateObjectService.getTranslation('startDate');
    const finishDateLabelName = await this._translateObjectService.getTranslation('finishDate');
    const descriptionLabelName = await this._translateObjectService.getTranslation('description');

    let descriptionBlock = '';
    if (event.description) {
      descriptionBlock = `<br>${descriptionLabelName}: <pre>${event.description}</pre>`;
    }
    return this.getUrlLinkTag(`/event/${event.id}`, `<h3 class="m-0 p-0">${event.name}</h3><p class="m-0 p-0 text-truncate flex-nowrap">${eventTypeLabelName}: ${eventTypeName}<br>${startDateLabelName}: ${this._appHelper.dateByFormat(event.startTime, PropertyConstant.dateTimeFormat)} ${finishDateLabelName}: ${this._appHelper.dateByFormat(event.finishTime, PropertyConstant.dateTimeFormat)}${descriptionBlock}</p>`);
  }

  public getPersonLinkTag(person: Person): string {
    return this.getUrlLinkTag(`/person/${person.id}`, `${person.lastName} ${person.firstName}`);
  }

}

enum LinkTarget {
  BLANK = '_blank',
  SELF = '_self',
  PARENT = '_parent',
  TOP = '_top'
}
