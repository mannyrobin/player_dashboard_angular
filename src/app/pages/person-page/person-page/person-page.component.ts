import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ImageComponent} from '../../../components/image/image.component';
import {GroupComponent} from '../../groups/group/group.component';
import {PersonTab} from './person-tab';
import {PersonViewModel} from '../../../data/local/view-model/person-view-model';
import {ISubscription} from 'rxjs-compat/Subscription';
import {PersonService} from './person.service';
import {ParticipantRestApiService} from '../../../data/remote/rest-api/participant-rest-api.service';
import {AuthorizationService} from '../../../shared/authorization.service';
import {AppHelper} from '../../../utils/app-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserRoleEnum} from '../../../data/remote/model/user-role-enum';
import {Image} from '../../../data/remote/model/file/image/image';
import {FileClass} from '../../../data/remote/model/file/base/file-class';
import {ImageType} from '../../../data/remote/model/file/image/image-type';
import {ModalSelectPageComponent} from '../../../components/modal-select-page/modal-select-page.component';
import {UserRoleItemComponent} from '../../../components/user-role-item/user-role-item.component';
import {PageContainer} from '../../../data/remote/bean/page-container';
import {ListRequest} from '../../../data/remote/request/list-request';
import {UserRole} from '../../../data/remote/model/user-role';
import {SportType} from '../../../data/remote/model/sport-type';
import {IdentifiedObject} from '../../../data/remote/base/identified-object';
import {Person} from '../../../data/remote/model/person';
import {SportTypeItemComponent} from '../../../components/sport-type-item/sport-type-item.component';

@Component({
  selector: 'app-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss']
})
export class PersonPageComponent implements OnInit, OnDestroy {

  @ViewChild('logo')
  public logoImageComponent: ImageComponent;

  @ViewChild(GroupComponent)
  public groupComponent: GroupComponent;

  public readonly tabs: PersonTab[];
  public allowEdit: boolean;
  public allowEditConnection: boolean;
  public hasConnection: boolean;
  public editContactNameKey: string;
  public personViewModel: PersonViewModel;

  private readonly _baseGroupSubscription: ISubscription;

