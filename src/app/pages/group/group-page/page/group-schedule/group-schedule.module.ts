import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupScheduleModule as GroupSchedule } from '../../../../../module/group/group-schedule/group-schedule.module';
import { GroupScheduleRoutingModule } from './group-schedule-routing.module';
import { GroupScheduleComponent } from './group-schedule/group-schedule.component';

@NgModule({
  declarations: [GroupScheduleComponent],
  imports: [
    CommonModule,
    GroupScheduleRoutingModule,
    GroupSchedule
  ]
})
export class GroupScheduleModule {
}
