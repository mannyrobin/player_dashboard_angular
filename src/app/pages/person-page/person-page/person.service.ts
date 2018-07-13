import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SportType} from '../../../data/remote/model/sport-type';
import {UserRole} from '../../../data/remote/model/user-role';
import {ParticipantRestApiService} from '../../../data/remote/rest-api/participant-rest-api.service';
import {Image} from '../../../data/remote/model/file/image/image';
import {PersonViewModel} from '../../../data/local/view-model/person-view-model';
import {GroupPerson} from '../../../data/remote/model/group/group-person';
import {ISubscription} from 'rxjs-compat/Subscription';
import {AppHelper} from '../../../utils/app-helper';

@Injectable()
export class PersonService implements OnDestroy {

  public personViewModel: PersonViewModel;
  public userRoles: UserRole[];
  public sportTypes: SportType[];

  public selectedUserRole: UserRole;
  public selectedSportType: SportType;
  // BaseGroup by SelectedUserRole
  public baseGroup: GroupPerson;

  public readonly userRoleHandler: Subject<UserRole>;
  public readonly sportTypeHandler: Subject<SportType>;
  public readonly baseGroupHandler: Subject<GroupPerson>;
  public readonly logoHandler: Subject<Image>;

  private _userRoleSubscription: ISubscription;

  public constructor(private _participantRestApiService: ParticipantRestApiService,
                     private _appHelper: AppHelper) {
    this.userRoleHandler = new Subject<UserRole>();
    this.sportTypeHandler = new Subject<SportType>();
    this.baseGroupHandler = new Subject<GroupPerson>();
    this.logoHandler = new Subject<Image>();

    this.userRoles = [];
    this.sportTypes = [];

    this.selectedUserRole = null;
    this.selectedSportType = null;
    this.baseGroup = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  public async initialize(personId: number): Promise<PersonViewModel> {
    try {
      const person = await this._participantRestApiService.getPerson({id: personId});
      this.personViewModel = new PersonViewModel(person);
      await this.personViewModel.initialize();
      if (person && person.id) {
        if (person.user && person.user.id) {
          this.userRoles = await  this._participantRestApiService.getUserUserRoles({userId: person.user.id});
          if (this.userRoles.length) {
            this.selectedUserRole = this.userRoles[0];
          }
        }

        this.sportTypes = await  this._participantRestApiService.getPersonSportTypes({id: person.id});
        if (this.sportTypes.length) {
          this.selectedSportType = this.sportTypes[0];
        }

        this._userRoleSubscription = this.userRoleHandler.subscribe(async value => {
          if (value) {
            try {
              this.baseGroup = await this._participantRestApiService.getPersonBaseGroup({
                personId: this.personViewModel.data.id,
                userRoleId: value.id
              });
            } catch (e) {
              this.baseGroup = null;
            }
          } else {
            this.baseGroup = null;
          }
          this.baseGroupHandler.next(this.baseGroup);
        });
      }

      return this.personViewModel;
    } catch (e) {
    }
    return null;
  }

  public setUserRole(userRole: UserRole) {
    this.selectedUserRole = userRole;
    this.userRoleHandler.next(userRole);
  }

  public setSportType(sportType: SportType) {
    this.selectedSportType = sportType;
    this.sportTypeHandler.next(sportType);
  }

  public setBaseGroup(baseGroup: GroupPerson) {
    this.baseGroup = baseGroup;
    this.baseGroupHandler.next(baseGroup);
  }

  public subscribe() {
  }

  public unsubscribe() {
    this._appHelper.unsubscribe(this._userRoleSubscription);
  }

  public async allowEdit(): Promise<boolean> {
    try {
      return (await  this._participantRestApiService.canEditPerson({personId: this.personViewModel.data.id})).value;
    } catch (e) {
    }
    return false;
  }

}
