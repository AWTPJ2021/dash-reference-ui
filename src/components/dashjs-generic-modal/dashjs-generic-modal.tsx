import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-generic-modal',
  styleUrl: 'dashjs-generic-modal.css',
  shadow: true,
})
export class DashjsGenericModal {
  @Prop() textTitle: string = '';
  @Prop() content: any;
  render() {
    return (
      <Host>
        <ion-header translucent>
          <ion-toolbar>{typeof this.textTitle === 'string' ? <ion-title>{this.textTitle}</ion-title> : this.textTitle}</ion-toolbar>
        </ion-header>
        <ion-content fullscreen>
          <ion-grid>{this.content}</ion-grid>
        </ion-content>
      </Host>
    );
  }
}
