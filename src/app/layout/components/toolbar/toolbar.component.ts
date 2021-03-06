import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { navigation } from 'app/navigation/navigation';
import { TemplateModalService } from 'app/service/template-modal.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FileClass } from '../../../data/remote/model/file/base/file-class';
import { ImageType } from '../../../data/remote/model/file/image';
import { Group } from '../../../data/remote/model/group/base/group';
import { Person } from '../../../data/remote/model/person';
import { FileApiService } from '../../../data/remote/rest-api/api/file/file-api.service';
import { GroupApiService } from '../../../data/remote/rest-api/api/group/group-api.service';
import { NotificationApiService } from '../../../data/remote/rest-api/api/notification/notification-api.service';
import { AuthorizationService } from '../../../shared/authorization.service';
import { NotificationService } from '../../../shared/notification.service';
import { ToolbarService } from './services/toolbar.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  navigation: any;
  userStatusOptions: any[];

  public readonly imageTypeClass = ImageType;
  public readonly fileClassClass = FileClass;
  public person: Person;
  public personLogoUrl: string;
  public notificationsNumber: number;
  public groups: Group[] = [];
  public selectedGroup: Group;
  public visibleGroupMenu: boolean;
  public canShowMoreGroups: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _translateService: TranslateService,
    private _authorizationService: AuthorizationService,
    private _fileApiService: FileApiService,
    private _router: Router,
    private _notificationApiService: NotificationApiService,
    private _groupApiService: GroupApiService,
    private _toolbarService: ToolbarService,
    private _notificationService: NotificationService,
    private _matIconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    private _templateModalService: TemplateModalService
  ) {
    // Set the defaults
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];
    this._matIconRegistry.addSvgIcon('events-today', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/img/events-today.svg'));

    this.navigation = navigation;

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this._authorizationService.personSubject.pipe(
      takeUntil(this._unsubscribeAll)
    )
      .subscribe(val => {
        this.person = val;
        if (val) {
          this.personLogoUrl = `${this._fileApiService.getImageUrl(FileClass.PERSON, val, {
            type: ImageType.LOGO,
            width: 40,
            height: 40,
            cropped: true
          })}&date=${Date.now()}`;
          this._groupApiService.getGroups({canEdit: true})
            .pipe(take(1))
            .subscribe(value => {
              this.groups = value.list;
              delete this.canShowMoreGroups;
              if (value.list.length > 4) {
                this.groups.length = 4;
                this.canShowMoreGroups = true;
              }
            });
        } else {
          delete this.personLogoUrl;
          this.groups = [];
        }
      });
    this._notificationService.notification$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.notificationsNumber = value.unread;
      });

    this._toolbarService.group$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.selectedGroup = value;
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._notificationApiService.getUnreadCount().subscribe(value => {
      this.notificationsNumber = value;
    });
    // Subscribe to the config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === 'top';
        this.rightNavbar = settings.layout.navbar.position === 'right';
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }

  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
    console.log(value);
  }

  public onToggleVisibilityMenu(): void {
    this.visibleGroupMenu = !this.visibleGroupMenu;
    this._toolbarService.updateVisibleGroupMenu(this.visibleGroupMenu);
  }

  public async onNavigateToGroup(group: Group) {
    await this._router.navigate(['/group', group.id]);
  }

  public async onShowMoreGroups(): Promise<void> {
    await this._templateModalService.showSelectionGroupsModal([], {canEdit: true}, {maxCount: 1});
  }

  public async navigateToPersonSettings() {
    await this._router.navigate(['/person', 'settings']);
  }

  public async signOut() {
    await this._authorizationService.logOut();
  }

}
