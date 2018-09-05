import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let permissions_array = [
        'CAMERA',
        'CAPTURE_AUDIO_OUTPUT',
        'CAPTURE_SECURE_VIDEO_OUTPUT',
        'CAPTURE_VIDEO_OUTPUT',
        'RECORD_AUDIO',
      ]
      for(let i = 0; i < permissions_array.length; i++) {
        let permission = permissions_array[i];
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION[permission])
          .then(
            result => console.log('Has permission?',result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION[permission])
          );
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION[permission], this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      }
    });
  }
}

