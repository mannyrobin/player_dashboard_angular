import { Component, Input, ViewChild } from '@angular/core';
import { NgxGridComponent } from 'app/components/ngx-grid/ngx-grid/ngx-grid.component';
import { NgxModalService } from 'app/components/ngx-modal/service/ngx-modal.service';
import { PropertyConstant } from 'app/data/local/property-constant';
import { PageContainer } from 'app/data/remote/bean/page-container';
import { ReportExtension } from 'app/data/remote/bean/report-extension';
import { BaseGroupContract, GroupContractService, GroupContractType } from 'app/data/remote/model/group/contract';
import { GroupPerson } from 'app/data/remote/model/group/person';
import { GroupApiService } from 'app/data/remote/rest-api/api';
import { PageQuery } from 'app/data/remote/rest-api/page-query';
import { EditGroupContractComponent } from 'app/module/group/edit-group-contract/edit-group-contract/edit-group-contract.component';
import { UtilService } from 'app/services/util/util.service';
import { AppHelper } from 'app/utils/app-helper';

@Component({
  selector: 'app-group-contract-list',
  templateUrl: './group-contract-list.component.html',
  styleUrls: ['./group-contract-list.component.scss']
})
export class GroupContractListComponent {

  @ViewChild(NgxGridComponent, {static: false})
  public ngxGridComponent: NgxGridComponent;

  @Input()
  public groupPerson: GroupPerson;

  public readonly propertyConstantClass = PropertyConstant;
  public readonly groupContractTypeClass = GroupContractType;

  constructor(private _ngxModalService: NgxModalService,
              private _groupApiService: GroupApiService,
              private _appHelper: AppHelper,
              private _utilService: UtilService) {
  }

  public fetchItems = async (query: PageQuery): Promise<PageContainer<any>> => {
    return this._appHelper.arrayToPageContainer(await this._groupApiService.getGroupContracts(this.groupPerson.group, this.groupPerson.person).toPromise());
  };

  public async onAddContract(): Promise<void> {
    await this._openEditGroupContract(new GroupContractService());
  }

  public async onEditContract(groupContract: BaseGroupContract): Promise<void> {
    await this._openEditGroupContract(groupContract);
  };

  public async onRemoveContract(groupContract: BaseGroupContract): Promise<void> {
    await this._groupApiService.removeGroupContract(groupContract, this.groupPerson.group, this.groupPerson.person).toPromise();
    this.ngxGridComponent.items.splice(this.ngxGridComponent.items.indexOf(groupContract), 1);
  };

  public onGetReportContract(groupContract: BaseGroupContract): void {
    window.open(this._groupApiService.getUrlForDownloadGroupContractReport(groupContract, this.groupPerson.group, this.groupPerson.person, {extension: ReportExtension.PDF}), '_blank');
  };

  private async _openEditGroupContract(groupContract: BaseGroupContract): Promise<void> {
    const modal = this._ngxModalService.open();
    modal.componentInstance.titleKey = 'contract';

    await modal.componentInstance.initializeBody(EditGroupContractComponent, async component => {
      component.group = this.groupPerson.group;
      component.person = this.groupPerson.person;

      await component.initialize(this._utilService.clone(groupContract));

      modal.componentInstance.splitButtonItems = [
        this._ngxModalService.saveSplitItemButton(async () => {
          if (await this._ngxModalService.save(modal, component)) {
            const itemIndex = this.ngxGridComponent.items.findIndex(x => x.id == component.data.id);
            if (itemIndex > -1) {
              this.ngxGridComponent.items[itemIndex] = component.data;
            } else {
              this.ngxGridComponent.items.push(component.data);
            }
          }
        }),
        this._ngxModalService.removeSplitItemButton(async () => {
          if (await this._ngxModalService.remove(modal, component)) {
            this.ngxGridComponent.items.splice(this.ngxGridComponent.items.find(x => x.id == component.data.id), 1);
          }
        })
      ];
    });
    await this._ngxModalService.awaitModalResult(modal);
  }

}
