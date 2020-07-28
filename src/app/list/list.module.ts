import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ListPage } from './list.page';
import { TranslateModule } from '@ngx-translate/core';
import { AppPipesModule } from '../pipes/pipes.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListPage
      }
    ]),
    TranslateModule,
    AppPipesModule
  ],
  declarations: [ListPage],
  providers: [
    InAppBrowser
  ],
  exports: []
})
export class ListPageModule { }
