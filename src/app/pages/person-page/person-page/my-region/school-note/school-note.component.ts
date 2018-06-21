import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DxTextBoxComponent} from 'devextreme-angular';
import {PropertyConstant} from '../../../../../data/local/property-constant';
import {NoteType} from '../../../../../data/remote/model/note/base/note-type';
import {MyRegionService} from '../my-region.service';
import {NgxVirtualScrollComponent} from '../../../../../components/ngx-virtual-scroll/ngx-virtual-scroll/ngx-virtual-scroll.component';
import {ISubscription} from 'rxjs-compat/Subscription';

@Component({
  selector: 'app-school-note',
  templateUrl: './school-note.component.html',
  styleUrls: ['./school-note.component.scss']
})
export class SchoolNoteComponent implements OnInit, OnDestroy {

  @ViewChild(NgxVirtualScrollComponent)
  public ngxVirtualScrollComponent: NgxVirtualScrollComponent;

  @ViewChild('name')
  public name: DxTextBoxComponent;

  @ViewChild('phone')
  public phone: DxTextBoxComponent;

  @ViewChild('email')
  public email: DxTextBoxComponent;

  private nameSubscription: ISubscription;
  private phoneSubscription: ISubscription;
  private emailSubscription: ISubscription;

  constructor(public myRegionService: MyRegionService) {
  }

  async ngOnInit() {
    this.myRegionService.reset = async () => {
      setTimeout(async () => {
        await this.ngxVirtualScrollComponent.reset();
      });
    };

    await this.myRegionService.initialize(NoteType.SCHOOL);

    this.nameSubscription = this.name.onValueChanged.debounceTime(PropertyConstant.searchDebounceTime)
      .subscribe(event => this.myRegionService.setName(event));
    this.phoneSubscription = this.phone.onValueChanged.debounceTime(PropertyConstant.searchDebounceTime)
      .subscribe(event => this.myRegionService.setPhone(event));
    this.emailSubscription = this.email.onValueChanged.debounceTime(PropertyConstant.searchDebounceTime)
      .subscribe(event => this.myRegionService.setEmail(event));
  }

  ngOnDestroy(): void {
    this.nameSubscription.unsubscribe();
    this.phoneSubscription.unsubscribe();
    this.emailSubscription.unsubscribe();
  }

}
