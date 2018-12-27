import {ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditPersonComponent} from './edit-person/edit-person.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxGridModule} from '../../../components/ngx-grid/ngx-grid.module';
import {NgxButtonModule} from '../../../components/ngx-button/ngx-button.module';
import {DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule, DxValidatorModule} from 'devextreme-angular';
import {InputSelectModule} from '../../../components/input-select/input-select.module';
import {AttachFileModule} from '../../../components/attach-file/attach-file.module';
import {EditPersonRankModule} from '../edit-person-rank/edit-person-rank.module';
import {EditMedicalExaminationModule} from '../edit-medical-examination/edit-medical-examination.module';
import {EditPersonService} from './service/edit-person.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DxTextBoxModule,
    DxValidatorModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    NgxGridModule,
    NgxButtonModule,
    InputSelectModule,
    AttachFileModule,
    EditPersonRankModule,
    EditMedicalExaminationModule
  ],
  declarations: [EditPersonComponent],
  entryComponents: [EditPersonComponent],
  providers: [EditPersonService],
  exports: [EditPersonComponent],
})
export class EditPersonModule {

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _editPersonService: EditPersonService) {
    this._editPersonService.componentFactoryResolver = this._componentFactoryResolver;
  }

}
