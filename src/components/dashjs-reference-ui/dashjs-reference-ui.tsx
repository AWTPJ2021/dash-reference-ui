import { Component, Host, h, Prop, Method } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  @Prop() url: string;

  render() {
    return (
      <Host>
        <dashjs-api-control></dashjs-api-control>
        <dashjs-settings-control onSettingsUpdated={event => console.log(event)}></dashjs-settings-control>
        <dashjs-player stream-url={''}></dashjs-player>
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
