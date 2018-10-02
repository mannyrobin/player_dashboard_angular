import {Component, Input} from '@angular/core';
import {IconEnum} from '../model/icon-enum';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'ngx-button',
  templateUrl: './ngx-button.component.html',
  styleUrls: ['./ngx-button.component.scss']
})
export class NgxButtonComponent<TData extends any> {

  public readonly enterKeyCode: number;
  public readonly delayDisplayBusy: number;

  @Input('class')
  public classes: string;

  @Input()
  public nameKey: string;

  @Input()
  public icon: IconEnum;

  @Input()
  public click: (data?: TData, event?: Event) => Promise<void>;

  @Input()
  public data: TData;

  @Input()
  public disabled: () => boolean;

  @Input()
  public checkPressedEnter: boolean;

  public busy: boolean;
  public busyDisplay: boolean;

  constructor() {
    this.enterKeyCode = 13;
    this.delayDisplayBusy = 300;
  }

  public async onClick(e: Event): Promise<void> {
    if (this.click && !this.busy) {
      this.busy = true;

      const subscription = Observable.of([]).delay(this.delayDisplayBusy).subscribe(() => {
        this.busyDisplay = true;
      });

      try {
        await this.click(this.data, e);
      } catch (e) {
      } finally {
        subscription.unsubscribe();
        this.busy = false;
        this.busyDisplay = false;
      }
    }
  }

  public async onKeyUp(event: any): Promise<void> {
    if (this.checkPressedEnter && event.keyCode == this.enterKeyCode) {
      await this.onClick(event);
    }
  }

}