  constructor(public  personService: PersonService,
              private _participantRestApiService: ParticipantRestApiService,
              private _authorizationService: AuthorizationService,
              private _appHelper: AppHelper,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _modalService: NgbModal) {
    //#region Tabs
    this.tabs = [];

    this.tabs.push(new PersonTab('persons.person.personal.section', 'personal', []));
    this.tabs.push(new PersonTab('persons.person.anthropometry.section', 'anthropometry',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.REFEREE, UserRoleEnum.TRAINER, UserRoleEnum.SCOUT], true));
    this.tabs.push(new PersonTab('persons.person.ranks.section', 'ranks',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.REFEREE, UserRoleEnum.TRAINER, UserRoleEnum.SCOUT], true));
    this.tabs.push(new PersonTab('persons.person.achievements.section', 'achievements',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.REFEREE, UserRoleEnum.TRAINER, UserRoleEnum.ATHLETE], true, true));
    this.tabs.push(new PersonTab('persons.person.myRegion.section', 'my_region',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.REFEREE, UserRoleEnum.TRAINER, UserRoleEnum.ATHLETE], true, true));
    this.tabs.push(new PersonTab('persons.person.contact.section', 'contact', []));
    this.tabs.push(new PersonTab('persons.person.testsResults.section', 'tests_results',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.REFEREE, UserRoleEnum.TRAINER, UserRoleEnum.SCOUT], true));
    this.tabs.push(new PersonTab('events', 'events', [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR], true));
    this.tabs.push(new PersonTab('persons.person.groups.section', 'groups', [], true));
    this.tabs.push(new PersonTab('categories', 'category',
      [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.ATHLETE, UserRoleEnum.SCOUT, UserRoleEnum.TRAINER], true));
    //#endregion

    this._baseGroupSubscription = this.personService.baseGroupHandler.subscribe(value => {
      if (value && this.groupComponent) {
        this.groupComponent.update(value.group);
      }
    });
  }

  public async ngOnInit() {
    const params = this._activatedRoute.snapshot.params;
    if (!params.id) {
      return;
    }

    await this.initialize(params.id);

    await this.userRoleRefresh();
    await this.sportTypeRefresh();
  }

  ngOnDestroy(): void {
    this._appHelper.unsubscribe(this._baseGroupSubscription);
  }

  public async initialize(personId: number) {
    this.personViewModel = await this.personService.initialize(personId);
    this.allowEdit = this.personService.allowEdit();
    await this.connectionInitialize(this.personService.personViewModel.data);
  }

  public async onLogoChanged(fileList: FileList) {
    // TODO: Upload in image component
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const image: Image = new Image();
      image.clazz = FileClass.PERSON;
      image.objectId = this.personService.personViewModel.data.id;
      image.type = ImageType.LOGO;
      const files = await this._participantRestApiService.uploadFile(image, [file]);
      this.personService.logoHandler.next(files[0]);
      this.logoImageComponent.refresh();
      // TODO: Add refresh logo
      // this._navbarService.emitLogoChange(true);
    }
  }

  //#region UserRole
  public async onEditUserRoles() {
    const userRoles = await this._participantRestApiService.getUserRoles();
    const ref = this._modalService.open(ModalSelectPageComponent, {size: 'lg'});
    const componentInstance = ref.componentInstance as ModalSelectPageComponent<any>;
    componentInstance.headerNameKey = 'edit';
    componentInstance.component = UserRoleItemComponent;
    componentInstance.getItems = async pageQuery => {
      const items = userRoles.filter(userRole => userRole.userRoleEnum.toString().toLowerCase().indexOf(pageQuery.name) > -1);
      const pageContainer = new PageContainer();
      pageContainer.from = 0;
      pageContainer.size = items.length;
      pageContainer.total = items.length;
      pageContainer.list = items;
      return pageContainer;
    };
    componentInstance.onSave = async selectedItems => {
      try {
        // TODO: Use method by user
        this.personService.userRoles = await this._participantRestApiService.changeRoles(new ListRequest(selectedItems));
        const selectedItem = this.personService.userRoles.length ? this.personService.userRoles[0] : null;
        this.personService.setUserRole(selectedItem);
        await this.userRoleRefresh(selectedItem);
        ref.dismiss();
      } catch (e) {
        if (e.status === 409) {
          await this._appHelper.showErrorMessage('persons.person.roles.conflict');
        } else {
          await this._appHelper.showErrorMessage('saveError');
        }
      }
    };
    await componentInstance.initialize(this.personService.userRoles);
  }

  public async onSelectedUserRole(userRole: UserRole) {
    this.personService.userRoleHandler.next(userRole);

    if (await this.tabAvailableInUserRole(userRole)) {
      await this.userRoleRefresh(userRole);
    }
  }

  public async userRoleRefresh(userRole: UserRole = null) {
    await this.setToggle('userRole', this.personService.userRoles, userRole, selectedItem => {
      this.personService.setUserRole(selectedItem);
    });
  }

  //#endregion

  //#region SportType
  public async onEditSportTypes() {
    const ref = this._modalService.open(ModalSelectPageComponent, {size: 'lg'});
    const componentInstance = ref.componentInstance as ModalSelectPageComponent<any>;
    componentInstance.headerNameKey = 'edit';
    componentInstance.component = SportTypeItemComponent;
    componentInstance.getItems = async pageQuery => {
      return await this._participantRestApiService.getSportTypes(pageQuery);
    };
    componentInstance.onSave = async selectedItems => {
      try {
        // TODO: Use method by person
        this.personService.sportTypes = await this._participantRestApiService.changeSportTypes(new ListRequest(selectedItems));
        const selectedItem = this.personService.sportTypes.length ? this.personService.sportTypes[0] : null;
        this.personService.setSportType(selectedItem);
        await this.sportTypeRefresh(selectedItem);
        ref.dismiss();
      } catch (e) {
        await this._appHelper.showErrorMessage('saveError');
      }
    };

    await componentInstance.initialize(this.personService.sportTypes);
  }

  public async onSelectedSportType(sportType: SportType) {
    this.personService.sportTypeHandler.next(sportType);
    await this.sportTypeRefresh(sportType);
  }

  public async sportTypeRefresh(sportType: SportType = null) {
    await this.setToggle('sportType', this.personService.sportTypes, sportType, selectedItem => {
      this.personService.setSportType(selectedItem);
      return true;
    });
  }

  //#endregion

  public tabVisible = (item: PersonTab): boolean => {
    return item &&
      (!item.personal || this.allowEdit) &&
      (!item.hasAnyRole || this.personService.selectedUserRole && item.restrictedRoles.indexOf(this.personService.selectedUserRole.userRoleEnum) < 0);
  };

  private async tabAvailableInUserRole(userRole: UserRole): Promise<boolean> {
    const currentTab = this.tabs.filter(t => this._router.url.includes(t.routerLink))[0];
    if (!this.personService.selectedUserRole || currentTab && currentTab.restrictedRoles.indexOf(UserRoleEnum[this.personService.selectedUserRole.userRoleEnum]) > -1) {
      await this._router.navigate(['./'], {relativeTo: this._activatedRoute});
      return false;
    }
    return true;
  }

  private async setToggle<T extends IdentifiedObject>(queryParamKey: string, items: T[], selectedObject: T, selected: (selectedItem: T) => void) {
    const queryParams = Object.assign({}, this._activatedRoute.snapshot.queryParams);
    const queryParam = queryParams[queryParamKey];

    if (!items.length && queryParam) {
      delete queryParams[queryParamKey];
    } else {
      if (selectedObject) {
        queryParams[queryParamKey] = selectedObject.id;
      } else {
        if (queryParam) {
          const selectedItems = items.filter(x => x.id == +queryParam);
          if (selectedItems && selectedItems.length) {
            selected(selectedItems[0]);
            queryParams[queryParamKey] = selectedItems[0].id;
          } else {
            selected(items[0]);
            queryParams[queryParamKey] = items[0].id;
          }
        }
      }
    }

    await this._router.navigate([], {relativeTo: this._activatedRoute, queryParams: queryParams});
  }

  //#region Person connection

  public onEditContactClick = async (): Promise<void> => {
    await this.editConnection(this.personService.personViewModel.data);
  };

  private async connectionInitialize(person: Person) {
    this.allowEditConnection = person.id != this._authorizationService.session.personId;
    if (!this.allowEditConnection) {
      return;
    }

    try {
      this.hasConnection = (await this._participantRestApiService.hasConnection({id: person.id})).value;
      this.editContactNameKey = this.hasConnection ? 'removeContact' : 'addContact';
    } catch (e) {
    }
  }

  private async editConnection(person: Person): Promise<void> {
    try {
      if (this.hasConnection) {
        await this._participantRestApiService.removeConnection({id: person.id});
      } else {
        await this._participantRestApiService.createConnection({id: person.id});
      }

      this.hasConnection = !this.hasConnection;
      this.editContactNameKey = this.hasConnection ? 'removeContact' : 'addContact';
    } catch (e) {
      await this._appHelper.showErrorMessage('error');
    }
  }

  //#endregion

}
