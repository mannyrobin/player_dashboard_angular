import { Component, ContentChild, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxVirtualScrollComponent } from '../../../../components/ngx-virtual-scroll/ngx-virtual-scroll/ngx-virtual-scroll.component';
import { IdentifiedObject } from '../../../../data/remote/base';
import { PageQuery } from '../../../../data/remote/rest-api/page-query';
import { AppHelper } from '../../../../utils/app-helper';
import { MenuItem } from '../../item-line/model/menu-item';
import { BaseItemList } from '../model/base-item-list';
import { ItemDisplay } from '../model/item-display';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent<TModel extends IdentifiedObject, Q extends PageQuery> extends BaseItemList<TModel, Q> implements OnInit {

  @ContentChild('itemTemplate', {static: false})
  public itemTemplate: TemplateRef<any>;

  @ViewChild(NgxVirtualScrollComponent, {static: false})
  public ngxVirtualScrollComponent: NgxVirtualScrollComponent;

  public readonly itemDisplayClass = ItemDisplay;
  public readonly actions: MenuItem[] = [];

  constructor(private _appHelper: AppHelper) {
    super();
  }

  public async ngOnInit(): Promise<void> {
    await this._updateItems();

    if (this.addItem) {
      this.actions.push({
        iconName: 'add',
        action: async () => {
          await this.onAddItem();
        }
      });
    }
  }

  public async onSearchTextChanged(value: string): Promise<void> {
    this.query.name = value;
    await this._updateItems();
  }

  public onItemDisplayChange(value: ItemDisplay): void {
    this.itemDisplay = value;
  }

  public async onAddItem(): Promise<void> {
    const dialogResult = await this.addItem();
    if (dialogResult.result) {
      const itemIndex = this.ngxVirtualScrollComponent.items.findIndex(value => this.compare(value, dialogResult.data));
      if (itemIndex > -1) {
        if (dialogResult.data.deleted) {
          this.ngxVirtualScrollComponent.items.splice(itemIndex, 1);
        } else {
          this.ngxVirtualScrollComponent.items[itemIndex] = dialogResult.data;
        }
      } else if (!dialogResult.data.deleted) {
        this.ngxVirtualScrollComponent.items.push(dialogResult.data);
      }
    }
  }

  private async _updateItems(): Promise<void> {
    await this._appHelper.delay();
    await this.ngxVirtualScrollComponent.reset();
  }

}
