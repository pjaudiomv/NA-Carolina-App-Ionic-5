import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SpeakersPage } from './speakers.page';
import { AudioService } from 'src/app/service/audio.service';
import { HTTP } from '@ionic-native/http/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: SpeakersPage
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
    SpeakersPage
  ],
  providers: [
    AudioService,
    HTTP,
    Insomnia,
    InAppBrowser
  ]
})
export class SpeakersPageModule { }
