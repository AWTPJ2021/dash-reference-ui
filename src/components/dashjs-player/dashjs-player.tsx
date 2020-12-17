import { Component, Host, h, Element, State, Prop, Watch, Method } from '@stencil/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: false,
})
export class DashjsPlayer {
  @Element() 
  private element: HTMLElement;
  private player : MediaPlayerClass;

  @Prop() url : string;

  @Watch('url')
	protected url_watcher(newUrl: string): void {
    console.log("Changed value: " + newUrl);
	  this.player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), newUrl, true);
	}

  @Prop() streamUrl: string;
  @State() currentUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  componentDidLoad() {
    console.log(this.element);
    let url = this.currentUrl;
    let player = MediaPlayer().create();
    player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
  }

  componentWillLoad() {
    this.onUrlChange(this.streamUrl);
  }

  @Watch('streamUrl')
  onUrlChange(newUrl: string) {
    if (newUrl) this.currentUrl = JSON.parse(newUrl);
  }

  render() {
    return (
      <Host>
        <slot>
          <ion-card class="player-wrapper">
            <video controls={true} id="myMainVideoPlayer"></video>
            </ion-card>
        </slot>
      </Host>
    );
  }
}
