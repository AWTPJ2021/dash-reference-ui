import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-settings-control-modal',
  styleUrl: 'dashjs-settings-control-modal.css',
  shadow: true,
})
export class DashjsSettingsControlModal {
  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 89, 0];
  render() {
    return (
      <ion-content>
        <ion-searchbar></ion-searchbar>
        <ion-grid>
          {this.array.map((item: any) => (
            <ion-row>
              <ion-col>{item}</ion-col>
              <ion-col>ion-col</ion-col>
              <ion-col>ion-col</ion-col>
              <ion-col>ion-col</ion-col>
            </ion-row>
          ))}
        </ion-grid>
        <ion-button>Save</ion-button>
        <ion-button>Cancel</ion-button>
      </ion-content>
    );
  }
}
