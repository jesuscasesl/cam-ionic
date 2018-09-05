import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CheckBrowser } from "../../helpers/check-browser.helper";
import { WebrtcProvider } from '../../providers';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public quote_id: number = 6;
  constructor(
    public navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    public webrtcProvider: WebrtcProvider 
  ) {
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
    }

  conference() {
    if( CheckBrowser.isValid() ) {
      this.goVideoCall( this.quote_id );
    } else {
      // this.translateService.get('Su navegador no es compatible con la videoconferencia. Por favor, use Google Chrome, Mozilla Firefox o Microsoft Edge').subscribe((res: string) => {
          // this.messageService.showErrorMessage(res);
      // });
    }
  }

  goVideoCall( quote_id: number ){
    debugger;
    this.webrtcProvider.init();
    
    this.webrtcProvider.onReadyToCall().subscribe(() => {
      if ( quote_id ) {
        this.webrtcProvider.webrtc.joinRoom( quote_id.toString() );
      }
      console.log('ready');
    });

    this.webrtcProvider.onVideoAdded().subscribe(data => {
      let remotes = document.getElementById('remotes');
      if (remotes && remotes.childNodes.length == 0) {
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'container_' + this.webrtcProvider.webrtc.getDomId(data.peer);
        d.appendChild(data.video);
        var vol = document.createElement('div');
        vol.id = 'volume_' + data.peer.id;
        vol.className = 'volume_bar';
        data.video.onclick = function () {
          data.video.style.width = data.video.videoWidth + 'px';
          data.video.style.height = data.video.videoHeight + 'px';
        };
        d.appendChild(vol);
        remotes.appendChild(d);
      }
      console.log('added');
      console.log(data);
    });

    this.webrtcProvider.onVideoRemoved().subscribe(data => {
      //this.messageService.showErrorMessage('Un participante de la videoconferencia se ha desconectado');
      var remotes = document.getElementById('remotes');
      var el = document.getElementById('container_' + this.webrtcProvider.webrtc.getDomId(data.peer));
      if (remotes && el) {
          remotes.removeChild(el);
      }
    });

    this.webrtcProvider.onLeftRoom().subscribe(data => {
      this.webrtcProvider.webrtc.joinRoom(data);
    });

    this.webrtcProvider.onStunServers().subscribe(data => {
      console.log('onStunServers');
      console.log(data);
    });

    this.webrtcProvider.onTurnServers().subscribe(data => {
      console.log('onTurnServers');
      console.log(data);
    });
  }
}
