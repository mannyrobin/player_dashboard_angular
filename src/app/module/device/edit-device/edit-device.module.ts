import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditDeviceComponent} from './edit-device/edit-device.component';
import {MatButtonModule, MatCheckboxModule, MatChipsModule, MatIconModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgxInputModule} from '../../ngx/ngx-input/ngx-input.module';
import {DeviceWindowService} from '../../../services/windows/device-window/device-window.service';
import {MediaLibraryModule} from '../../library/media-library/media-library.module';
import {ApplicationApiService} from '../../../data/remote/rest-api/api/application/application-api.service';

@NgModule({
  declarations: [EditDeviceComponent],
  entryComponents: [EditDeviceComponent],
  providers: [
    ApplicationApiService,
    DeviceWindowService
  ],
  exports: [EditDeviceComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule.forChild(),
    NgxInputModule,
    MediaLibraryModule
  ]
})
export class EditDeviceModule {
}
