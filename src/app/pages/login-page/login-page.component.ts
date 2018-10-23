import {Component, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Auth} from '../../data/remote/model/auth';
import {Router} from '@angular/router';
import {Session} from '../../data/remote/model/session';
import {ProfileService} from '../../shared/profile.service';
import {AuthorizationService} from '../../shared/authorization.service';
import {AppHelper} from '../../utils/app-helper';
import {environment} from '../../../environments/environment';
import {IEnvironment} from '../../../environments/ienvironment';
import {EnvironmentType} from '../../../environments/environment-type';
import {LayoutService} from '../../layout/shared/layout.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnDestroy {

  public environmentType = EnvironmentType;
  public auth: Auth;
  public environment: IEnvironment;

  constructor(public translate: TranslateService,
              private _authorizationService: AuthorizationService,
              private _profileService: ProfileService,
              private _appHelper: AppHelper,
              private router: Router,
              private _layoutService: LayoutService) {
    this.auth = new Auth();
    this.environment = environment;
    this._layoutService.dark.next(true);
  }

  ngOnDestroy(): void {
    this._layoutService.dark.next(false);
  }

  public signIn = async () => {
    const session: Session = await this._authorizationService.logIn(this.auth);
    if (session) {
      if (session.person) {
        this._profileService.init();
        await this.router.navigate(['/person', session.person.id]);
      } else {
        await this.router.navigate(['/registration/person']);
      }
    } else {
      await this._appHelper.showErrorMessage('wrongLoginOrPassword');
      this.auth.password = null;
    }
  };

}
