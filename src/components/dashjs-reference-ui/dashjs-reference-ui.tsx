import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  @Prop() url: string;
  @Prop() versions: string[] = [];
  @Prop() selectedVersion: string = '';
  componentWillLoad() {
    fetch('/static/gen/versions.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.versions = response;
        this.selectedVersion = response[0];
      });
  }
  render() {
    return (
      <Host>
        <ion-toolbar>
          <ion-title>DashJS Reference UI</ion-title>
          <ion-buttons slot="end">
            Version:
            <ion-select interface="popover" value={this.selectedVersion}>
              {this.versions.map(version => (
                <ion-select-option value={version}>{version}</ion-select-option>
              ))}
            </ion-select>
          </ion-buttons>
        </ion-toolbar>
        <dashjs-api-control></dashjs-api-control>
        <dashjs-settings-control onSettingsUpdated={event => console.log(event.detail)}></dashjs-settings-control>
        {/* <dashjs-settings-control></dashjs-settings-control> */}
        {/* <dashjs-player></dashjs-player> */}
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
