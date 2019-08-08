import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplyingSubgroupTemplateComponent} from './applying-subgroup-template/applying-subgroup-template.component';
import {GroupTreeModule} from '../group-tree/group-tree.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [ApplyingSubgroupTemplateComponent],
  entryComponents: [ApplyingSubgroupTemplateComponent],
  exports: [ApplyingSubgroupTemplateComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    GroupTreeModule
  ]
})
export class ApplyingSubgroupTemplateModule {
}
