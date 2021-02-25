import { popoverController } from '@ionic/core';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-popover-select',
  styleUrl: 'dashjs-popover-select.css',
  shadow: true,
})
export class DashjsPopoverSelect {
  @Prop() options: string[] = [];

  render() {
    return [
      <ion-list>
        {this.options.map(option => (
          <ion-item button onClick={() => popoverController.dismiss(option)}>
            <ion-label>{option}</ion-label>
          </ion-item>
        ))}
        {this.options.length == 0 ? <div>No Results</div> : undefined}
      </ion-list>,
    ];
  }
}
