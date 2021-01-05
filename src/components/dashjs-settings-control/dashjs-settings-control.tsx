import { modalController } from '@ionic/core';
import { Component, Host, h, Watch, Method, Event, EventEmitter, State, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { Setting } from '../../types/types';
import { generateSettingsMapFromList, generateSettingsObjectFromListAndMap } from '../../utils/utils';

@Component({
  tag: 'dashjs-settings-control',
  styleUrl: 'dashjs-settings-control.css',
  shadow: false,
})
export class DashjsSettingsControl {
  @Prop() history: RouterHistory;
  @State() settingsList: Setting[] = [];
  @State() selectedSettings: Map<string, any> = new Map();
  @State() displayedSetting: string = 'settings.streaming.metricsMaxListDepth';

  // @Watch('defaultSettings')
  // updateSettings(newValue, oldValue) {
  //   // Update the settings
  // }

  @Method()
  async resetSettings() {
    this.selectedSettings = generateSettingsMapFromList(this.settingsList);
  }

  @Event() settingsUpdated: EventEmitter<Object>;

  async openSettings() {
    const modal = await modalController.create({
      component: 'dashjs-settings-control-modal',
      cssClass: 'browse-settings-modal',
      enterAnimation: undefined,
      componentProps: {
        settingsList: this.settingsList,
        selectedSettings: new Map(this.selectedSettings),
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedSettings = data;
    }
  }
  componentWillLoad() {
    fetch('/static/settingsMetaData.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.settingsList = response;
        this.selectedSettings = generateSettingsMapFromList(this.settingsList);
        const urlParams = new URLSearchParams(window.location.search);
        this.selectedSettings.forEach((value, key) => {
          // debugger;
          if (urlParams.has(key)) {
            this.selectedSettings.set(key, urlParams.get(key));
          }
        });
        this.selectedSettings = new Map(this.selectedSettings);
      });
  }

  setParam(key, value) {
    const url = new URL(window.location.href);

    if (url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.append(key, value);
    }
    window.history.pushState(null, null, url as any);
  }

  @Watch('selectedSettings')
  settingsUpdate() {
    this.settingsUpdated.emit(generateSettingsObjectFromListAndMap(this.settingsList, this.selectedSettings));
  }

  removeSetting(id: string) {
    this.selectedSettings.set(id, undefined);
    this.selectedSettings = new Map(this.selectedSettings);
  }

  updateSetting(id: string, value: any) {
    this.selectedSettings.set(id, value);
    this.setParam(id, value);
    this.selectedSettings = new Map(this.selectedSettings);
  }

  render() {
    return (
      <Host>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Settings</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-grid>
              <ion-row>
                {Array.from(this.selectedSettings.keys())
                  .filter(k => this.selectedSettings.get(k) != undefined)
                  .map(s => (
                    <ion-chip
                      color={s === this.displayedSetting ? 'primary' : 'secondary'}
                      onClick={() => {
                        this.displayedSetting = s;
                      }}
                    >
                      <ion-label>{s}</ion-label>
                      <ion-icon
                        name="close-circle"
                        onClick={event => {
                          event.stopPropagation();
                          this.removeSetting(s);
                        }}
                      ></ion-icon>
                    </ion-chip>
                  ))}
                {/* <ion-input placeholder="Add more settings..."></ion-input> */}
              </ion-row>
              <ion-row>
                <ion-button shape="round" color="dark" onClick={() => this.openSettings()}>
                  Browse Settings
                  <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
                </ion-button>
                <ion-button shape="round" fill="outline" color="dark" onClick={() => this.resetSettings()}>
                  Reset
                </ion-button>
              </ion-row>
              {/* <ion-row>
                <span>{this.displayedSetting}</span>
              </ion-row> */}
              <ion-row>
                <ion-list style={{ width: '100%' }}>
                  {Array.from(this.selectedSettings.keys())
                    .filter(k => this.selectedSettings.get(k) != undefined)
                    .map(key => (
                      <dashjs-settings-control-element
                        type={this.settingsList.filter(s => s.id === key)[0].type}
                        name={key}
                        options={this.settingsList.filter(s => s.id === key)[0].enum || undefined}
                        defaultValue={this.selectedSettings.get(key)}
                        onValueChanged={change => {
                          this.updateSetting(key, change.detail);
                        }}
                      ></dashjs-settings-control-element>
                    ))}
                </ion-list>
                {/* <dashjs-settings-control-element type={this.settingsList.filter(s => s.id === this.displayedSetting)[0].type}></dashjs-settings-control-element> */}
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </Host>
    );
  }
}
