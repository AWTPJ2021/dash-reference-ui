import { Component, Host, h, State, Event, Element, EventEmitter} from '@stencil/core';

@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  shadow: false,
})
export class DashjsApiControl {
  @Element()
  private element: HTMLElement;

  @State() 
  sourceList: any[] = [];

  @State() 
  autoPlay : boolean;

  @State() 
  mediaUrl : string = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";
  
  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
        console.log("Here is the source: " + this.sourceList.length);
      });
  }

  stopMedia() {
    this.playerEventHandler({ "type" : "stop"});
  }

  loadMedia() {
      this.playerEventHandler({ "type" : "load" , "url" : this.mediaUrl, "autoPlay" : this.element.querySelector("#autol").getAttribute("aria-checked")});
  }

  setStreamUrl(url) {
    this.mediaUrl = url;

  }

  protected componentDidLoad(): void {
    this.playerEventHandler({ "type" : "autoload" , "autoPlay" : this.element.querySelector("#autol").getAttribute("aria-checked")});
  }

  @Event({
    composed : true,
    bubbles: true
  }) playerEvent: EventEmitter<String>;

  playerEventHandler(todo: any) {
    this.playerEvent.emit(todo);
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
                    <ion-select interface="action-sheet" selectedText=" " onIonChange={ev => this.setStreamUrl(ev.detail.value)}>
                  {this.sourceList.map(item => item.submenu.map(ev => (
                      <ion-select-option value={ev.url}>{item.name + ": " + ev.name}</ion-select-option>
                  )))}
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
                  <ion-toggle id="autol" checked></ion-toggle>
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
