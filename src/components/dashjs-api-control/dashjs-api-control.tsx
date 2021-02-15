import { Component, Host, h, State, Event, Element, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { DashFunction } from '../../types/types';
import { modalController, popoverController, toastController, InputChangeEventDetail } from '@ionic/core';
import { generateFunctionsMapFromList, updateLocalKey, deleteLocalKey, saveMapToLocalKey, getLocalInformation, deleteLocalInformation, getMediaURL, setMediaURL, resetMediaURL, saveStringLocally, getStringLocally } from '../../utils/utils';

@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  shadow: false,
})
export class DashjsApiControl {
  @Prop() version: string = undefined;
  @Watch('version')
  watchHandler() {
    this.loadSettingsMetaData();
  }

  @Element() private element: HTMLElement;

  @State() sourceList: any[] = [];

  @State() autoPlay: boolean;

  @State() mediaUrl: string;

  @State() functionList: DashFunction[] = [];
  @State() selectedFunctions: Map<string, any> = new Map();
  @State() displayedFunction: string = '';
  @State() searchElement: HTMLInputElement;
  debounceTimer: NodeJS.Timeout | undefined;
  searchPopover: any;

  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
      });
    if (this.version) {
      this.loadSettingsMetaData();
    }
    this.mediaUrl = getMediaURL();
  }

  private loadSettingsMetaData() {
    fetch(`/static/gen/mediaPlayerFunctionsMetaData-${this.version}.json`)
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
        var savedSettings = getLocalInformation('api_functions');
        if(savedSettings != null) {
          for(var key in savedSettings) {
            this.selectedFunctions.set(key, savedSettings[key]);
          }
        }
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
      saveMapToLocalKey('api_functions', this.selectedFunctions);
    }
  }

  stopMedia() {
    this.playerEventHandler({ type: 'stop' });
    resetMediaURL();
    this.mediaUrl = getMediaURL();
  }

  loadMedia() {
    this.playerEventHandler({ type: 'load', url: this.mediaUrl, autoPlay: this.element.querySelector('#autol').getAttribute('aria-checked') });
  }

  @Listen('setStream', { target: 'document' })
  setStreamEventHandler(event) {
    this.mediaUrl = event.detail;
    setMediaURL(event.detail);
    popoverController.dismiss();
    this.loadMedia();
  }

  removeFunction(id: string) {
    this.selectedFunctions.set(id, undefined);
    this.selectedFunctions = new Map(this.selectedFunctions);
    deleteLocalKey('api_functions', id);
  }

  updateFunction(id: string, value: any) {
    this.selectedFunctions.set(id, value);
    this.selectedFunctions = new Map(this.selectedFunctions);
    this.playerEventHandler({ type: 'function', name: id, param: value });
    updateLocalKey('api_functions', id, value);
  }

  async resetFunctions() {
    this.selectedFunctions = generateFunctionsMapFromList(this.functionList);
    deleteLocalInformation('api_functions');
  }

  protected componentDidLoad(): void {
    this.searchElement = this.element.querySelector('#searchApiInput');
  }

  @Event({
    composed: true,
    bubbles: true,
  })
  playerEvent: EventEmitter<String>;

  playerEventHandler(todo: any) {
    this.playerEvent.emit(todo);
  }

  async presentPopover(ev: any) {
    const popover = await popoverController.create({
      component: 'dashjs-api-link-selector',
      event: ev,
      translucent: true,
      componentProps: { sourceList: this.sourceList },
    });
    return await popover.present();
  }

  @Listen('playerResponse', { target: 'document' })
  async playerResponseHandler(event) {
    const toast = await toastController.create({
      message: 'API function "' + event.detail.event + '" was called.\nReturn value: ' + JSON.stringify(event.detail.return),
      duration: 2000,
    });
    toast.present();
  }

  updateInformation(action : number, event : any) {
    if(action === 0) {
      console.log("saving: " + event.detail.checked);
      saveStringLocally('api_autostart', event.detail.checked);
    } else if(action === 1) {
      if (event.detail.value == '') resetMediaURL();
      else  setMediaURL(event.detail.value);
      this.mediaUrl = event.detail.value;
    }
  }

  async updateSearch(event: CustomEvent<InputChangeEventDetail>) {
    if (event.detail.value == '') {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      if (this.searchPopover) {
        await this.searchPopover.dismiss();
      }
      return;
    }
    const next = async () => {
      let regex = new RegExp(event.detail.value, 'i');
      let matchingSettings = Array.from(this.selectedFunctions.keys())
        // Filter only matching keys
        .filter(e => e.match(regex))
        // Filter Settings which are already shown
        .filter(e => this.selectedFunctions.get(e) == undefined);
      if (this.searchPopover) {
        await this.searchPopover.dismiss();
      }
      this.searchPopover = await popoverController.create({
        component: 'dashjs-popover-select',
        cssClass: 'settings-search-popover',
        showBackdrop: false,
        event: event,
        keyboardClose: false,
        leaveAnimation: undefined,
        enterAnimation: undefined,
        componentProps: {
          options: matchingSettings,
          isAPI: true
        },
      });
      await this.searchPopover.present();
      this.searchElement.focus(); //.select();
      const { data } = await this.searchPopover.onWillDismiss();
      if (data) {
        this.tryAddSetting(data);
      }
    };

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(next, 500);
  }

  tryAddSetting(key: string) {
    let matchingSettings = Array.from(this.selectedFunctions.keys()).filter(e => e === key);
    if (matchingSettings.length === 1) {
      key = matchingSettings[0];
    } else {
      return;
    }
    if (this.selectedFunctions.has(key)) {
      this.selectedFunctions.set(key, this.functionList.filter(s => s.name === key)[0].parameters);
      this.selectedFunctions = new Map(this.selectedFunctions);
      updateLocalKey('api_functions', key, this.functionList.filter(s => s.name === key)[0].parameters);
    }
  }

  async showMPDInfo() {
    fetch(this.mediaUrl).then(async response => {
      const modal = await modalController.create({
        component: 'dashjs-generic-modal',
        componentProps: {
          content: (
            <div>
              <code>{await response.text()}</code>
            </div>
          ),
          textTitle: [
            <ion-title>Settings JSON</ion-title>,
            <ion-buttons slot="secondary">
              <ion-button shape="round" fill="outline" color="dark" href={this.mediaUrl} target="_blank" rel="noopener noreferrer">
                Download
              </ion-button>
            </ion-buttons>,
          ],
        },
      });
      await modal.present();
    });

  }

  render() {
    return (
      <Host>
        <ion-accordion titleText="API">
          <div slot="title" style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}>
            Auto start <ion-toggle id="autol" onIonChange={event => this.updateInformation(0, event)} checked={getStringLocally('api_autostart') === null ? false : getStringLocally('api_autostart') === 'true'}></ion-toggle>
          </div>
          <ion-grid>
            <ion-row>
              <ion-col size="2">
                <ion-button shape="round" onClick={ev => this.presentPopover(ev)} class="fill_width">
                  Select Stream<ion-icon name="arrow-dropdown"></ion-icon>
                </ion-button>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-input id="stream_url" value={this.mediaUrl} onIonChange={event => this.updateInformation(1 ,event)}></ion-input>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-button shape="round" fill="outline" color="dark" onClick={() => this.showMPDInfo()} class="ion-float-right">
                  Info
                </ion-button>
                <ion-button shape="round" color="dark" onClick={() => this.stopMedia()} class="ion-float-right">
                  Reset
                </ion-button>
                <ion-button shape="round" id="load" onClick={() => this.loadMedia()} class="ion-float-right">
                  (Re)Load
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-row > 
              <ion-list style={{ width: '100%' }} lines="full">
                {Array.from(this.selectedFunctions.keys())
                  .filter(k => this.selectedFunctions.get(k) != undefined)
                  .map(key => {
                    let ioncolcss = {
                      display: 'flex',
                      alignItems: 'center',
                    };
                    let currFunction = this.functionList.filter(s => s.name === key)[0];
                    return (
                      <ion-row>
                        <ion-col size="auto" style={ioncolcss}>
                          <ion-button
                            size="small"
                            fill="clear"
                            onClick={event => {
                              event.stopPropagation();
                              this.removeFunction(key);
                            }}
                          >
                            <ion-icon slot="icon-only" color="dark" name="close-circle-outline"></ion-icon>
                          </ion-button>
                        </ion-col>
                        <ion-col>
                        <dashjs-api-control-element
                          name={key}
                          type={currFunction.type}
                          defaultValue={this.selectedFunctions.get(key)}  
                          param={currFunction.parameters}
                          paramDesc={currFunction.paramExplanation}
                          onValueChanged={change => {
                            this.updateFunction(key, change.detail);
                          }}
                        ></dashjs-api-control-element>
                        </ion-col>
                        <ion-col size="auto" style={ioncolcss}>
                        <dashjs-help-button helperText={currFunction.description} titleText={'Help - ' + currFunction.name}></dashjs-help-button>
                        </ion-col>
                      </ion-row>
                    )
                  })}
                  
              </ion-list>
            </ion-row>
            <ion-row>
                  <ion-input
                    id="searchApiInput"
                    placeholder="Add more settings..."
                    onIonChange={event => this.updateSearch(event)}
                    onKeyPress={event => (event.code === 'Enter' ? this.tryAddSetting((event.target as any).value) : null)}
                  ></ion-input>
                  <ion-button shape="round" color="dark" onClick={() => this.openFunctions()}>
                    Browse API Calls
                    <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
                  </ion-button>
                  <ion-button shape="round" fill="outline" color="dark" onClick={() => this.resetFunctions()}>
                    Reset
                  </ion-button>
              </ion-row>
          </ion-grid>
        </ion-accordion>
      </Host>
    );
  }
}
