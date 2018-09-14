import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ExerciseType} from '../../../../data/remote/model/exercise/base/exercise-type';
import {ParticipantRestApiService} from '../../../../data/remote/rest-api/participant-rest-api.service';
import {Direction} from '../../../../components/ngx-virtual-scroll/model/direction';
import {ActivityQuery} from '../../../../data/remote/rest-api/query/activity-query';
import {NgxVirtualScrollComponent} from '../../../../components/ngx-virtual-scroll/ngx-virtual-scroll/ngx-virtual-scroll.component';
import {AppHelper} from '../../../../utils/app-helper';
import {PropertyConstant} from '../../../../data/local/property-constant';
import {NgxModalService} from '../../../../components/ngx-modal/service/ngx-modal.service';
import {EditActivityComponent} from '../edit-activity/edit-activity.component';
import {BaseExercise} from '../../../../data/remote/model/exercise/base/base-exercise';
import {ActivatedRoute, Router} from '@angular/router';
import {SplitButtonItem} from '../../../../components/ngx-split-button/bean/split-button-item';
import {NgxSelectionComponent} from '../../../../components/ngx-selection/ngx-selection/ngx-selection.component';
import {PageQuery} from '../../../../data/remote/rest-api/page-query';
import {PageContainer} from '../../../../data/remote/bean/page-container';
import {Tag} from '../../../../data/remote/model/tag';
import {PreviewNamedObjectComponent} from '../../../../components/named-object/preview-named-object/preview-named-object.component';
import {NgxEditableItemComponent} from '../../../../components/ngx-editable-item/ngx-editable-item/ngx-editable-item.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  public readonly propertyConstant = PropertyConstant;

  @ViewChild(NgxVirtualScrollComponent)
  public ngxVirtualScrollComponent: NgxVirtualScrollComponent;

  @Input()
  public type: ExerciseType;

  public readonly splitButtonItems: SplitButtonItem[];
  public query: ActivityQuery;
  public tags: Tag[];

  constructor(private _participantRestApiService: ParticipantRestApiService,
              private _appHelper: AppHelper,
              private _ngxModalService: NgxModalService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    this.query = new ActivityQuery();
    this.splitButtonItems = [
      {
        default: true,
        nameKey: 'add',
        callback: async () => {
          const activity = new BaseExercise();
          activity.discriminator = this.type;
          const modal = this._ngxModalService.open();
          modal.componentInstance.titleKey = 'edit';
          await modal.componentInstance.initializeBody(EditActivityComponent, async component => {
            component.manualInitialization = true;
            await component.initialize(activity);

            modal.componentInstance.splitButtonItems = [
              this._ngxModalService.saveSplitItemButton(async () => {
                if (await this._ngxModalService.save(modal, component)) {
                  await this._router.navigate([component.data.id], {relativeTo: this._activatedRoute});
                }
              })];
          });
        }
      },
      {
        nameKey: 'tags',
        callback: async () => {
          const modal = this._ngxModalService.open();
          modal.componentInstance.titleKey = 'selection';
          await modal.componentInstance.initializeBody(NgxSelectionComponent, async component => {
            const fetchItems = async (query: PageQuery): Promise<PageContainer<Tag>> => {
              return await this._participantRestApiService.getTags(query);
            };

            const initializeComponent = async (componentItem: PreviewNamedObjectComponent<Tag>, data: any) => {
              componentItem.data = data;
            };

            const initializeEditComponent = async (componentItem: NgxEditableItemComponent<PreviewNamedObjectComponent<Tag>, Tag>, data: any) => {
              componentItem.edit = async (editComponent: PreviewNamedObjectComponent<Tag>): Promise<boolean> => {
                // TODO: Add edit tag
                return true;
              };
              await componentItem.initialize(PreviewNamedObjectComponent, data, initializeComponent);
            };

            await component.initialize(NgxEditableItemComponent, initializeEditComponent, fetchItems, this._appHelper.cloneObject(this.tags));

            modal.componentInstance.splitButtonItems = [
              {
                nameKey: 'apply',
                callback: async () => {
                  this.query.tags = '';
                  this.tags = component.selectedItems;
                  for (const item of this.tags) {
                    this.query.tags += `${item.id}_`;
                  }
                  modal.dismiss();
                  await this.resetItems();
                }
              }
            ];
          });
        }
      }
    ];
  }

  async ngOnInit() {
    await this.resetItems();
  }

  public fetchItems = async (direction: Direction, query: ActivityQuery) => {
    query.exerciseType = this.type;
    return await this._participantRestApiService.getActivities(query);
  };

  public async resetItems() {
    await this._appHelper.delay();
    await this.ngxVirtualScrollComponent.reset();
  }

  public async onSearchTextChanged(val: string): Promise<void> {
    this.query.name = val;
    await this.resetItems();
  }

}
