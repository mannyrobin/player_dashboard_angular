import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Direction } from '../../../../components/ngx-virtual-scroll/model/direction';
import { DialogResult } from '../../../../data/local/dialog-result';
import { PageContainer } from '../../../../data/remote/bean/page-container';
import { BaseParameter } from '../../../../data/remote/model/parameter/base-parameter';
import { ParameterApiService } from '../../../../data/remote/rest-api/api/parameter/parameter-api.service';
import { PageQuery } from '../../../../data/remote/rest-api/page-query';
import { ParameterQuery } from '../../../../data/remote/rest-api/query/parameter/parameter-query';
import { LibraryPermissionService } from '../../../../services/permissions/library/library-permission.service';
import { ParameterWindowService } from '../../../../services/windows/parameter-window/parameter-window.service';
import { ItemListComponent } from '../../../common/item-list/item-list/item-list.component';
import { BaseItemList } from '../../../common/item-list/model/base-item-list';
import { ItemDisplay } from '../../../common/item-list/model/item-display';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss'],
  providers: [ParameterApiService]
})
export class ParameterListComponent extends BaseItemList<BaseParameter, PageQuery> implements OnInit, OnDestroy {

  @ViewChild(ItemListComponent, {static: false})
  public itemListComponent: ItemListComponent<BaseParameter, ParameterQuery>;

  @Input()
  public filter: (values: BaseParameter[]) => BaseParameter[];

  @Output()
  public readonly clickItem = new EventEmitter<BaseParameter>();

  private _notDestroyed = true;

  constructor(private _libraryPermissionService: LibraryPermissionService,
              private _parameterApiService: ParameterApiService,
              private _parameterWindowService: ParameterWindowService) {
    super();
    this.translationTitle = 'parameters';
    this.query = new PageQuery();
    this.itemDisplay = ItemDisplay.LIST;
    this.fetchItems = async (direction: Direction, query: ParameterQuery): Promise<PageContainer<BaseParameter>> => {
      const pageContainer = await this._parameterApiService.getParameters(query).toPromise();
      if (this.filter) {
        pageContainer.list = this.filter(pageContainer.list);
      }
      return pageContainer;
    };
  }

  public ngOnInit(): void {
    this._libraryPermissionService.canAddLibraryItem().subscribe(value => {
      if (value) {
        this.addItem = async (): Promise<DialogResult<BaseParameter>> => this._parameterWindowService.openEditParameter(new BaseParameter());
      }
    });
  }

  public ngOnDestroy(): void {
    delete this._notDestroyed;
  }

}
