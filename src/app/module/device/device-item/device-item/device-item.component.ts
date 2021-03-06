import {Component, forwardRef, Inject} from '@angular/core';
import {DeviceWindowService} from '../../../../services/windows/device-window/device-window.service';
import {Device} from '../../../../data/remote/model/device/device';
import {DialogResult} from '../../../../data/local/dialog-result';
import {BaseLibraryItem} from '../../../library/base-library-item/model/base-library-item';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss']
})
export class DeviceItemComponent extends BaseLibraryItem<Device> {

  constructor(// TODO: DeviceWindowService can't inject without forwardRef()
    @Inject(forwardRef(() => DeviceWindowService))
    private _deviceWindowService: DeviceWindowService) {
    super();
  }

  public getInfo = async (item: Device): Promise<void> => {
    await this._deviceWindowService.openDeviceDetail(this.data);
  };

  public openEditItem = async (item: Device): Promise<DialogResult<Device>> => {
    return await this._deviceWindowService.openEditDevice(this.data);
  };

}
