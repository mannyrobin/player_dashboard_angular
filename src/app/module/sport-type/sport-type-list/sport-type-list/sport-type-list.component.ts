import {Component, EventEmitter, Output} from '@angular/core';
import {BaseItemList} from '../../../common/item-list/model/base-item-list';
import {PageQuery} from '../../../../data/remote/rest-api/page-query';
import {Direction} from '../../../../components/ngx-virtual-scroll/model/direction';
import {PageContainer} from '../../../../data/remote/bean/page-container';
import {SportType} from '../../../../data/remote/model/sport-type';
import {ParticipantRestApiService} from '../../../../data/remote/rest-api/participant-rest-api.service';
import {ItemDisplay} from '../../../common/item-list/model/item-display';

@Component({
  selector: 'app-sport-type-list',
  templateUrl: './sport-type-list.component.html',
  styleUrls: ['./sport-type-list.component.scss']
})
export class SportTypeListComponent extends BaseItemList<SportType, PageQuery> {

  @Output()
  public readonly clickItem = new EventEmitter<SportType>();

  constructor(private _participantRestApiService: ParticipantRestApiService) {
    super();
    this.translationTitle = 'sportTypes';
    this.canEdit = false;
    this.itemDisplay = ItemDisplay.LIST;
    this.query = new PageQuery();
    this.fetchItems = async (direction: Direction, query: PageQuery): Promise<PageContainer<SportType>> => {
      return await this._participantRestApiService.getSportTypes(query);
    };
  }

}
