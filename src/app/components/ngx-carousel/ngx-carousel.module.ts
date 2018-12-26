import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxCarouselComponent} from './ngx-carousel/ngx-carousel.component';
import {NgxImageModule} from '../ngx-image/ngx-image.module';
import {NgxModalModule} from '../ngx-modal/ngx-modal.module';
import {NgxButtonModule} from '../ngx-button/ngx-button.module';

@NgModule({
  imports: [
    CommonModule,
    NgxImageModule,
    NgxButtonModule,
    NgxModalModule
  ],
  declarations: [NgxCarouselComponent],
  exports: [NgxCarouselComponent]
})
export class NgxCarouselModule {
}
