import { Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  @Prop() url : string;

  render() {
    return (
      <Host>
        <dashjs-api-control></dashjs-api-control>
        <dashjs-settings-control></dashjs-settings-control>
        <dashjs-player></dashjs-player>
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
