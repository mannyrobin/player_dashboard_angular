import {Component, ComponentFactoryResolver, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseEditComponent} from '../../../../data/local/component/base/base-edit-component';
import {Poll} from '../../../../data/remote/model/poll/poll';
import {ParticipantRestApiService} from '../../../../data/remote/rest-api/participant-rest-api.service';
import {AppHelper} from '../../../../utils/app-helper';
import {PollApiService} from '../../../../data/remote/rest-api/api/poll/poll-api.service';
import {NgxInput} from '../../../ngx/ngx-input/model/ngx-input';
import {FormGroup, Validators} from '@angular/forms';
import {PollQuestion} from '../../../../data/remote/model/poll/poll-question';
import {EditPollQuestionComponent} from '../../../event/edit-poll-question/edit-poll-question/edit-poll-question.component';
import {NgxModalService} from '../../../../components/ngx-modal/service/ngx-modal.service';
import {PollPerson} from '../../../../data/remote/model/poll/poll-person';
import {PollVersionApiService} from '../../../../data/remote/rest-api/api/poll-version/poll-version-api.service';
import {NgxSelect} from '../../../ngx/ngx-select/model/ngx-select';
import {TranslateObjectService} from '../../../../shared/translate-object.service';
import {PollTypeEnum} from '../../../../data/remote/model/poll/poll-type-enum';
import {NameWrapper} from '../../../../data/local/name-wrapper';
import {NgxInputType} from '../../../ngx/ngx-input/model/ngx-input-type';
import {AuthorizationService} from '../../../../shared/authorization.service';
import {takeWhile} from 'rxjs/operators';
import {Person} from '../../../../data/remote/model/person';
import {AppliedPollApiService} from '../../../../data/remote/rest-api/api/applied-poll/applied-poll-api.service';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.scss']
})
export class EditPollComponent extends BaseEditComponent<Poll> implements OnInit, OnDestroy {

  @Input()
  public pollPerson: PollPerson;

  public nameNgxInput: NgxInput;
  public descriptionNgxInput: NgxInput;
  public pollTypeNgxSelect: NgxSelect<NameWrapper<PollTypeEnum>>;
  public pollQuestions: PollQuestion[] = [];
  private _formGroup = new FormGroup({});
  private _person: Person;
  private _notDestroyed = true;

  constructor(private _pollApiService: PollApiService,
              private _pollVersionApiService: PollVersionApiService,
              private _appliedPollApiService: AppliedPollApiService,
              private _ngxModalService: NgxModalService,
              private _translateObjectService: TranslateObjectService,
              private _componentFactoryResolver: ComponentFactoryResolver,
              private _authorizationService: AuthorizationService,
              participantRestApiService: ParticipantRestApiService, appHelper: AppHelper) {
    super(participantRestApiService, appHelper);
  }

  public get canEdit(): boolean {
    return !this.pollPerson && (this.isNew || this.isCreatorPoll);
  }

  public get isCreatorPoll(): boolean {
    return !!this.data && this._person && (!this.data.owner && !this.data.id || this.data.owner.id == this._person.user.id);
  }

  public get canExecutePoll(): boolean {
    return !!(this.pollPerson && !this.pollPerson.completed);
  }

