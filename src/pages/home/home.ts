import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CheckBrowser } from "../../helpers/check-browser.helper";
import { WebrtcProvider } from '../../providers';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  public quote_id: number = 6;
  constructor(
    public navCtrl: NavController,
    public webrtcProvider: WebrtcProvider
  ) {

    }

  conference() {
    alert('conference');
    this.goVideoCall( this.quote_id );
  }

  goVideoCall( quote_id: number ){
    debugger;
    this.webrtcProvider.init();

    this.webrtcProvider.onReadyToCall().subscribe(() => {
      if ( quote_id ) {
        this.webrtcProvider.webrtc.joinRoom( quote_id.toString() );
      }
      alert('ready');
      console.log('ready');
    });
    this.webrtcProvider.onLocalMediaError().subscribe((error) => {
      alert(error);
      console.log('error');
    });
    this.webrtcProvider.onError().subscribe((error) => {
      alert(error);
      console.log('error');
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
