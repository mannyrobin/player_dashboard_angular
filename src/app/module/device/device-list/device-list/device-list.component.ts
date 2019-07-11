import {Component, EventEmitter, Output} from '@angular/core';
import {DialogResult} from '../../../../data/local/dialog-result';
import {Direction} from '../../../../components/ngx-virtual-scroll/model/direction';
import {PageContainer} from '../../../../data/remote/bean/page-container';
import {PageQuery} from '../../../../data/remote/rest-api/page-query';
import {Device} from '../../../../data/remote/model/device/device';
import {BaseItemList} from '../../../common/item-list/model/base-item-list';
import {DeviceApiService} from '../../../../data/remote/rest-api/api/device/device-api.service';
import {DeviceWindowService} from '../../../../services/windows/device-window/device-window.service';
import {ItemDisplay} from '../../../common/item-list/model/item-display';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent extends BaseItemList<Device, PageQuery> {

  @Output()
  public readonly clickItem = new EventEmitter<Device>();

  constructor(private _deviceApiService: DeviceApiService,
              private _deviceWindowService: DeviceWindowService) {
    super();
    this.translationTitle = 'devices';
    this.query = new PageQuery();
    this.itemDisplay = ItemDisplay.LIST;
    this.addItem = async (): Promise<DialogResult<Device>> => {
      return await this._deviceWindowService.openEditDevice(new Device());
    };
    this.fetchItems = async (direction: Direction, query: PageQuery): Promise<PageContainer<Device>> => {
      return await this._deviceApiService.getDevices(query).toPromise();
    };
  }

}
