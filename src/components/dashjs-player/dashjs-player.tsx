import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass, MediaPlayerSettingClass } from 'dashjs';
import ControlBar from './ControlBar.js';
import { LocalVariableStore } from '../../utils/localStorage';
import { DASHJS_PLAYER_TYPE, DASHJS_PLAYER_VERSION } from '../../defaults.js';
declare const dashjs: any;
/**
 * Loads dashjs player.
 * It makes use of dashjs cdn to load the script
 */
@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.scss',
  assetsDirs: ['assets'],
  shadow: false,
})
export class DashjsPlayer {
  @Element() private element: HTMLDashjsPlayerElement;
  private player: MediaPlayerClass;

  /**
   * The Version of dashjs that should be loaded.
   * e.g. v3.2.0
   */
  @Prop() version: string = DASHJS_PLAYER_VERSION;
  @Watch('version')
  protected watchHandlerVersion(): void {
    this.loadOrUpdateDashJsScript();
  }
  /**
   * The Type of dashjs that should be loaded.
   * e.g. debug or min
   */
  @Prop() type: string = DASHJS_PLAYER_TYPE;
  @Watch('type')
  protected watchHandlerType(): void {
    this.loadOrUpdateDashJsScript();
  }
  /**
   * The Settings of dashjs that should be used.
   * e.g. v3.2.0
   */
  @Prop() settings: MediaPlayerSettingClass = {};
  @Watch('settings')
  protected watchHandlerSettings(): void {
    if (this.player != undefined) {
      this.player.updateSettings(this.settings);
    }
  }

  @State() error = false;

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
      case 'load': {
        if (this.player) {
          this.player.reset();
        }
        this.player = dashjs.MediaPlayer().create();
        this.player.updateSettings(this.settings);
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer video') as HTMLElement, LocalVariableStore.mediaUrl, event.detail.autoPlay == 'true');
        this.controlbar = new ControlBar(this.player);
        this.controlbar.initialize();
        this.streamInterval = setInterval(() => {
          this.streamMetricsEventHandler(this.player);
        }, 1000);
        break;
      }
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
    this.loadOrUpdateDashJsScript(LocalVariableStore.api_autostart);
  }

  private loadOrUpdateDashJsScript(autoPlay: boolean = false) {
    if (this.version == undefined) {
      return;
    }
    if (this.player) {
      this.player.reset();
    }
    const id_string = 'dashjssource';
    const versionAttribute_string = 'data-version';
    const typeAttribute_string = 'data-type';
    const previousScript = document.getElementById(id_string);
    let newScriptShouldBeLoaded = true;
    if (previousScript != null) {
      const previousVersion = previousScript.getAttribute(versionAttribute_string);
      const previousType = previousScript.getAttribute(typeAttribute_string);
      newScriptShouldBeLoaded = previousVersion != this.version || previousType != this.type;
    }

    if (newScriptShouldBeLoaded) {
      if (previousScript != null) {
        previousScript.remove();
      }

      const script = document.createElement('script');
      script.id = id_string;
      script.setAttribute(versionAttribute_string, this.version);
      script.setAttribute(typeAttribute_string, this.type);
      script.onload = () => {
        this.playerEvent.emit({ type: 'load', url: LocalVariableStore.mediaUrl, autoPlay: autoPlay });
      };
      script.src = `https://cdn.dashjs.org/${this.version}/dash.all.${this.type}.js`;

      document.head.appendChild(script);
    } else {
      if (typeof dashjs != 'undefined') {
        this.playerEvent.emit({ type: 'load', url: LocalVariableStore.mediaUrl, autoPlay: autoPlay });
      }
    }
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
                <input type="range" id="volumebar" class="volumebar" min="0" max="1" step=".01" value="1" />
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
                  <input type="range" id="seekbar" class="seekbar" min="0" step="0.01" value="0" />
                </div>
              </div>
            </div>
          </div>
        </slot>
      </Host>
    );
  }
}
