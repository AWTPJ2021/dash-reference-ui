import { Component, Host, h, State, Element} from '@stencil/core';

@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  assetsDirs: ["sources"],
  shadow: false,
})
export class DashjsApiControl {

  @State() 
  sourceList: any[] = [];

  @State() 
  mediaUrl : string = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";

  @Element()
  private el: HTMLElement;
  
  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
        console.log("Here is the source: " + this.sourceList.length);
      });
  }

  stopMedia() {
    console.log("TODO: Stop media");
  }

  loadMedia() {
      console.log("TODO: load " + this.el.querySelector("#stream_url").textContent);
  }

  setAutoLoad(event) {
    console.log("TODO: Set auto load " + event );
  }

  setStreamUrl(url) {
    this.mediaUrl = url;
  }

  protected componentDidLoad(): void {
    /*this.sourceList.forEach(element => {
      console.log(element.name);
   });*/
  }

  render() {
    return (
      <Host>
        <ion-card>
        <ion-card-content>
        <ion-grid>
					<ion-row>
            <ion-col size="2">
              <ion-item class="margin-fix">
                <ion-label>Stream</ion-label>
                <ion-select interface="popover" onIonChange={ev => this.setStreamUrl(ev.detail.value)}>
                  {this.sourceList.map((item: any) => (
                    <ion-select-option value={item.submenu[0].url} >{item.name}</ion-select-option>
                  ))}
                </ion-select>
              </ion-item>
            </ion-col>
            <ion-col size="6">
              <ion-item>
                <ion-input id="stream_url" value={this.mediaUrl}></ion-input>
              </ion-item>
            </ion-col>
            <ion-col size="4">
                <ion-button shape="round" color="dark" onClick={() => this.stopMedia()}>Stop</ion-button>
                <ion-button shape="round" id="load" onClick={() => this.loadMedia()}>Load</ion-button>
                <ion-item class="inline-toggle">
                  <ion-label>Auto load</ion-label>
                  <ion-toggle onIonChange={ev => this.setAutoLoad(ev.detail.checked)} checked></ion-toggle>
                </ion-item>
            </ion-col>
          </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
      </Host>
    );
  }

}
