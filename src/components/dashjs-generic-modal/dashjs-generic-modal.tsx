import { Component, Host, h, Prop } from '@stencil/core';
import { modalController } from '@ionic/core';

@Component({
  tag: 'dashjs-generic-modal',
  styleUrl: 'dashjs-generic-modal.css',
  shadow: true,
})
export class DashjsGenericModal {
  /**
   * Title displayed on Top of the Modal
   */
  @Prop() textTitle: string = '';
  /**
   * Content displayed inside the modal, can be text or an HTMLElement
   */
  @Prop() content: HTMLElement | string;

  private close = () => {
    modalController.dismiss();
  };

  render() {
    return (
      <Host>
        <ion-header translucent>
          <ion-toolbar>
            <ion-title>{this.textTitle}</ion-title>
            <ion-buttons slot="end">
              <ion-button onClick={this.close}>
                <ion-icon name="close-circle-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content fullscreen>
          <ion-grid>
            <ion-item class="spacing" lines="none">
              {this.content}
            </ion-item>
          </ion-grid>
        </ion-content>
      </Host>
    );
  }
}
