import { Component, OnInit } from '@angular/core';
import { MeetingListProviderService } from '../service/meeting-list-provider.service';
import { ServiceGroupsProviderService } from '../service/service-groups-provider.service';
import { LoadingService } from '../service/loading.service';
import { firstBy } from 'thenby';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  meetingList: any;
  meetingListArea: any;
  meetingListCity: any;
  meetingListCounty: any;
  meetingsListAreaGrouping: string;
  meetingsListCityGrouping: string;
  meetingsListCountyGrouping: string;
  shownGroup = null;
  loader = null;
  serviceGroupNames: any;
  HTMLGrouping: any;
  timeDisplay;

  constructor(
    private MeetingListProvider: MeetingListProviderService,
    private ServiceGroupsProvider: ServiceGroupsProviderService,
    private storage: Storage,
    public loadingCtrl: LoadingService,
    private iab: InAppBrowser) {
  }

  ngOnInit() {
    this.storage.get('timeDisplay')
      .then(timeDisplay => {
        if (timeDisplay) {
          this.timeDisplay = timeDisplay;
        } else {
          this.timeDisplay = '12hr';
        }
      });

    this.HTMLGrouping = 'area';
    this.loadingCtrl.present('Loading meetings...');
    this.meetingsListAreaGrouping = 'service_body_bigint';
    this.meetingsListCountyGrouping = 'location_sub_province';
    this.meetingsListCityGrouping = 'location_municipality';
    this.getServiceGroupNames();
  }

  public openTelLink(url: string) {
    const telUrl = 'tel:' + url;
    const browser = this.iab.create(telUrl);
  }

  public openMapsLink(destLatitude, destLongitude) {
    const browser = this.iab.create('https://www.google.com/maps/search/?api=1&query=' + destLatitude + ',' + destLongitude);
  }

  public openLink(url) {
    const browser = this.iab.create(url);
  }

  transformField(value: string) {
    const valueSplit = value.split('#@-@#');
    return valueSplit[1];
  }

  getServiceGroupNames() {
    this.ServiceGroupsProvider.getAllServiceGroups().subscribe((serviceGroupData) => {
      this.serviceGroupNames = serviceGroupData;
      this.getAllMeetings();
    });
  }

  getServiceNameFromID(id) {
    const obj = this.serviceGroupNames.find(function(obj) { return obj.id === id; });
    return obj.name;
  }

  getAllMeetings() {
    this.MeetingListProvider.getMeetingsSortedByDay().subscribe((data) => {
      this.meetingList = data;
      this.meetingList = this.meetingList.filter(meeting => meeting.service_body_bigint = this.getServiceNameFromID(meeting.service_body_bigint));
      this.meetingList = this.meetingList.filter(meeting => meeting.start_time = this.convertTo12Hr(meeting.start_time));

      this.meetingListArea = this.meetingList.concat();
      this.meetingListArea.sort((a, b) => a.service_body_bigint.localeCompare(b.service_body_bigint));
      this.meetingListArea = this.groupMeetingList(this.meetingListArea, this.meetingsListAreaGrouping);
      for (let i = 0; i < this.meetingListArea.length; i++) {
        this.meetingListArea[i].sort(
          firstBy('weekday_tinyint')
          //  .thenBy('start_time')
        );
      }

      this.meetingListCity = this.meetingList.concat();
      this.meetingListCity.sort((a, b) => a.location_municipality.localeCompare(b.location_municipality));
      this.meetingListCity = this.groupMeetingList(this.meetingListCity, this.meetingsListCityGrouping);
      for (let i = 0; i < this.meetingListCity.length; i++) {
        this.meetingListCity[i].sort(
          firstBy('weekday_tinyint')
          //    .thenBy('start_time')
        );
      }

      this.meetingListCounty = this.meetingList.concat();
      this.meetingListCounty.sort((a, b) => a.location_sub_province.localeCompare(b.location_sub_province));
      this.meetingListCounty = this.groupMeetingList(this.meetingListCounty, this.meetingsListCountyGrouping);
      for (let i = 0; i < this.meetingListCounty.length; i++) {
        this.meetingListCounty[i].sort(
            firstBy('weekday_tinyint')
            //    .thenBy('start_time')
        );
      }

      this.loadingCtrl.dismiss();
    });
  }

  groupMeetingList(meetingList, groupingOption) {
    // A function to convert a flat json list to an javascript array
    const groupJSONList = function(inputArray, key) {
      return inputArray.reduce(function(ouputArray, currentValue) {
        (ouputArray[currentValue[key]] = ouputArray[currentValue[key]] || []).push(currentValue);
        return ouputArray;
      }, {});
    };
    // Convert the flat json to an array grouped by and indexed by the meetingsListGroupingOne field,
    const groupedByGroupingOne = groupJSONList(meetingList, groupingOption);

    // Make the array a proper javascript array, index by number
    const groupedByGroupingOneAsArray = Object.keys(groupedByGroupingOne).map(function(key) {
      return groupedByGroupingOne[key];
    });

    meetingList = groupedByGroupingOneAsArray;
    return meetingList;
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  public convertTo12Hr(timeString) {
    if (this.timeDisplay === '12hr') {
      const H = +timeString.substr(0, 2);
      const h = H % 12 || 12;
      const ampm = (H < 12 || H === 24) ? ' AM' : ' PM';
      timeString = h + timeString.substr(2, 3) + ampm;
      return timeString;
    } else {
      return timeString.slice(0, -3);
    }
  }

}
