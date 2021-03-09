import { StencilComponentPrefetch } from '@beck24/stencil-component-prefetch/dist/types/components/stencil-component-prefetch/stencil-component-prefetch';
import { SelectChangeEventDetail } from '@ionic/core';
import { Component, Host, h, Element, Build, getAssetPath, State } from '@stencil/core';
import { DASHJS_PLAYER_TYPE } from '../../defaults';
import { LocalVariableStore } from '../../utils/localStorage';
import { setParam } from '../../utils/queryParams';
import { contributors } from './contributors';
const STATIC_VERSION_QUERY_PARAM = 'version';
const STATIC_TYPE_QUERY_PARAM = 'type';

@Component({
  tag: 'dashjs-reference-ui',
  styleUrl: 'dashjs-reference-ui.scss',
  assetsDirs: ['assets'],
  shadow: false,
})
export class DashjsReferenceUi {
  @State() versions: string[] = [];
  @State() selectedVersion: string | undefined = undefined;
  @State() type: string[] = ['min', 'debug'];
  @State() selectedType: string = DASHJS_PLAYER_TYPE;
  @State() settings: dashjs.MediaPlayerSettingClass = {};
  @State() darkModeActive = LocalVariableStore.darkmode_active;
  @Element() prefetcher: HTMLDashjsReferenceUiElement;
  private dashjsplayer: HTMLDashjsPlayerElement;
  private dashjsplayer_accordion: HTMLIonAccordionElement;

  componentWillLoad(): void {
    fetch('/static/gen/versions.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.versions = response;
        const urlParams = new URLSearchParams(window.location.search);
        this.selectedVersion = urlParams.get(STATIC_VERSION_QUERY_PARAM) || this.selectedVersion;
        this.selectedType = urlParams.get(STATIC_TYPE_QUERY_PARAM) || this.selectedType;
        if (this.selectedVersion == undefined) {
          this.selectedVersion = response[0];
        }
      });
    if (!LocalVariableStore.darkmode_activeSet()) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkModeActive = prefersDark.matches;
    }
    this.toggleDarkTheme(this.darkModeActive);
  }
  componentDidLoad(): void {
    // Prefetch Componentes that are needed immendiatley on user interaction later on
    const prefetchedComponents = ['dashjs-popover-select', 'ion-popover', 'ion-backdrop', 'ion-modal', 'dashjs-settings-control-modal', 'ion-searchbar', 'ion-content'];

    if (Build.isBrowser) {
      // only pre-fetch if it's a real browser
      const prefetch: StencilComponentPrefetch = (this.prefetcher.querySelector('stencil-component-prefetch') as unknown) as StencilComponentPrefetch;

      prefetch.setComponents(
        prefetchedComponents.map(comp => {
          return {
            tag: comp,
          };
        }),
      );
    }
  }
  private typeChange = (change: CustomEvent<SelectChangeEventDetail<unknown>>) => {
    change.stopPropagation();
    this.selectedType = change.detail.value as string;
    setParam(STATIC_TYPE_QUERY_PARAM, this.selectedType);
  };
  private versionChange = (change: CustomEvent<SelectChangeEventDetail<unknown>>) => {
    change.stopPropagation();
    this.selectedVersion = change.detail.value as string;
    setParam(STATIC_VERSION_QUERY_PARAM, this.selectedVersion);
  };
  private settingsChange = (change: CustomEvent<dashjs.MediaPlayerSettingClass>) => {
    change.stopPropagation();
    this.settings = change.detail;
    setParam(STATIC_VERSION_QUERY_PARAM, this.selectedVersion);
  };

  private toggleDarkTheme(active = false) {
    document.body.classList.toggle('dark', active);
  }
  render() {
    const centercss = {
      display: 'flex',
      alignItems: 'center',
      flexFlow: 'row',
    };
    return (
      <Host>
        <stencil-component-prefetch />
        <ion-toolbar>
          <ion-title>
            <div style={centercss}>
              <a href="https://dashif.org/" style={{ 'color': 'var(--color)', 'text-decoration': 'none' }}>
                DashJS Reference UI
              </a>
              <iframe
                style={{ 'margin-left': '15px' }}
                id="star-button"
                src="//ghbtns.com/github-btn.html?user=Dash-Industry-Forum&repo=dash.js&type=watch&count=true&size=large"
                height="30"
                width="150"
              ></iframe>
              <iframe id="fork-button" src="//ghbtns.com/github-btn.html?user=Dash-Industry-Forum&repo=dash.js&type=fork&count=true&size=large" height="30" width="150"></iframe>
            </div>
          </ion-title>
          <ion-buttons slot="end">
            Type:
            <ion-select interface="popover" value={this.selectedType} onIonChange={this.typeChange}>
              {this.type.map(type => (
                <ion-select-option value={type}>{type}</ion-select-option>
              ))}
            </ion-select>
          </ion-buttons>
          <ion-buttons slot="end">
            Version:
            <ion-select interface="popover" value={this.selectedVersion} onIonChange={this.versionChange}>
              {this.versions.map(version => (
                <ion-select-option id={version} value={version}>
                  {version}
                </ion-select-option>
              ))}
            </ion-select>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button
              shape="round"
              color="dark"
              onClick={() => {
                this.darkModeActive = !this.darkModeActive;
                LocalVariableStore.darkmode_active = this.darkModeActive;
                this.toggleDarkTheme(this.darkModeActive);
              }}
              class="ion-float-right"
            >
              <ion-icon name={this.darkModeActive ? 'sunny-outline' : 'moon-outline'}></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        {this.selectedVersion != undefined ? (
          Number(this.selectedVersion.slice(1).split('.')[0]) < 3 ? (
            <ion-toolbar color="warning" class="version-warning">
              <ion-title>
                <ion-icon slot="icon-only" md="info"></ion-icon>
                Support for Versions below v3.0.0 is experimental - expect bugs!
              </ion-title>
            </ion-toolbar>
          ) : undefined
        ) : undefined}
        <dashjs-api-control version={this.selectedVersion}></dashjs-api-control>
        <dashjs-settings-control version={this.selectedVersion} onSettingsUpdated={this.settingsChange}></dashjs-settings-control>
        <ion-accordion titleText="Video Player" ref={el => (this.dashjsplayer_accordion = el as HTMLIonAccordionElement)}>
          <div slot="title" style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end' }}>
            <ion-button
              size="small"
              fill="clear"
              onClick={event => {
                event.stopPropagation();
                this.dashjsplayer.showPiP();
                this.dashjsplayer_accordion.setExpandState(false);
              }}
            >
              <ion-icon slot="icon-only" color="dark" name="open-outline"></ion-icon>
            </ion-button>
          </div>
          <dashjs-player
            version={this.selectedVersion}
            type={this.selectedType}
            settings={this.settings}
            ref={el => (this.dashjsplayer = el as HTMLDashjsPlayerElement)}
          ></dashjs-player>
        </ion-accordion>
        <dashjs-statistics></dashjs-statistics>
        <div class="contributors-title">
          <text>Contributors</text>
        </div>
        <div class="contributors">
          {contributors.map(contributor => (
            <a href={contributor.link} target="_blank">
              {contributor.logo != undefined ? <img alt={contributor.name} src={getAssetPath(`./assets/${contributor.logo}`)} /> : contributor.name}
            </a>
          ))}
        </div>
      </Host>
    );
  }
}
