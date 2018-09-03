import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var SimpleWebRTC: any;

@Injectable()
export class WebrtcProvider {
  webrtc: any;

  constructor( ) {
    console.log('Hello WebrtcProvider Provider');
  }
  init() {
    this.webrtc = new SimpleWebRTC({
      url: 'https://app.quiraxis.com:8888',
      socketio: {},
      connection: null,
      debug: false,
      localVideoEl: 'localVideo',
      remoteVideosEl: '',
      autoRequestMedia: true,
      adjustPeerVolume: true,
      media: {
          video: true, audio: true
      }
    });
  }

  onRoomReady() {
    return new Observable<any>(observer => {
        this.webrtc.connection.on('message', data => {
            if(data.type == 'roomReady') {
                observer.next(data.payload);
            }
        });
    });
  }

  onConnectionReady() {
    return new Observable<any>(observer => {
      this.webrtc.on('connectionReady', sessionId => {
        observer.next(sessionId);
      });
    });
  }

  onReadyToCall() {
  return new Observable<any>(observer => {
    this.webrtc.on('readyToCall', () => {
      observer.next();
    });
  });
  }

  onVideoAdded() {
    return new Observable<any>(observer => {
      this.webrtc.on('videoAdded', (video, peer) => {
        observer.next({ video: video, peer: peer});
      });
    });
  }

  onVideoRemoved() {
    return new Observable<any>(observer => {
      this.webrtc.on('videoRemoved', (video, peer) => {
        observer.next({ video: video, peer: peer});
      });
    });
  }

  onError() {
    return new Observable<any>(observer => {
      this.webrtc.on('error', error => {
        observer.next(error);
      });
    });
  }

  onStunServers() {
    return new Observable<any>(observer => {
      this.webrtc.on('stunservers', data => {
        observer.next(data);
      });
    });
  }
  onTurnServers() {
    return new Observable<any>(observer => {
      this.webrtc.on('turnservers', data => {
        observer.next(data);
      });
    });
  }

  leaveRoom(roomName) {
      this.webrtc.leaveRoom(roomName);
  }

  onLeftRoom() {
    return new Observable<any>(observer => {
      this.webrtc.on('leftRoom', (roomName) => {
        observer.next(roomName);
      });
    });
  }
  
}
