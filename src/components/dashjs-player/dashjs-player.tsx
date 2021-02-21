import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
import ControlBar from './ControlBar.js';
import { getMediaURL, getStringLocally } from '../../utils/utils';
declare let dashjs: any;
/**
 * Loads dashjs player.
 * It makes use of dashjs cdn to load the script
 */
@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.scss',
  shadow: false,
})
export class DashjsPlayer {
  @Element() private element: HTMLDashjsPlayerElement;
  private player: MediaPlayerClass;

  /**
   * The Version of dashjs that should be loaded.
   * e.g. v3.2.0
   */
  @Prop() version: string = undefined;
  @Watch('version')
  protected watchHandlerVersion(): void {
    this.loadOrUpdateDashJsScript();
  }
  /**
   * The Type of dashjs that should be loaded.
   * e.g. debug or min
   */
  @Prop() type: string = undefined;
  @Watch('type')
  protected watchHandlerType(): void {
    this.loadOrUpdateDashJsScript();
  }

  @State() streamInterval: any;

  @State()
  controlbar: any;
  // TODO: Really Bad practice! Use a better flow to get updates to statistics
  @Event({
    composed: true,
    bubbles: true,
  })
  playerEvent: EventEmitter<any>;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        if (this.player) {
          this.player.reset();
        }
        this.player = dashjs.MediaPlayer().create();
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer video'), getMediaURL(), event.detail.autoPlay == 'true');
        this.controlbar = new ControlBar(this.player);
        this.controlbar.initialize();
        this.streamInterval = setInterval(() => {
          this.streamMetricsEventHandler(this.player);
        }, 1000);
        break;
      case 'stop':
        this.player.reset();
        clearInterval(this.streamInterval);
        break;
      case 'function':
        if (!this.player) {
          this.playerResponseHandler({ event: event.detail.name, return: null });
        } else {
          const returnValue = this.player[event.detail.name].apply(this, event.detail.param);
          const toSend = {
            event: event.detail.name,
            return: returnValue,
          };
          this.playerResponseHandler(toSend);
        }
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
    this.player?.updateSettings({
      debug: event?.detail?.debug,
      streaming: event?.detail?.streaming,
    });
  }

  @Event()
  streamMetricsEvent: EventEmitter<any>;

  streamMetricsEventHandler(player: any) {
    player && this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    this.loadOrUpdateDashJsScript();
    this.loadOrUpdateDashJsScript(getStringLocally('api_autostart') == 'true');
  }

  private loadOrUpdateDashJsScript(autoPlay: boolean = false) {
    if (this.version == undefined) {
      return;
    }
    if (this.player) {
      this.player.reset();
    }
    const id = 'dashjssource';
    const previousScript = document.getElementById(id);
    if (previousScript) {
      previousScript.remove();
    }
    const script = document.createElement('script');
    script.id = id;
    script.onload = () => {
      this.playerEvent.emit({ type: 'load', url: getMediaURL(), autoPlay: autoPlay });
    };
    script.src = `https://cdn.dashjs.org/${this.version}/dash.all.${this.type}.js`;

    document.head.appendChild(script);
  }

  render() {
    return (
      <Host>
        <slot>
          <div class="player-wrapper">
            <div class="myMainVideoPlayer" id="myMainVideoPlayer">
              <video id="myMainVideoPlayer" preload="auto"></video>
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
          </div>
        </slot>
      </Host>
    );
  }
}
