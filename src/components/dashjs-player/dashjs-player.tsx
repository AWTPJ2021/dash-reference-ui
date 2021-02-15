import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
declare var dashjs: any;
declare var ControlBar: any;

@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
  shadow: false,
})
export class DashjsPlayer {
  @Element()
  private element: HTMLElement;
  private player: MediaPlayerClass;

  @State()
  controlbar: any;

  @Prop() url: string = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
  @Watch('url')
  protected watchHandlerUrl(newUrl: string): void {
    console.log('Changed value: ' + newUrl);
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer video'), newUrl, this.autoPlay);
  }
  @Prop() version: string = undefined;
  @Watch('version')
  protected watchHandlerVersion() {
    this.loadOrUpdateDashJsScript();
  }
  @Prop() type: string = undefined;
  @Watch('type')
  protected watchHandlerType() {
    this.loadOrUpdateDashJsScript();
  }

  @State() autoPlay: boolean;
  @State() streamInterval: any;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        console.log('Re-initializing the player:\n' + JSON.stringify(event.detail));
        if (this.player) {
          this.player.reset();
        }
        this.player = dashjs.MediaPlayer().create();
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer video'), event.detail.url, event.detail.autoPlay == 'true');
        this.controlbar = new ControlBar(this.player);
        this.controlbar.initialize();
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
        var toSend = {
          event: event.detail.name,
          return: returnValue,
        };
        this.playerResponseHandler(toSend);
    }
  }

  @Event({
    composed: true,
    bubbles: true,
  })
  playerResponse: EventEmitter<any>;

  playerResponseHandler(todo: any) {
    this.playerResponse.emit(todo);
  }

  @Listen('settingsUpdated', { target: 'document' })
  settingsUpdate(event) {
    console.log('Received the updated settings: ', event.detail);

    this.player?.updateSettings({
      debug: event?.detail?.debug,
      streaming: event?.detail?.streaming,
    });
  }

  @Prop() streamUrl: string;
  @State() currentUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
  // @State() isPaused: boolean;

  @Event() streamMetricsEvent: EventEmitter<Object>;

  streamMetricsEventHandler(player: any) {
    player && this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    // this.isPaused = this.player.isPaused();

    this.loadOrUpdateDashJsScript();
    // this.player = dashjs.MediaPlayer().create();
    // this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), this.url, this.autoPlay);
    // this.controlbar = new ControlBar(this.player);
    // console.log('controlbar', this.controlbar);
    // this.controlbar.initialize();
  }

  private loadOrUpdateDashJsScript() {
    if (this.version == undefined) {
      return;
    }
    if (this.player) {
      this.player.reset();
    }
    const id = 'dashjssource';
    var previousScript = document.getElementById(id);
    if (previousScript) {
      previousScript.remove();
    }
    var script = document.createElement('script');
    script.id = id;
    script.onload = () => {};
    script.src = `https://cdn.dashjs.org/${this.version}/dash.all.${this.type}.js`;

    document.head.appendChild(script);

    // Akamai Controlbar script load
    var scriptAkamai = document.createElement('script');
    scriptAkamai.onload = () => {};
    scriptAkamai.src = `https://reference.dashif.org/dash.js/latest/contrib/akamai/controlbar/ControlBar.js`;

    document.body.appendChild(scriptAkamai);
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
            <div class="myMainVideoPlayer" id="myMainVideoPlayer">
              <video id="myMainVideoPlayer"></video>
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
            </div>
            {/* <video controls={true} id="myMainVideoPlayer"></video> */}
          </ion-card>
        </slot>
      </Host>
    );
  }
}
