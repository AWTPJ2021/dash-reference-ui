import { Component, Host, h, State, Event, EventEmitter, Listen, Prop, Watch } from '@stencil/core';
import { DashFunction } from '../../types/types';
import { modalController, popoverController, toastController } from '@ionic/core';
import { LocalStorage, LocalVariableStore } from '../../utils/localStorage';
import { generateFunctionsMapFromList, initializeParam } from '../../utils/utils';
import { DASHJS_PLAYER_VERSION } from '../../defaults';

const STRING_API_ELEM = 'api_element';
const STRING_API_FUNCTIONS = 'api_functions';
@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  shadow: false,
})
export class DashjsApiControl {
   /**
   * The version of which the dashjs should be loaded.
   */
  @Prop() version: string = DASHJS_PLAYER_VERSION;
  @Watch('version')
  protected watchHandlerVersion(): void {
    this.loadSettingsMetaData();
  }

  @State() sourceList: any[] = [];

  /**
   * Indicates if the player needs to auto start after loading
   */
  @State() autostart: boolean;
  @Watch('autostart')
  protected watchHandlerAutostart(value : boolean): void {
    LocalVariableStore.api_autostart = value;
  }

  /**
   * Contains the media URL
   */
  @State() mediaUrl: string;

  /**
   * List of all dash api calls
   */
  @State() functionList: DashFunction[] = [];

