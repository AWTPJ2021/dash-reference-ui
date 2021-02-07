import { modalController } from '@ionic/core';
import { Component, h, Prop, State, Watch } from '@stencil/core';
import { Setting, Tree } from '../../types/types';

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
  @Prop() settingsTree: Tree = undefined;
  @Prop() selectedSettings: Map<string, any> = new Map();
  @Watch('selectedSettings') test(newSettings: Setting) {
    console.log(newSettings);
  }
  @State() viewedSettings: Setting[] = [];
  @State() triggerRerender = 0;

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
          <ion-row>
            <ion-grid>
              <dashjs-tree
                root={true}
                tree={this.settingsTree}
                elements={this.viewedSettings.map(s => s.id)}
                renderFuncTitle={path => {
                  return <h3>{path.join(' >> ')}</h3>;
                }}
                renderFuncSuffix={() => undefined}
                renderFunc={key => {
                  let setting = this.viewedSettings.filter(s => s.id === key)[0];
                  return [
                    <ion-row
                      onClick={() => {
                        this.selectedSettings.set(key, this.selectedSettings.get(key) === undefined ? (setting.example == undefined ? '' : setting.example) : undefined);
                        this.triggerRerender++;
                      }}
                    >
                      <ion-col size="auto">
                        <ion-checkbox checked={this.selectedSettings.get(key) != undefined}></ion-checkbox>
                      </ion-col>
                      <ion-col>{setting.name}</ion-col>
                      <ion-col innerHTML={setting.description}></ion-col>
                    </ion-row>,
                    <ion-item-divider></ion-item-divider>,
                  ];
                }}
              ></dashjs-tree>
            </ion-grid>
          </ion-row>
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
