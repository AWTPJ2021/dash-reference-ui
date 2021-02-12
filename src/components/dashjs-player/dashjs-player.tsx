import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';
// declare var ControlBar: any;

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
  @State() streamInterval: any;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        console.log('Re-initializing the player:\n' + JSON.stringify(event.detail));
        this.player.reset();
        this.player = MediaPlayer().create();
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), event.detail.url, event.detail.autoPlay == 'true');
        // const controlbar = new ControlBar(this.player);
        // controlbar.initialize();
        this.streamInterval = setInterval(() => {
          this.streamMetricsEventHandler(this.player);
        }, 1000);
        break;
      case 'stop':
        console.log('Resetting the player');
        this.player.reset();
        clearInterval(this.streamInterval);
        break;
      case 'autoload':
        console.log('autoload state changed to: ' + event.detail.autoPlay);
        this.autoPlay = event.detail.autoPlay;
        break;
      case 'function':
        var returnValue = this.player[event.detail.name](event.detail.param);
        alert('The following function was called: ' + event.detail.name + '(' + event.detail.param + '). \nReturn:\n' + returnValue);
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
  // @State() isPaused: boolean;

  @Event() streamMetricsEvent: EventEmitter<Object>;

  streamMetricsEventHandler(player: any) {
    this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    console.log(this.element);
    this.player = MediaPlayer().create();
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), this.url, this.autoPlay);
    // const controlbar = new ControlBar(this.player);
    // controlbar.initialize();

    // this.isPaused = this.player.isPaused();
    //let url = this.currentUrl;
    //let player = MediaPlayer().create();
    //player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
  }

  componentWillLoad() {
    this.onUrlChange(this.streamUrl);
    // this.stream_watcher();
  }

  // @Watch('isPaused')
  // stream_watcher() {
  //   if (this.isPaused) clearInterval(this.streamInterval);
  // }

  @Watch('streamUrl')
  onUrlChange(newUrl: string) {
    if (newUrl) this.currentUrl = JSON.parse(newUrl);
  }

  render() {
    return (
      <Host>
        <slot>
          <ion-card>
            {/* <div class="myMainVideoPlayer" id="myMainVideoPlayer">
              <video controls={true} id="myMainVideoPlayer"></video>
              <div id="videoController" class="video-controller unselectable">
                <div id="playPauseBtn" class="btn-play-pause" title="Play/Pause">
                  <span id="iconPlayPause" class="icon-play"></span>
                </div>
                <span id="videoTime" class="time-display">
                  00:00:00
                </span>
                <div id="fullscreenBtn" class="btn-fullscreen control-icon-layout" title="Fullscreen">
                  <span class="icon-fullscreen-enter"></span>
                </div>
                <div id="bitrateListBtn" class="control-icon-layout" title="Bitrate List">
                  <span class="icon-bitrate"></span>
                </div>
                <input type="range" id="volumebar" class="volumebar" value="1" min="0" max="1" step=".01" />
                <div id="muteBtn" class="btn-mute control-icon-layout" title="Mute">
                  <span id="iconMute" class="icon-mute-off"></span>
                </div>
                <div id="trackSwitchBtn" class="control-icon-layout" title="A/V Tracks">
                  <span class="icon-tracks"></span>
                </div>
                <div id="captionBtn" class="btn-caption control-icon-layout" title="Closed Caption">
                  <span class="icon-caption"></span>
                </div>
                <span id="videoDuration" class="duration-display">
                  00:00:00
                </span>
                <div class="seekContainer">
                  <input type="range" id="seekbar" value="0" class="seekbar" min="0" step="0.01" />
                </div>
              </div>
            </div> */}

            <video controls={true} id="myMainVideoPlayer"></video>
          </ion-card>
        </slot>
      </Host>
    );
  }
}
