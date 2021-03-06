import { Component, ViewChild } from '@angular/core';
import { BaseGroupComponent } from 'app/data/local/component/group/base-group-component';
import { Group } from 'app/data/remote/model/group/base';
import { GroupPerson, GroupPersonTypeStateEnum } from 'app/data/remote/model/group/person';
import { GroupPersonQuery } from 'app/data/remote/rest-api/query/group-person-query';
import { GroupPersonsListComponent } from 'app/module/group/group-persons-list/group-persons-list/group-persons-list.component';
import { GroupService } from 'app/pages/group/group-page/service/group.service';
import { AppHelper } from 'app/utils/app-helper';

@Component({
  selector: 'app-group-subscribers-page',
  templateUrl: './group-subscribers-page.component.html',
  styleUrls: ['./group-subscribers-page.component.scss']
})
export class GroupSubscribersPageComponent extends BaseGroupComponent<Group> {

  @ViewChild(GroupPersonsListComponent, {static: false})
  public groupPersonsListComponent: GroupPersonsListComponent;

  public query: GroupPersonQuery;

  constructor(groupService: GroupService, appHelper: AppHelper) {
    super(groupService, appHelper);
    this.query = new GroupPersonQuery();
  }

  async initializeGroupPerson(groupPerson: GroupPerson): Promise<void> {
    await super.initializeGroupPerson(groupPerson);
    this.query.id = this.group.id;
    this.query.stateEnum = GroupPersonTypeStateEnum.FOLLOWING;
    await this.groupPersonsListComponent.updateItems();
  }

}
