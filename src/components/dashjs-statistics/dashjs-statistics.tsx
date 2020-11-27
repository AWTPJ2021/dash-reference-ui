import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-statistics',
  styleUrl: 'dashjs-statistics.css',
  shadow: true,
})
export class DashjsStatistics {

  render() {
    return (
      <Host>
               <ion-card>
        <ion-card-header>
          <ion-card-title>Statistics</ion-card-title>
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
