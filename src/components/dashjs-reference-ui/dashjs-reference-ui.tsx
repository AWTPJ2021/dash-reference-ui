import { StencilComponentPrefetch } from '@beck24/stencil-component-prefetch/dist/types/components/stencil-component-prefetch/stencil-component-prefetch';
import { Component, Host, h, Prop, Element, Build } from '@stencil/core';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.css',
  shadow: false,
})
export class DashjsReferenceUi {
  @Prop() url: string;
  @Prop() versions: string[] = [];
  @Prop() selectedVersion: string = undefined;
  @Prop() type: string[] = ['min', 'debug'];
  @Prop() selectedType: string = 'min';
  @Element() prefetcher: HTMLElement;

  componentWillLoad() {
    fetch('/static/gen/versions.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.versions = response;
        this.selectedVersion = response[0];
      });
  }
  componentDidLoad() {
    // Prefetch Componentes that are needed immendiatley on user interaction later on
    const componentsConfig = [
      {
        tag: 'dashjs-popover-select',
      },
      {
        tag: 'ion-popover',
      },
      {
        tag: 'ion-backdrop',
      },
      {
        tag: 'ion-modal',
      },
      {
        tag: 'dashjs-settings-control-modal',
      },
      {
        tag: 'ion-searchbar',
      },
      {
        tag: 'ion-content',
      },
    ];

    if (Build.isBrowser) {
      // only pre-fetch if it's a real browser
      const prefetch: StencilComponentPrefetch = this.prefetcher.querySelector('stencil-component-prefetch') as any;

      prefetch.setComponents(componentsConfig);
    }
  }
  render() {
    return (
      <Host>
        <stencil-component-prefetch />
        <ion-toolbar>
          <ion-title>DashJS Reference UI</ion-title>
          <ion-buttons slot="end">
            Type:
            <ion-select interface="popover" value={this.selectedType} onIonChange={change => (this.selectedType = change.detail.value)}>
              {this.type.map(type => (
                <ion-select-option value={type}>{type}</ion-select-option>
              ))}
            </ion-select>
          </ion-buttons>
          <ion-buttons slot="end">
            Version:
            <ion-select interface="popover" value={this.selectedVersion} onIonChange={change => (this.selectedVersion = change.detail.value)}>
              {this.versions.map(version => (
                <ion-select-option value={version}>{version}</ion-select-option>
              ))}
            </ion-select>
          </ion-buttons>
        </ion-toolbar>
        <dashjs-api-control version={this.selectedVersion}></dashjs-api-control>
        <dashjs-settings-control version={this.selectedVersion} onSettingsUpdated={event => console.log(event.detail)}></dashjs-settings-control>
        {/* <dashjs-settings-control></dashjs-settings-control> */}
        <dashjs-player version={this.selectedVersion} type={this.selectedType}></dashjs-player>
        <dashjs-statistics></dashjs-statistics>
      </Host>
    );
  }
}
