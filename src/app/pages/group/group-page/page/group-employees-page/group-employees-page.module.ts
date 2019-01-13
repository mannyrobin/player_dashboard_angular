import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupEmployeesPageRoutingModule} from './group-employees-page-routing.module';
import {GroupEmployeesPageComponent} from './group-employees-page/group-employees-page.component';
import {GroupPersonsListModule} from '../../../../../module/group/group-persons-list/group-persons-list.module';
import {DxSelectBoxModule} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    GroupEmployeesPageRoutingModule,
    GroupPersonsListModule,
    DxSelectBoxModule
  ],
  declarations: [GroupEmployeesPageComponent]
})
export class GroupEmployeesPageModule {
}
