declare var InstallTrigger: any;
declare var document: any;
declare var window: any;

export class CheckBrowser {
  public static isValid() : boolean {
    var isFirefox = typeof InstallTrigger !== 'undefined';
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if( !isChrome && !isFirefox && !isEdge ){
        return false;
    }
    return true;
  }
}
