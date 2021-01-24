import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  @Prop() url: string;

  render() {
    return (
      <Host>
        <ion-toolbar>
          <ion-title>DashJS Reference UI</ion-title>
          <ion-buttons slot="end">
            Version:
            <ion-select interface="popover">
              <ion-select-option value="v3.2.0">v3.2.0</ion-select-option>
              <ion-select-option value="snes">SNES</ion-select-option>
            </ion-select>
          </ion-buttons>
        </ion-toolbar>
        <dashjs-api-control></dashjs-api-control>
        <dashjs-settings-control onSettingsUpdated={event => console.log(event.detail)}></dashjs-settings-control>
        <dashjs-player></dashjs-player>
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
