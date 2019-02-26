import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupsListComponent} from './groups-list/groups-list.component';
import {NgxVirtualScrollModule} from '../../../components/ngx-virtual-scroll/ngx-virtual-scroll.module';
import {GroupItemModule} from '../group-item/group-item.module';

@NgModule({
  imports: [
    CommonModule,
    NgxVirtualScrollModule,
    GroupItemModule
  ],
  declarations: [GroupsListComponent],
  exports: [GroupsListComponent]
})
export class GroupsListModule {
}
