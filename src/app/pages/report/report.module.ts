import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsPageComponent} from './reports-page/reports-page.component';
import {ReportRoutingModule} from './report-routing.module';
import {NgxVirtualScrollModule} from '../../components/ngx-virtual-scroll/ngx-virtual-scroll.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxModalModule} from '../../components/ngx-modal/ngx-modal.module';
import {NamedObjectModule} from '../../components/named-object/named-object.module';
import {ReportPageComponent} from './report-page/report-page.component';
import {EventBlocksComponent} from './report-page/event-blocks/event-blocks.component';
import {EventReportGeneralComponent} from './report-page/event-report-general/event-report-general.component';
import {PersonsEventBlockComponent} from './report-page/event-blocks/event-block/persons-event-block/persons-event-block.component';
import {GeneralEventBlockComponent} from './report-page/event-blocks/event-block/general-event-block/general-event-block.component';
import {ExercisesEventBlockComponent} from './report-page/event-blocks/event-block/exercises-event-block/exercises-event-block.component';
import {NgxSplitButtonModule} from '../../components/ngx-split-button/ngx-split-button.module';
import {EventReportService} from './report-page/service/event-report.service';
import {TrainingReportBlockComponent} from './component/training-report-block/training-report-block.component';
import {EventBlockComponent} from './report-page/event-blocks/event-block/event-block.component';
import {DxDateBoxModule, DxSelectBoxModule} from 'devextreme-angular';
import {NamedObjectItemModule} from '../../components/named-object-item/named-object-item.module';
import {NgxButtonGroupModule} from '../../components/ngx-button-group/ngx-button-group.module';
import {NgxTabModule} from '../../components/ngx-tab/ngx-tab.module';
import {GroupModule} from '../../components/group/group.module';
import {NgxButtonModule} from '../../components/ngx-button/ngx-button.module';
import {PersonItemModule} from '../../module/person/person-item/person-item.module';
import {GroupItemModule} from '../../module/group/group-item/group-item.module';
import {ExerciseMeasureItemModule} from '../../module/action/exercise-measure-item/exercise-measure-item.module';

// @NgModule({
//   imports: [
//     CommonModule,
//     ReportRoutingModule,
//     NgxVirtualScrollModule,
//     TranslateModule.forChild(),
//     NgxButtonModule,
//     NgxModalModule,
//     NamedObjectModule,
//     NgxTabModule,
//     NgxSplitButtonModule,
//     DxDateBoxModule,
//     DxSelectBoxModule,
//     NamedObjectItemModule,
//     NgxButtonGroupModule,
//     GroupModule,
//     PersonItemModule,
//     GroupItemModule,
//     ExerciseMeasureItemModule
//   ],
//   declarations: [
//     ReportsPageComponent,
//     ReportPageComponent,
//     EventBlocksComponent,
//     EventReportGeneralComponent,
//     PersonsEventBlockComponent,
//     GeneralEventBlockComponent,
//     ExercisesEventBlockComponent,
//     TrainingReportBlockComponent,
//     EventBlockComponent
//   ],
//   providers: [EventReportService]
// })
export class ReportModule {
}
