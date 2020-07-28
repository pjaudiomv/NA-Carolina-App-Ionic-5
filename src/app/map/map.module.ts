import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Base64 } from '@ionic-native/base64/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { MapmodalPage } from '../mapmodal/mapmodal.page';
import { MapPage } from './map.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [
    MapPage,
    MapmodalPage
  ],
  entryComponents: [
    MapmodalPage
  ],
  providers: [
    Base64,
    InAppBrowser
  ]
})
export class MapPageModule { }
