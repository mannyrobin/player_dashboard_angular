import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { NgxModalService } from '../../../components/ngx-modal/service/ngx-modal.service';
import { NgxSelectionConfig } from '../../../components/ngx-selection/model/ngx-selection-config';
import { DialogResult } from '../../../data/local/dialog-result';
import { ImageFormat } from '../../../data/local/image-format';
import { Application } from '../../../data/remote/model/application/application';
import { Device } from '../../../data/remote/model/device/device';
import { ExternalResourceClass } from '../../../data/remote/model/external-resource';
import { FileClass } from '../../../data/remote/model/file/base';
import { ImageType } from '../../../data/remote/model/file/image';
import { BaseParameter } from '../../../data/remote/model/parameter/base-parameter';
import { ApplicationApiService } from '../../../data/remote/rest-api/api/application/application-api.service';
import { DeviceApiService } from '../../../data/remote/rest-api/api/device/device-api.service';
import { ExternalResourceApiService } from '../../../data/remote/rest-api/api/external-resource/external-resource-api.service';
import { PageQuery } from '../../../data/remote/rest-api/page-query';
import { ApplicationItemComponent } from '../../../module/application/application-item/application-item/application-item.component';
import { ItemDetailComponent } from '../../../module/common/item-detail/item-detail/item-detail.component';
import { CarouselField } from '../../../module/common/item-detail/model/carousel-field';
import { ChipsField } from '../../../module/common/item-detail/model/chips-field';
import { ImageField } from '../../../module/common/item-detail/model/image-field';
import { TextField } from '../../../module/common/item-detail/model/text-field';
import { UrlField } from '../../../module/common/item-detail/model/url-field';
import { VideoField } from '../../../module/common/item-detail/model/video-field';
import { EditDeviceComponent } from '../../../module/device/edit-device/edit-device/edit-device.component';
import { ParameterItemComponent } from '../../../module/parameter/parameter-item/parameter-item/parameter-item.component';
import { ModalBuilderService } from '../../../service/modal-builder/modal-builder.service';
import { AppHelper } from '../../../utils/app-helper';
import { UtilService } from '../../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceWindowService {

  constructor(private _ngxModalService: NgxModalService,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _modalBuilderService: ModalBuilderService,
              private _externalResourceApiService: ExternalResourceApiService,
              private _deviceApiService: DeviceApiService,
              private _applicationApiService: ApplicationApiService,
              private _appHelper: AppHelper,
              private _utilService: UtilService) {
  }

  public async openEditDevice<T extends Device>(device: T): Promise<DialogResult<T>> {
    const modal = this._ngxModalService.open();
    modal.componentInstance.titleKey = 'device';
    let editDeviceComponent: EditDeviceComponent;
    await modal.componentInstance.initializeBody(EditDeviceComponent, async component => {
      editDeviceComponent = component;

      await component.initialize(this._utilService.clone(device));

      modal.componentInstance.splitButtonItems = [
        this._ngxModalService.saveSplitItemButton(async () => {
          await this._ngxModalService.save(modal, component);
        }),
        this._ngxModalService.removeSplitItemButton(async () => {
          await this._ngxModalService.remove(modal, component);
        })
      ];
    }, {componentFactoryResolver: this._componentFactoryResolver});

    const dialogResult = new DialogResult<T>();
    dialogResult.result = await this._ngxModalService.awaitModalResult(modal);
    dialogResult.data = editDeviceComponent.data as T;
    return dialogResult;
  }

  public async openEditDeviceParameters<T extends BaseParameter>(device: Device, parameters: T[], config: NgxSelectionConfig<T>): Promise<DialogResult<T[]>> {
    return await this._modalBuilderService.showSelectionItemsModal(parameters, async (query: PageQuery) => {
      const items = (await this._deviceApiService.getDeviceParameters(device).toPromise()).map(x => x.parameter);
      return this._appHelper.arrayToPageContainer(items);
    }, ParameterItemComponent, async (component, data) => {
      component.canEdit = false;
      await component.initialize(data);
    }, config) as DialogResult<T[]>;
  }

  public async openDeviceDetail(device: Device): Promise<void> {
    const model = this._ngxModalService.open();
    model.componentInstance.title = `${device.name}`;
    model.componentInstance.useContentPadding = false;
    await model.componentInstance.initializeBody(ItemDetailComponent, async component => {
      component.leftTopLeftFields = [
        new ImageField('', device, ImageType.LOGO, FileClass.DEVICE, ImageFormat.CIRCLE)
      ];
      component.leftTopRightFields = [
        new TextField('shortName', device.shortName),
        new UrlField('manufacturer', device.manufacturerResource)
      ];
      component.leftFields = [
        new TextField('description', device.description),
        new ChipsField('parameters', device.parameterVersions.map(x => x.parameter.name))
      ];

      component.rightFields = [
        new CarouselField(device, FileClass.DEVICE, '')
      ];

      const externalResources = await this._externalResourceApiService.getExternalResources(ExternalResourceClass.DEVICE, device).toPromise();
      if (externalResources.length && externalResources[0].url) {
        component.rightFields.push(new VideoField('', externalResources[0].url));
      }
    });
    await this._ngxModalService.awaitModalResult(model);
  }

  public async openEditApplications<T extends Application>(parameters: T[], config: NgxSelectionConfig<T>): Promise<DialogResult<T[]>> {
    return await this._modalBuilderService.showSelectionItemsModal(parameters, async (query: PageQuery) =>
      this._applicationApiService.getApplications(query).toPromise(), ApplicationItemComponent, async (component, data) => {
      component.canEdit = false;
      await component.initialize(data);
    }, config) as DialogResult<T[]>;
  }

}
