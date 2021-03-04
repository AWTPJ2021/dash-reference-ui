import { modalController } from '@ionic/core';
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-help-button',
  styleUrl: 'dashjs-help-button.css',
  shadow: true,
})
export class DashjsHelpButton {
  /**
   * Informational text displayed in the Modal for help.
   */
  @Prop() helperText: string = '';
  /**
   * title displayed on top of the Modal.
   */
  @Prop() titleText: string = undefined;
  private async showHelpModal() {
    const modal = await modalController.create({
      component: 'dashjs-generic-modal',
      componentProps: {
        content: <div innerHTML={this.helperText}></div>,
        textTitle: this.titleText != undefined ? this.titleText : 'Help',
      },
    });
    await modal.present();
  }

  private showHelp = (event: MouseEvent) => {
    event.stopPropagation();
    this.showHelpModal();
  };
  render() {
    return (
      <Host>
        <ion-button size="small" fill="clear" onClick={this.showHelp} title={this.helperText}>
          <ion-icon slot="icon-only" color="dark" name="help-circle-outline"></ion-icon>
        </ion-button>
      </Host>
    );
  }
}
