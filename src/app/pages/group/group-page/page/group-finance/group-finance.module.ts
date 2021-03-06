import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyingSubgroupTemplateModule } from 'app/module/group/applying-subgroup-template/applying-subgroup-template.module';
import { EditSubgroupTemplateModule } from 'app/module/group/edit-subgroup-template/edit-subgroup-template.module';
import { EditSubgroupModule } from 'app/module/group/edit-subgroup/edit-subgroup.module';
import { SubgroupGroupReceiptModule } from 'app/module/group/subgroup-group-receipt/subgroup-group-receipt.module';
import { SubgroupReportModule } from 'app/module/group/subgroup-report/subgroup-report.module';
import { SubgroupsTreesModule } from 'app/module/group/subgroups-trees/subgroups-trees.module';
import { GroupFinanceRoutingModule } from 'app/pages/group/group-page/page/group-finance/group-finance-routing.module';
import { SubgroupModalService } from 'app/pages/group/group-page/page/subgroups-page/service/subgroup-modal.service';
import { SubgroupService } from 'app/pages/group/group-page/page/subgroups-page/service/subgroup.service';
import { GroupFinanceComponent } from './group-finance/group-finance.component';

@NgModule({
  declarations: [GroupFinanceComponent],
  providers: [
    SubgroupService,
    SubgroupModalService
  ],
  imports: [
    CommonModule,
    GroupFinanceRoutingModule,
    SubgroupsTreesModule,
    EditSubgroupTemplateModule,
    EditSubgroupModule,
    ApplyingSubgroupTemplateModule,
    SubgroupReportModule,
    MatExpansionModule,
    TranslateModule,
    SubgroupGroupReceiptModule
  ]
})
export class GroupFinanceModule {
}
