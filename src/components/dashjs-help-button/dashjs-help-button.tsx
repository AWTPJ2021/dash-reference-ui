import { modalController } from '@ionic/core';
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-help-button',
  styleUrl: 'dashjs-help-button.css',
  shadow: true,
})
export class DashjsHelpButton {
  @Prop() helperText: string = '';
  @Prop() titleText: string = undefined;
  async showHelpModal() {
    const modal = await modalController.create({
      component: 'dashjs-generic-modal',
      componentProps: {
        content: <div innerHTML={this.helperText}></div>,
        textTitle: this.titleText ? this.titleText : 'Help',
      },
    });
    await modal.present();
  }
  render() {
    return (
      <Host>
        <ion-button
          size="small"
          fill="clear"
          onClick={event => {
            event.stopPropagation();
            this.showHelpModal();
          }}
        >
          <ion-icon slot="icon-only" color="dark" name="help-circle-outline"></ion-icon>
        </ion-button>
      </Host>
    );
  }
}
