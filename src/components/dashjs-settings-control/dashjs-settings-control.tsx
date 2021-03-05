import { InputChangeEventDetail, modalController, popoverController } from '@ionic/core';
import { Component, Host, h, Watch, Method, Event, EventEmitter, State, Prop, Element } from '@stencil/core';
import { MediaPlayerSettingClass } from 'dashjs';
import { Setting, Tree } from '../../types/types';
import { LocalVariableStore } from '../../utils/localStorage';
import { removeQueryParams, setParam } from '../../utils/queryParams';
import { generateSettingsMapFromList, generateSettingsObjectFromListAndMap, settingsListToTree } from '../../utils/utils';

@Component({
  tag: 'dashjs-settings-control',
  styleUrl: 'dashjs-settings-control.css',
  shadow: false,
})
export class DashjsSettingsControl {
  /**
   * The version of which the settings should be loaded.
   */
  @Prop() version: string | undefined = undefined;
  @Watch('version')
  watchHandlerVersion(): void {
    this.loadSettingsMetaData();
  }
  /**
   * List of Objects with each Setting
   */
  @State() settingsList: Setting[] = [];
  /**
   * Map of all Settings:
   * Settings which are not displayed are undefined
   */
  @State() selectedSettings: Map<string, any> = new Map();
  @Watch('selectedSettings')
  settingsUpdate(force: boolean = false): void {
    if (this.autoUpdate || force === true) {
      this.settingsUpdated.emit(generateSettingsObjectFromListAndMap(this.settingsList, this.selectedSettings));
    }
  }
  /**
   * Resets the internal Settings
   */
  @Method()
  async resetSettings(): Promise<void> {
    this.selectedSettings = generateSettingsMapFromList(this.settingsList);
    removeQueryParams();
  }
  /**
   * Emitted everytime the Settings are updated
   */
  @Event()
  settingsUpdated: EventEmitter<MediaPlayerSettingClass>;
  /**
   * Tree Representation of the Settings
   */
  @State() settingsTree: Tree;
  /**
   * Whether Changes of Settings should be automatically emitted or if it should be done manually
   */
  @State() autoUpdate: boolean = true;
  @Watch('autoUpdate')
  watchHandlerAutoUpdate(value: boolean): void {
    LocalVariableStore.settings_autoupdate = value;
  }
  @Element() el: HTMLDashjsSettingsControlElement;

  private searchElement: HTMLInputElement;
  private debounceTimer: NodeJS.Timeout | undefined;
  private searchPopover: any;

  private async openSettings() {
    const modal = await modalController.create({
      component: 'dashjs-settings-control-modal',
      cssClass: 'browse-settings-modal',
      enterAnimation: undefined,
      componentProps: {
        settingsList: this.settingsList,
        settingsTree: this.settingsTree,
        selectedSettings: new Map(this.selectedSettings),
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedSettings = data;
    }
  }
  componentWillLoad(): void {
    this.autoUpdate = LocalVariableStore.settings_autoupdate;
    if (this.version != undefined) {
      this.loadSettingsMetaData();
    }
  }
  private loadSettingsMetaData() {
    this.settingsList = [];
    fetch(`/static/gen/settingsMetaData-${this.version}.json`)
      .then((response: Response) => response.json())
      .then(response => {
        this.settingsList = response;
        const settings = generateSettingsMapFromList(this.settingsList);
        const urlParams = new URLSearchParams(window.location.search);
        settings.forEach((_value, key) => {
          if (urlParams.has(key)) {
            settings.set(key, urlParams.get(key));
          }
        });
        this.selectedSettings = new Map(settings);
        this.settingsTree = settingsListToTree(this.settingsList);
      })
      .catch(() => {
        this.settingsList = undefined;
      });
  }

  private removeSetting(id: string): void {
    this.selectedSettings.set(id, undefined);
    setParam(id, undefined);
    this.selectedSettings = new Map(this.selectedSettings);
  }

  private updateSetting(id: string, value: any): void {
    this.selectedSettings.set(id, value);
    setParam(id, value);
    this.selectedSettings = new Map(this.selectedSettings);
  }
  private async updateSearch(event: CustomEvent<InputChangeEventDetail>): Promise<void> {
    if (event.detail.value == '') {
      if (this.debounceTimer != undefined) {
        clearTimeout(this.debounceTimer);
      }
      if (this.searchPopover) {
        await this.searchPopover.dismiss();
      }
      return;
    }
    const next = async () => {
      const regex = new RegExp(event.detail.value, 'i');
      const matchingSettings = Array.from(this.selectedSettings.keys())
        // Filter only matching keys
        .filter(e => e.match(regex))
        // Filter Settings which are already shown
        .filter(e => this.selectedSettings.get(e) == undefined);
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
          options: matchingSettings.map(el => el.slice(9)),
        },
      });
      await this.searchPopover.present();
      this.searchElement.focus();
      const { data } = await this.searchPopover.onWillDismiss();
      if (data) {
        this.tryAddSetting(data) ? (this.searchElement.value = '') : undefined;
      }
    };

