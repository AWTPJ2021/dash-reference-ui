import { modalController } from '@ionic/core';
import { Component, h, Prop, State } from '@stencil/core';
import { DashFunction } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-modal',
  styleUrl: 'dashjs-api-control-modal.scss',
  shadow: false,
})
export class DashjsSettingsControlModal {
  componentWillLoad() {
    this.viewedFunctions = this.functionList;
  }
  @Prop() functionList: DashFunction[] = [];
  @Prop() selectedFunctions: Map<string, any> = new Map();
  @State() viewedFunctions: DashFunction[] = [];
  @State() triggerRerender = 0;

  filterSettings(str: string) {
    if (str === '') {
      this.viewedFunctions = this.functionList;
      return;
    }
    this.viewedFunctions = this.functionList.filter(s => (s.name as string).includes(str));
  }

  save() {
    modalController.dismiss(this.selectedFunctions);
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
              <ion-col size="1"></ion-col>
              <ion-col size="3">Function</ion-col>
              <ion-col size="6">Description</ion-col>
              <ion-col size="2">Parameters</ion-col>
          </ion-row>
          <ion-grid>
          {this.viewedFunctions.map(item => item.parameters.length <= 1 ? (
            <ion-row onClick={() => {
              this.selectedFunctions.set(item.name, this.selectedFunctions.get(item.name) === undefined ? item.parameters : undefined);
              this.triggerRerender++;
            }}>
                <ion-col size="1">
                    <ion-checkbox
                      checked={this.selectedFunctions.get(item.name) != undefined}
                    ></ion-checkbox>
                  </ion-col>
                <ion-col size="3">{item.name}</ion-col>
                <ion-col size="6" innerHTML={item.description}></ion-col>
                <ion-col size="2"> {item.parameters.map(p => (p.name + "(" + p.type+")"))} </ion-col>
            </ion-row>
          ) : "" )}
          </ion-grid>
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
