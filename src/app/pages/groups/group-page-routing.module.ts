import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GroupsPageComponent} from './groups-page/groups-page.component';
import {GroupPageComponent} from './group-page/group-page.component';
import {AllGroupsComponent} from './groups-page/all-groups/all-groups.component';
import {MyGroupsComponent} from './groups-page/my-groups/my-groups.component';
import {NewGroupPageComponent} from './new-group-page/new-group-page.component';
import {GroupPersonsComponent} from './group-persons/group-persons.component';
import {GroupAdministrationComponent} from './group-administration/group-administration.component';
import {GroupSettingsComponent} from './group-administration/group-settings/group-settings.component';
import {SubgroupsComponent} from './group-administration/subgroups/subgroups.component';
import {MembersComponent} from './group-administration/members/members.component';

const routes: Routes = [
  {
    path: '', component: GroupsPageComponent,
    children: [
      {path: '', redirectTo: 'all', pathMatch: 'full'},
      {path: 'all', component: AllGroupsComponent},
      {path: 'my', component: MyGroupsComponent},
    ]
  },
  {
    path: 'new', component: NewGroupPageComponent,
  },
  {
    path: ':id', component: GroupPageComponent,
    children: [
      {path: '', redirectTo: 'subgroup/0', pathMatch: 'full'},
      {path: 'subgroup/:id', component: GroupPersonsComponent},
      {
        path: 'administration', component: GroupAdministrationComponent,
        children: [
          {path: '', redirectTo: 'settings', pathMatch: 'full'},
          {path: 'settings', component: GroupSettingsComponent},
          {path: 'member', component: MembersComponent},
          {path: 'subgroup', component: SubgroupsComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupPageRoutingModule {
}
