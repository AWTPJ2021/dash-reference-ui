import { modalController } from '@ionic/core';
import { Component, h, Prop, State, Watch } from '@stencil/core';
import { Setting } from '../../types/types';

@Component({
  tag: 'dashjs-settings-control-modal',
  styleUrl: 'dashjs-settings-control-modal.scss',
  shadow: false,
})
export class DashjsSettingsControlModal {
  componentWillLoad() {
    this.viewedSettings = this.settingsList;
  }
  @Prop() settingsList: Setting[] = [];
  @Prop() selectedSettings: Map<string, any> = new Map();
  @Watch('selectedSettings') test(newSettings: Setting) {
    console.log(newSettings);
  }
  @State() viewedSettings: Setting[] = [];

  filterSettings(str: string) {
    if (str === '') {
      this.viewedSettings = this.settingsList;
      return;
    }
    this.viewedSettings = this.settingsList.filter(s => (s.name as string).includes(str));
  }

  save() {
    modalController.dismiss(this.selectedSettings);
  }

  cancel() {
    modalController.dismiss();
  }
  render() {
    return [
      <ion-searchbar
        onIonChange={e => {
          this.filterSettings(e.detail.value!);
        }}
      ></ion-searchbar>,
      <ion-content>
        <ion-grid>
          {this.viewedSettings.map(item => (
            <ion-row>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    {item.path.map(p => (
                      <span style={{ fontSize: '12px' }}>
                        {p} {'> '}
                      </span>
                    ))}
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="1">
                    <ion-checkbox
                      checked={this.selectedSettings.get(item.id) != undefined}
                      onIonChange={() => {
                        /* TODO: Document settings.js with better example values*/
                        this.selectedSettings.set(item.id, this.selectedSettings.get(item.id) === undefined ? (item.example == undefined ? '' : item.example) : undefined);
                      }}
                    ></ion-checkbox>
                  </ion-col>
                  <ion-col>{item.name}</ion-col>
                  <ion-col innerHTML={item.description}></ion-col>
                </ion-row>
              </ion-grid>
            </ion-row>
          ))}
        </ion-grid>
      </ion-content>,
      <ion-toolbar>
        <ion-button shape="round" fill="outline" onClick={() => this.cancel()}>
          Cancel
        </ion-button>
        <ion-button shape="round" slot="end" onClick={() => this.save()}>
          Save
        </ion-button>
      </ion-toolbar>,
    ];
  }
}
