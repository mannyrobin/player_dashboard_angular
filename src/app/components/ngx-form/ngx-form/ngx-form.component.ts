import {Component, ContentChildren, QueryList} from '@angular/core';
import {NgxInputComponent} from '../../ngx-input/ngx-input/ngx-input.component';

@Component({
  // tslint:disable:component-selector
  selector: 'ngx-form',
  templateUrl: './ngx-form.component.html',
  styleUrls: ['./ngx-form.component.scss']
})
export class NgxFormComponent {

  @ContentChildren(NgxInputComponent)
  public ngxColumnComponents: QueryList<NgxInputComponent>;

  public async valid(withNotification: boolean = true): Promise<boolean> {
    const items = this.ngxColumnComponents.toArray();
    let valid = true;
    for (const item of items) {
      if (!(await item.onCheckValidation(withNotification))) {
        valid = false;
        if (!withNotification) {
          break;
        }
      }
    }
    return valid;
  }

}
