import { modalController } from '@ionic/core';
import { Component, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'dashjs-settings-control-modal',
  styleUrl: 'dashjs-settings-control-modal.scss',
  shadow: false,
})
export class DashjsSettingsControlModal {
  componentWillLoad() {
    this.viewedSettings = this.allSettings;
  }
  @Prop() allSettings = [];
  @Watch('allSettings') test(newI: any, old: any) {
    console.log(this.allSettings);
  }
  @State() viewedSettings = [];

  filterSettings(str: string) {
    if (str === '') {
      this.viewedSettings = this.allSettings;
      return;
    }
    this.viewedSettings = this.allSettings.filter(s => (s.name as string).includes(str));
  }

  save() {
    modalController.dismiss(this.viewedSettings);
  }

  cancel() {
    modalController.dismiss();
  }
  render() {
    return [
      <ion-searchbar
        onIonChange={e => {
          this.filterSettings(e.detail.value!);
          console.log(e.detail.value!);
        }}
      ></ion-searchbar>,
      <ion-content>
        <ion-grid>
          {this.viewedSettings.map((item: any) => (
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
                      checked={item.selected}
                      onIonChange={change => {
                        item.selected = change.detail.checked;
                        // console.log(change.detail.checked);
                      }}
                    ></ion-checkbox>
                  </ion-col>
                  <ion-col>{item.selected}</ion-col>
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
