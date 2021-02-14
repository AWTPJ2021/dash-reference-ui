import { popoverController } from '@ionic/core';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-popover-select',
  styleUrl: 'dashjs-popover-select.css',
  shadow: true,
})
export class DashjsPopoverSelect {
  @Prop() isAPI : boolean;
  @Prop() options: string[] = [];

  render() {
    console.log("THIS API: " + this.isAPI);
    return [
      <ion-list>
        {this.options.map(el => (
          <ion-item button onClick={() => popoverController.dismiss(el)}>
            <ion-label>{this.isAPI? el : el.slice(9)}</ion-label>
          </ion-item>
        ))}
        {this.options.length == 0 ? <div>No Results</div> : undefined}
      </ion-list>,
    ];
  }
}