  public async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this._authorizationService.person$
      .pipe(takeWhile(() => this._notDestroyed))
      .subscribe((value) => {
        this._person = value;
      });
  }

  public ngOnDestroy(): void {
    delete this._notDestroyed;
  }

  public async onFinishPoll(): Promise<boolean> {
    return await this.appHelper.trySave(async () => {
      this.pollPerson = await this._appliedPollApiService.completePoll(this.pollPerson.appliedPoll).toPromise();
    });
  }

  public async onAddPollQuestion(): Promise<boolean> {
    return await this.appHelper.trySave(async () => {
      if (this.isNew) {
        await this.onSave();
      }
      await this.showEditPollQuestion(new PollQuestion());
    }, false);
  }

  public async onEditPollQuestion(item: PollQuestion): Promise<boolean> {
    return await this.appHelper.trySave(async () => {
      await this.showEditPollQuestion(item);
    }, false);
  }

  private async showEditPollQuestion(obj: PollQuestion): Promise<boolean> {
    const modal = this._ngxModalService.open();
    modal.componentInstance.titleKey = 'edit';
    await modal.componentInstance.initializeBody(EditPollQuestionComponent, async component => {
      component.poll = this.data;
      await component.initialize(this.appHelper.cloneObject(obj));

      modal.componentInstance.splitButtonItems = [
        this._ngxModalService.saveSplitItemButton(async () => {
          if (await this._ngxModalService.save(modal, component)) {
            const index = this.pollQuestions.indexOf(obj);
            if (index < 0) {
              this.pollQuestions.push(component.data);
            } else {
              this.pollQuestions[index] = component.data;
            }
          }
        }),
        this._ngxModalService.removeSplitItemButton(async () => {
          if (await this._ngxModalService.remove(modal, component)) {
            this.pollQuestions.splice(this.pollQuestions.indexOf(obj), 1);
          }
        })
      ];
    }, {componentFactoryResolver: this._componentFactoryResolver});
    return await this._ngxModalService.awaitModalResult(modal);
  }

  protected async initializeComponent(data: Poll): Promise<boolean> {
    const result = await super.initializeComponent(data);
    if (result) {
      return this.appHelper.tryLoad(async () => {
        this.pollTypeNgxSelect = new NgxSelect<NameWrapper<PollTypeEnum>>();
        this.pollTypeNgxSelect.labelTranslation = 'pollType';
        this.pollTypeNgxSelect.display = 'name';
        this.pollTypeNgxSelect.required = true;
        this.pollTypeNgxSelect.items = await this._translateObjectService.getTranslatedEnumCollection<PollTypeEnum>(PollTypeEnum, 'PollTypeEnum');
        this.pollTypeNgxSelect.control.setValidators(Validators.required);
        let selectedPollType = this.pollTypeNgxSelect.items[0];
        if (data.pollTypeEnum) {
          selectedPollType = this.pollTypeNgxSelect.items.find(x => x.data === data.pollTypeEnum);
        }
        this.pollTypeNgxSelect.control.setValue(selectedPollType);

        this.nameNgxInput = this._getNgxInputInstance('name', data.name);
        this.descriptionNgxInput = this._getNgxInputInstance('description', data.description);
        this.descriptionNgxInput.type = NgxInputType.TEXTAREA;

        if (!this.isNew) {
          this.pollQuestions = await this._pollVersionApiService.getPollQuestion(this.pollPerson ? this.pollPerson.appliedPoll.pollVersion.id : this.data.pollVersionId).toPromise();
        }

        this._formGroup.setControl('pollType', this.pollTypeNgxSelect.control);
        this._formGroup.setControl('name', this.nameNgxInput.control);
        this._formGroup.setControl('description', this.descriptionNgxInput.control);

        if (this.canEdit) {
          this._formGroup.enable();
        } else {
          this._formGroup.disable();
        }
      });
    }
    return result;
  }

  public async onRemove(): Promise<boolean> {
    return await this.appHelper.tryRemove(async () => {
      this.data = await this._pollApiService.removePoll(this.data).toPromise();
    });
  }

  public async onSave(): Promise<boolean> {
    return await this.appHelper.trySave(async () => {
      this.data.pollTypeEnum = this.pollTypeNgxSelect.control.value.data;
      this.data.name = this.nameNgxInput.control.value;
      this.data.description = this.descriptionNgxInput.control.value;

      this.data = await this._pollApiService.savePoll(this.data).toPromise();
    });
  }

  private _getNgxInputInstance<T extends NgxInput | NgxSelect>(labelTranslation: string, value: string, required?: boolean): T {
    const ngxInput = new NgxInput();
    ngxInput.labelTranslation = labelTranslation;
    if (required) {
      ngxInput.required = true;
      ngxInput.control.setValidators(Validators.required);
    }
    ngxInput.control.setValue(value);
    return ngxInput as T;
  }

}