  /**
   * List of selected api calls
   */
  @State() selectedFunctions: Map<string, any> = new Map();

  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
      });
    if (this.version) {
      this.loadSettingsMetaData();
    }
    this.mediaUrl = LocalVariableStore.mediaUrl;
    this.autostart = LocalVariableStore.api_autostart;
    
  }
  
  /**
   * Loads all supported api calls
   */
  private loadSettingsMetaData(): void {
    fetch(`/static/gen/mediaPlayerFunctionsMetaData-${this.version}.json`)
      .then((response: Response) => response.json())
      .then(response => {
        this.functionList = response;
        for (let i = this.functionList.length - 1; i >= 0; i--) {
          for (let j = 0; j < this.functionList[i].parameters.length; j++) {
            if (!this.validType(this.functionList[i].parameters[j].type)) {
              this.functionList.splice(i, 1);
            }
          }
        }
        this.selectedFunctions = generateFunctionsMapFromList(this.functionList);
        const savedSettings = LocalStorage.getKeyValueObject(STRING_API_FUNCTIONS);
        if (savedSettings != null) {
          for (const key in savedSettings) {
            this.selectedFunctions.set(key, savedSettings[key]);
          }
        }
      });
  }

  /**
   * Checks for valid types
   * @param any 
   */
  private validType(check : string): boolean {
    const types = ['boolean', 'number', 'string', 'MediaType'];
    for (const i in types) {
      if (types[i] == check) return true;
    }
    return false;
  }

  private async openFunctions() {
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
      LocalStorage.saveMapToLocalKey(STRING_API_FUNCTIONS, this.selectedFunctions);
    }
  }

  /**
   * Sends a stop signal to the dashjs player
   */
  private stopMedia(): void {
    this.playerEventHandler({ type: 'stop'});
    LocalVariableStore.resetMediaUrl();
    this.mediaUrl = LocalVariableStore.mediaUrl;
  }

  /**
   * Thends a load signal to the dashjs player
   */
  private loadMedia(): void {
    this.playerEventHandler({ type: 'load', url: this.mediaUrl, autoPlay: this.autostart });
  }

  /**
   * Sets and loads the media URL of the dashjs player
   * @param event 
   */
  @Listen('setStream', { target: 'document' })
  setStreamEventHandler(event : CustomEvent): void {
    this.mediaUrl = event.detail;
    LocalVariableStore.mediaUrl = event.detail;
    popoverController.dismiss();
    this.loadMedia();
  }

  /**
   * Removes the api call from the selectedFunctions list and from the local storage
   * @param id 
   */
  private removeFunction(id: string): void {
    this.selectedFunctions.set(id, undefined);
    this.selectedFunctions = new Map(this.selectedFunctions);
    LocalStorage.deleteKeyInKeyValueObject(STRING_API_FUNCTIONS, id);
    LocalStorage.deleteKeyInKeyValueObject(STRING_API_ELEM, id);
  }
  
  /**
   * Calls the api function
   * @param id 
   * @param value 
   */
  private callFunction(id: string, value: any): void {
    this.selectedFunctions.set(id, value);
    this.selectedFunctions = new Map(this.selectedFunctions);
    this.playerEventHandler({ type: 'function', name: id, param: value });
    LocalStorage.updateKeyInKeyValueObject(STRING_API_FUNCTIONS, id, value);
  }

  /**
   * Updates the parameters of a selected function and updates it in the local storage
   * @param id 
   * @param value 
   */
   private updateFunction(id: string, value: any): void {
    this.selectedFunctions.set(id, value);
    this.selectedFunctions = new Map(this.selectedFunctions);
    LocalStorage.updateKeyInKeyValueObject(STRING_API_FUNCTIONS, id, value);
  }

  /**
   * Removes all selected functions and the entries in the local storage
   */
  private async resetFunctions() {
    this.selectedFunctions = generateFunctionsMapFromList(this.functionList);
    LocalStorage.deleteKey(STRING_API_FUNCTIONS);
    LocalStorage.deleteKey(STRING_API_ELEM);
  }
  
  /**
   * Emits an event to the player
   */
  @Event({
    composed: true,
    bubbles: true}) 
  playerEvent: EventEmitter<any>;

  playerEventHandler(todo: { type: string , url?: string, autoPlay?:boolean, name?:string, param?:any}): void {
    this.playerEvent.emit(todo);
  }

  /**
   * Displays stream url popover
   * @param ev 
   */
  private async presentPopover(ev: any) {
    const popover = await popoverController.create({
      component: 'dashjs-api-link-selector',
      event: ev,
      translucent: true,
      componentProps: { sourceList: this.sourceList },
    });
    return await popover.present();
  }

  /**
   * Displays an API call's return value
   * @param event 
   */
  @Listen('playerResponse', { target: 'document' })
  async playerResponseHandler(event : CustomEvent): Promise<void> {
    const toast = await toastController.create({
      message:
        event.detail.return === null
          ? 'Please initialize the player.'
          : 'API function "' + event.detail.event + '" was called.\nReturn value: ' + JSON.stringify(event.detail.return),
      duration: 2000,
    });
    toast.present();
  }

  /**
   * Updates the media url
   * @param event 
   */
  private updateMediaUrl(event: CustomEvent): void {
    LocalVariableStore.mediaUrl = event.detail.value;
    this.mediaUrl = event.detail.value;
  }

  /**
   * Adds an api function into the selectedFunction list
   * @param key 
   */
  private tryAddApiFunction(key: string): void {
    const matchingSettings = Array.from(this.selectedFunctions.keys()).filter(e => e === key);
    if (matchingSettings.length === 1) {
      key = matchingSettings[0];
    } else {
      return;
    }
    if (this.selectedFunctions.has(key)) {
      const currFunction = this.functionList.filter(s => s.name === key)[0];
      const functionValue = initializeParam(currFunction.parameters);
      this.selectedFunctions.set(key, functionValue);
      this.selectedFunctions = new Map(this.selectedFunctions);
      LocalStorage.updateKeyInKeyValueObject(STRING_API_FUNCTIONS, key, functionValue);
    }
  }

  /**
   * Shows the MPD info of the media URL
   */
  private async showMPDInfo() {
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
            <ion-title>MPD Information</ion-title>,
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
            Auto start{' '}
            <ion-toggle
              id="autol"
              onIonChange={event => {
                this.autostart = event.detail.checked;
              }}
              checked={this.autostart}
            ></ion-toggle>
          </div>
          <ion-grid>
            <ion-row>
              <ion-col size="2">
                <ion-button shape="round" onClick={ev => this.presentPopover(ev)} class="fill_width">
                  Select Stream <ion-icon slot="end" name="caret-down-circle"></ion-icon>
                </ion-button>
              </ion-col>
              <ion-col size="7">
                <ion-item>
                  <ion-input id="stream_url" value={this.mediaUrl} onIonChange={event => this.updateMediaUrl(event)}></ion-input>
                  <ion-button shape="round" fill="outline" color="dark" onClick={() => this.showMPDInfo()} class="ion-float-right">
                  <ion-icon name="information"></ion-icon>
                </ion-button>
                </ion-item>
              </ion-col>
              <ion-col>
                <ion-button shape="round" color="dark" onClick={() => this.stopMedia()} class="ion-float-right">
                  Reset
                </ion-button>
                <ion-button shape="round" id="load" onClick={() => this.loadMedia()} class="ion-float-right">
                  (Re)Load
                </ion-button>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-list style={{ width: '100%' }} lines="full">
                {Array.from(this.selectedFunctions.keys())
                  .filter(k => this.selectedFunctions.get(k) != undefined)
                  .map(key => {
                    const ioncolcss = {
                      display: 'flex',
                      alignItems: 'center',
                    };
                    const currFunction = this.functionList.filter(s => s.name === key)[0];
                    return (
                      <ion-row class="bottom-border">
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
                            name={currFunction.name} 
                            param={currFunction.parameters}
                            value={this.selectedFunctions.get(key)}
                            onCallFunction={change => {
                              this.callFunction(key, change.detail);}
                            } 
                            onUpdateFunction={change => {
                              this.updateFunction(key, change.detail);}
                            } 
                          ></dashjs-api-control-element>
                        </ion-col>
                        <ion-col size="auto" style={ioncolcss}>
                          <dashjs-help-button helperText={currFunction.description} titleText={'Help - ' + currFunction.name}></dashjs-help-button>
                        </ion-col>
                      </ion-row>
                    );
                  })}
              </ion-list>
            </ion-row>
            <ion-row>
              <dashjs-input-search
                style={{ flex: '1' }}
                placeholder="Add more API calls..."
                searchItemList={Array.from(this.selectedFunctions.keys())
                  // Filter Settings which are already shown
                  .filter(e => this.selectedFunctions.get(e) == undefined)}
                onSearchItemSelected={event => this.tryAddApiFunction(event.detail)}
              ></dashjs-input-search>
              <ion-button shape="round" color="dark" onClick={() => this.openFunctions()}>
                Browse API Calls
                <ion-icon slot="end" name="search"></ion-icon>
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
