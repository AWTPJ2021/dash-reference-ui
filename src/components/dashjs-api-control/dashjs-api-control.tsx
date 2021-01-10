import { Component, Host, h, State, Event, Element, EventEmitter } from '@stencil/core';
import { DashFunction } from '../../types/types';
import { modalController } from '@ionic/core';
import { generateFunctionsMapFromList } from '../../utils/utils';

@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  shadow: false,
})
export class DashjsApiControl {
  @Element() private element: HTMLElement;

  @State() sourceList: any[] = [];

  @State() autoPlay: boolean;

  @State() mediaUrl: string = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';

  @State() functionList: DashFunction[] = [];
  @State() selectedFunctions: Map<string, any> = new Map();
  @State() displayedFunction: string = '';

  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
        console.log('Here is the source: ' + this.sourceList.length);
      });
    fetch('/static/mediaPlayerFunctionsMetaData.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.functionList = response;
        for (var i = this.functionList.length - 1; i >= 0; i--) {
          if (this.functionList[i].parameters.length > 1) {
            this.functionList.splice(i, 1);
          }
          if (this.functionList[i].parameters.length == 1) {
            if (!this.validType(this.functionList[i].parameters[0].type)) {
              this.functionList.splice(i, 1);
            }
          }
        }
        this.selectedFunctions = generateFunctionsMapFromList(this.functionList);
        console.log(this.functionList);
        console.log(this.selectedFunctions);
      });
  }

  validType(any) {
    var types = ['boolean', 'number', 'string'];
    for (var i in types) {
      if (types[i] == any) return true;
    }
    return false;
  }

  async openFunctions() {
    const modal = await modalController.create({
      component: 'dashjs-api-control-modal',
      cssClass: 'browse-settings-modal',
      enterAnimation: undefined,
      componentProps: {
        functionList: this.functionList,
        selectedFunctions: new Map(this.selectedFunctions),
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedFunctions = data;
    }
  }

  stopMedia() {
    this.playerEventHandler({ type: 'stop' });
  }

  loadMedia() {
    this.playerEventHandler({ type: 'load', url: this.mediaUrl, autoPlay: this.element.querySelector('#autol').getAttribute('aria-checked') });
  }

  setStreamUrl(url) {
    this.mediaUrl = url;
  }

  removeFunction(id: string) {
    this.selectedFunctions.set(id, undefined);
    this.selectedFunctions = new Map(this.selectedFunctions);
  }

  updateFunction(id: string, value: any) {
    this.selectedFunctions.set(id, value);
    this.selectedFunctions = new Map(this.selectedFunctions);
    this.playerEventHandler({ type: 'function', name: id, param: value });
  }

  protected componentDidLoad(): void {
    this.playerEventHandler({ type: 'autoload', autoPlay: this.element.querySelector('#autol').getAttribute('aria-checked') });
  }

  @Event({
    composed: true,
    bubbles: true,
  })
  playerEvent: EventEmitter<String>;

  playerEventHandler(todo: any) {
    this.playerEvent.emit(todo);
  }

  render() {
    return (
      <Host>
        <ion-accordion titleText="API">
          <div slot="title" style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}>
            Auto start <ion-toggle id="autol" checked></ion-toggle>
          </div>
          <ion-grid>
            <ion-row>
              <ion-col size="2">
                <ion-item class="margin-fix">
                  <ion-label>Stream</ion-label>
                  <ion-select interface="action-sheet" selectedText=" " onIonChange={ev => this.setStreamUrl(ev.detail.value)}>
                    {this.sourceList.map(item => item.submenu.map(ev => <ion-select-option value={ev.url}>{item.name + ': ' + ev.name}</ion-select-option>))}
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-input id="stream_url" value={this.mediaUrl}></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="4">
                <ion-button shape="round" color="dark" onClick={() => this.stopMedia()}>
                  Reset
                </ion-button>
                <ion-button shape="round" id="load" onClick={() => this.loadMedia()}>
                  Load
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-row>
              {Array.from(this.selectedFunctions.keys())
                .filter(k => this.selectedFunctions.get(k) != undefined)
                .map(s => (
                  <ion-chip
                    color={s === this.displayedFunction ? 'primary' : 'secondary'}
                    onClick={() => {
                      this.displayedFunction = s;
                    }}
                  >
                    <ion-label>{s}</ion-label>
                    <ion-icon
                      name="close-circle"
                      onClick={event => {
                        event.stopPropagation();
                        this.removeFunction(s);
                      }}
                    ></ion-icon>
                  </ion-chip>
                ))}
              {/* <ion-input placeholder="Add more settings..."></ion-input> */}
            </ion-row>
            <ion-row>
              <ion-button shape="round" id="load" color="dark" onClick={() => this.openFunctions()}>
                Browse API calls <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
              </ion-button>
            </ion-row>
            <ion-row>
              <ion-list style={{ width: '100%' }}>
                {Array.from(this.selectedFunctions.keys())
                  .filter(k => this.selectedFunctions.get(k) != undefined)
                  .map(key => (
                    <dashjs-api-control-element
                      name={key}
                      param={this.functionList.filter(s => s.name === key)[0].parameters}
                      paramDesc={this.functionList.filter(s => s.name === key)[0].paramExplanation}
                      onValueChanged={change => {
                        this.updateFunction(key, change.detail);
                      }}
                    ></dashjs-api-control-element>
                  ))}
              </ion-list>
              {/* <dashjs-settings-control-element type={this.settingsList.filter(s => s.id === this.displayedSetting)[0].type}></dashjs-settings-control-element> */}
            </ion-row>
          </ion-grid>
        </ion-accordion>
      </Host>
    );
  }
}
