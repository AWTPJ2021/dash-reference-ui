import { Component, Host, h, Element, Prop, Watch, Method } from '@stencil/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: true,
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

  connectedCallback() {}

  componentDidLoad() {
    console.log(this.element);
    this.url = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    this.player = MediaPlayer().create();
    this.player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), this.url, true);
  }

  render() {
    return (
      <Host>
        <slot>
          <ion-card>
            <video controls={true} id="myMainVideoPlayer"></video>
            </ion-card>
        </slot>
      </Host>
    );
  }
}
