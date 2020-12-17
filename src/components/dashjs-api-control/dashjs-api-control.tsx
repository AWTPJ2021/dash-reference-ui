import { Component, Host, h, Prop, Listen } from '@stencil/core';

@Component({
  tag: 'dashjs-api-control',
  styleUrl: 'dashjs-api-control.css',
  assetsDirs: ['sources'],
  shadow: true,
})
export class DashjsApiControl {
  @Prop()
  json = 'sources.json';

  protected componentDidLoad(): void {
    console.log(this.json);
  }

  render() {
    return (
      <Host>
        <ion-card>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="2">
                  <ion-item>
                    <ion-label>Stream</ion-label>
                    <ion-select interface="popover">
                      <ion-select-option value="nes">NES</ion-select-option>
                      <ion-select-option value="n64">Nintendo64</ion-select-option>
                      <ion-select-option value="ps">PlayStation</ion-select-option>
                      <ion-select-option value="genesis">Sega Genesis</ion-select-option>
                      <ion-select-option value="saturn">Sega Saturn</ion-select-option>
                      <ion-select-option value="snes">SNES</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
                <ion-col size="8">
                  <ion-item>
                    <ion-textarea id="stream_url" rows={1} value="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd"></ion-textarea>
                  </ion-item>
                </ion-col>
                <ion-col size="2">
                  <ion-item class="noBorder">
                    <ion-button color="dark" slot="end">
                      Stop
                    </ion-button>
                    <ion-button slot="end">Load</ion-button>
                    <ion-toggle checked slot="end"></ion-toggle>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </Host>
    );
  }
}
