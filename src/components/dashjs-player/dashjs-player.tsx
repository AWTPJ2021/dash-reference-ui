import { Component, Host, h, Element, State, Prop, Watch, Listen } from '@stencil/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: false,
})
export class DashjsPlayer {
  @Element()
  private element: HTMLElement;
  private player: MediaPlayerClass;

  @Prop() url: string = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  @State() autoPlay: boolean;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        console.log('Re-initializing the player:\n' + JSON.stringify(event.detail));
        this.player.reset();
        this.player = MediaPlayer().create();
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), event.detail.url, event.detail.autoPlay == 'true');
        break;
      case 'stop':
        console.log('Resetting the player');
        this.player.reset();
        break;
      case 'autoload':
        console.log('autoload state changed to: ' + event.detail.autoPlay);
        this.autoPlay = event.detail.autoPlay;
        break;
    }
  }

  @Listen('settingsUpdated', { target: 'document' })
  settingsUpdate(event) {
    console.log('Received the updated settings: ', event.detail);

    this.player?.updateSettings({
      debug: event?.detail?.debug,
      streaming: event?.detail?.streaming,
    });
  }

  @Watch('url')
  protected url_watcher(newUrl: string): void {
    console.log('Changed value: ' + newUrl);
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), newUrl, this.autoPlay);
  }

  @Prop() streamUrl: string;
  @State() currentUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  componentDidLoad() {
    console.log(this.element);

    this.player = MediaPlayer().create();
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), this.url, this.autoPlay);

    //let url = this.currentUrl;
    //let player = MediaPlayer().create();
    //player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
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
          <ion-card>
            <video controls={true} id="myMainVideoPlayer"></video>
          </ion-card>
        </slot>
      </Host>
    );
  }
}
