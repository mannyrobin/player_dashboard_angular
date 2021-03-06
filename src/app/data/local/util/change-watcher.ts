import {AppHelper} from '../../../utils/app-helper';

export class ChangeWatcher {

  private readonly _items: ChangeWatcherItem[];

  constructor(private _appHelper: AppHelper) {
    this._items = [];
  }

  public addOrUpdate(key: string, item: any) {
    const foundItem = this._items.find(x => x.key === key);
    const lastData = JSON.stringify(item);
    if (foundItem) {
      foundItem.lastData = lastData;
      foundItem.data = item;
    } else {
      this._items.push({key: key, lastData: lastData, data: item});
    }
  }

  public hasChangesObject(key: string): boolean {
    const item = this._items.find(x => x.key === key);
    if (!item) {
      return false;
    }
    return item.lastData !== JSON.stringify(item.data);
  }

  public hasChanges(): boolean {
    for (const item of this._items) {
      if (item.lastData !== JSON.stringify(item.data)) {
        return true;
      }
    }
    return false;
  }

  public refresh() {
    for (const item of this._items) {
      item.lastData = JSON.stringify(item.data);
    }
  }

  public reset(): void {
    for (const item of this._items) {
      this._appHelper.updateObject(item.data, JSON.parse(item.lastData));
    }
  }

}

class ChangeWatcherItem {
  public key: any;
  public lastData: string;
  public data: any;
}
