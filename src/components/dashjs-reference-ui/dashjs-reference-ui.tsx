import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  render() {
    return (
      <Host>
        <dashjs-api-control></dashjs-api-control>
        <dashjs-settings-control onSettingsUpdated={event => console.log(event)}></dashjs-settings-control>
        <dashjs-player></dashjs-player>
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
