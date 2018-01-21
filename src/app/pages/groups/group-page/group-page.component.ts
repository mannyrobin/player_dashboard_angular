import { Component, OnInit } from '@angular/core';
import { Group } from '../../../data/remote/model/group/base/group';
import { ParticipantRestApiService } from '../../../data/remote/rest-api/participant-rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { GroupPerson } from '../../../data/remote/model/group/group-person';
import { ImageType } from '../../../data/remote/model/image-type';
import { GroupPersonState } from '../../../data/local/group-person-state';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.scss']
})
export class GroupPageComponent implements OnInit {

  public group: Group;
  public groupPerson: GroupPerson;

  public imageLogoUrl: string;
  public textStateInGroup: string;

  private _groupPersonState: GroupPersonState;

  constructor(private _participantRestApiService: ParticipantRestApiService,
              private _activatedRoute: ActivatedRoute) {
    this._groupPersonState = GroupPersonState.NOT_MEMBER;
    this.textStateInGroup = 'join';
  }

  async ngOnInit() {
    const groupId = this._activatedRoute.snapshot.params.id;
    this.group = await this._participantRestApiService.getGroup({id: groupId});
    if (this.group != null) {
      await this.baseInit();
    }
  }

  async baseInit() {
    this.imageLogoUrl = this._participantRestApiService.getImageUrl({
      clazz: 'group',
      id: this.group.id,
      type: ImageType.LOGO
    });

    this.groupPerson = await this._participantRestApiService.getCurrentGroupPerson({id: this.group.id});

    if (this.groupPerson == null) {
      this._groupPersonState = GroupPersonState.NOT_MEMBER;
      this.textStateInGroup = 'join';
    } else {
      if (this.groupPerson.approved) {
        this._groupPersonState = GroupPersonState.MEMBER;
        this.textStateInGroup = 'leave';
      } else {
        this._groupPersonState = GroupPersonState.CONSIDERATION;
        this.textStateInGroup = 'cancelJoin';
      }
    }
  }

  public async onGroupPersonState() {
    if (this._groupPersonState === GroupPersonState.NOT_MEMBER) {
      await this._participantRestApiService.joinGroup({id: this.group.id});
    } else {
      await this._participantRestApiService.leaveGroup({id: this.group.id});
    }
    await this.baseInit();
  }

}
