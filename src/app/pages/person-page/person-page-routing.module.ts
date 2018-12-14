import {Routes} from '@angular/router';
import {AnthropometryComponent} from './person-page/anthropometry/anthropometry.component';
import {EventsComponent} from './person-page/events/events.component';
import {TestsResultsComponent} from './person-page/tests-results/tests-results.component';
import {GroupsComponent} from './person-page/groups/groups.component';
import {MyRegionComponent} from './person-page/my-region/my-region.component';
import {SchoolNoteComponent} from './person-page/my-region/school-note/school-note.component';
import {TrainerNoteComponent} from './person-page/my-region/trainer-note/trainer-note.component';
import {AgentNoteComponent} from './person-page/my-region/agent-note/agent-note.component';
import {RanksComponent} from './person-page/ranks/ranks.component';
import {AnthropometryHistoryComponent} from './person-page/anthropometry-history/anthropometry-history.component';
import {TestsResultsHistoryComponent} from './person-page/tests-results-history/tests-results-history.component';
import {RefereeCategoriesComponent} from './person-page/category/referee-categories/referee-categories.component';
import {MyGroupsComponent} from './person-page/my-groups/my-groups.component';
import {RequisitesComponent} from './person-page/requisites/requisites.component';
import {GroupPersonLogsComponent} from './component/group-person-logs/group-person-logs.component';
import {PersonStagesComponent} from './person-page/person-stages/person-stages.component';
import {MedicalExaminationsComponent} from './person-page/medical-examinations/medical-examinations.component';
import {PersonStageStandardsComponent} from './person-page/person-stage-standards/person-stage-standards.component';


const routes: Routes = [
  {
    children: [
      {path: '', redirectTo: 'personal', pathMatch: 'full'},
      {path: 'anthropometry', component: AnthropometryComponent},
      {path: 'anthropometry/:id', component: AnthropometryHistoryComponent},
      {path: 'ranks', component: RanksComponent},
      {path: 'events', component: EventsComponent},
      {path: 'tests_results', component: TestsResultsComponent},
      {path: 'tests_results/:id', component: TestsResultsHistoryComponent},
      {path: 'groups', component: GroupsComponent},
      {path: 'groups/:id/history', component: GroupPersonLogsComponent},
      {path: 'my-group', component: MyGroupsComponent},
      {path: 'requisites', component: RequisitesComponent},
      {
        path: 'my_region', component: MyRegionComponent, children: [
          {path: '', redirectTo: 'school', pathMatch: 'full'},
          {path: 'school', component: SchoolNoteComponent},
          {path: 'trainer', component: TrainerNoteComponent},
          {path: 'agent', component: AgentNoteComponent}
        ]
      },
      {path: 'category', component: RefereeCategoriesComponent},
      {path: 'stage', component: PersonStagesComponent},
      {path: 'stage-standard', component: PersonStageStandardsComponent},
      {path: 'medical-examination', component: MedicalExaminationsComponent},
    ]
  },

];

// @NgModule({
//   imports: [RouterModule.forChild([])],
//   exports: [RouterModule]
// })
export class PersonPageRoutingModule {
}