    if (this.debounceTimer != undefined) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(next, 500);
  }

  private tryAddSetting(key: string): boolean {
    const regex = new RegExp(key, 'i');
    const matchingSettings = Array.from(this.selectedSettings.keys()).filter(e => e.match(regex));
    if (matchingSettings.length === 1) {
      key = matchingSettings[0];
    } else {
      return false;
    }
    if (this.selectedSettings.has(key)) {
      const setting = this.settingsList.find(el => el.id === key);
      this.updateSetting(key, setting != undefined ? (setting.example == undefined ? '' : setting.example) : undefined);
      this.searchElement.value = '';
      return true;
    }
    return false;
  }

  private async showSettingsJSON() {
    const modal = await modalController.create({
      component: 'dashjs-generic-modal',
      componentProps: {
        content: (
          <pre>
            <code>{JSON.stringify(generateSettingsObjectFromListAndMap(this.settingsList, this.selectedSettings), null, 2)}</code>
          </pre>
        ),
        textTitle: 'Settings JSON',
      },
    });
    await modal.present();
  }

  render() {
    return (
      <Host>
        <ion-accordion titleText="Settings">
          <div slot="title" style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}>
            <ion-button shape="round" fill="outline" color="dark" onClick={() => this.showSettingsJSON()} style={{ marginRight: '15px' }}>
              Copy Settings
            </ion-button>
            {this.autoUpdate ? undefined : (
              <ion-button onClick={() => this.settingsUpdate(true)} shape="round" color="dark" style={{ marginRight: '15px' }}>
                Update
              </ion-button>
            )}
            Auto Update <ion-toggle id="autol" checked={this.autoUpdate} onIonChange={change => (this.autoUpdate = change.detail.checked)}></ion-toggle>
          </div>
          <ion-grid>
            <ion-row>
              <ion-grid style={{ width: '100%' }}>
                {this.settingsList == undefined ? (
                  <div>Error while Loading the Specified Version MetaDatafile</div>
                ) : this.settingsList.length == 0 ? (
                  <div>Loading</div>
                ) : this.settingsTree == undefined ? undefined : (
                  <dashjs-tree
                    root={true}
                    tree={this.settingsTree}
                    elements={Array.from(this.selectedSettings.keys()).filter(k => this.selectedSettings.get(k) != undefined)}
                    renderFunc={key => {
                      // Due to this being a function used in another component css cant be applied from the stylesheet
                      const ioncolcss = {
                        display: 'flex',
                        alignItems: 'center',
                      };
                      const setting = this.settingsList.filter(s => s.id === key)[0];
                      return (
                        <ion-row>
                          <ion-col size="auto" style={ioncolcss}>
                            <ion-button
                              size="small"
                              fill="clear"
                              onClick={event => {
                                event.stopPropagation();
                                this.removeSetting(key);
                              }}
                            >
                              <ion-icon slot="icon-only" color="dark" name="close-circle-outline"></ion-icon>
                            </ion-button>
                            {/* <ion-icon name="close-circle"></ion-icon> */}
                          </ion-col>
                          <ion-col>
                            <dashjs-settings-control-element
                              type={setting.type}
                              name={setting.name}
                              options={setting.enum || undefined}
                              optionsLabels={setting.enumLabels || undefined}
                              defaultValue={this.selectedSettings.get(key)}
                              onValueChanged={change => {
                                this.updateSetting(key, change.detail);
                              }}
                            ></dashjs-settings-control-element>
                          </ion-col>
                          <ion-col size="auto" style={ioncolcss}>
                            <dashjs-help-button helperText={setting.description} titleText={'Help - ' + setting.name}></dashjs-help-button>
                          </ion-col>
                        </ion-row>
                      );
                    }}
                  ></dashjs-tree>
                )}
                <ion-row>
                  <ion-input
                    ref={el => (this.searchElement = (el as unknown) as HTMLInputElement)}
                    placeholder="Add more settings..."
                    onIonChange={event => this.updateSearch(event)}
                    onKeyPress={event => (event.code === 'Enter' ? this.tryAddSetting((event.target as any).value) : null)}
                  ></ion-input>
                  <ion-button shape="round" color="dark" onClick={() => this.openSettings()}>
                    Browse Settings
                    <ion-icon slot="end" name="search"></ion-icon>
                  </ion-button>
                  <ion-button shape="round" fill="outline" color="dark" onClick={() => this.resetSettings()}>
                    Reset
                  </ion-button>
                </ion-row>
              </ion-grid>
            </ion-row>
          </ion-grid>
        </ion-accordion>
      </Host>
    );
  }
}
