import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-settings-control',
  styleUrl: 'dashjs-settings-control.css',
  shadow: false,
})
export class DashjsSettingsControl {

  render() {
    return (
      <Host>
                <ion-card>
        <ion-card-header>
          <ion-card-title>Settings</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </ion-card-content>
      </ion-card>
      </Host>
    );
  }

}
