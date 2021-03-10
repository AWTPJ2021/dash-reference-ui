import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter, Method } from '@stencil/core';
import { MediaPlayerClass, MediaPlayerSettingClass } from 'dashjs';
import ControlBar from './ControlBar.js';
import { calculateHTTPMetrics } from '../../utils/metrics';
import { LocalVariableStore } from '../../utils/localStorage';
import { DASHJS_PLAYER_TYPE, DASHJS_PLAYER_VERSION } from '../../defaults.js';
import { Metrics } from '../../types/types';
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
  metrics = {
    video: {
      'Buffer Length': 0,
      'Bitrate Downloading': 0,
      'Dropped Frames': 0,
      'Frame Rate': 0,
      'Index': 0,
      'Max Index': 0,
      'Live Latency': 0,
      'Latency': '0|0|0',
      'Download': '0|0|0',
      'Ratio': '0|0|0',
    },
    audio: {
      'Buffer Length': 0,
      'Bitrate Downloading': 0,
      'Dropped Frames': 0,
      'Max Index': 0,
      'Latency': '0|0|0',
      'Download': '0|0|0',
      'Ratio': '0|0|0',
    },
    currentTime: '00:00',
  };

  @State()
  controlbar: any;

  /**
   * Request Video to be played in Picture in Picture Mode
   */
  @Method()
  async showPiP(): Promise<void> {
    (this.element.querySelector('#myMainVideoPlayer video') as any).requestPictureInPicture();
  }
  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event): void {
    switch (event.detail.type) {
      case 'load': {
        if (this.player != undefined) {
          this.player.reset();
        }
        this.player = dashjs.MediaPlayer().create();
        this.player.updateSettings(this.settings);
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer video') as HTMLElement, LocalVariableStore.mediaUrl, event.detail.autoPlay == 'true');
        this.controlbar = new ControlBar(this.player);
        this.controlbar.initialize();
        this.streamInterval && clearInterval(this.streamInterval);
        this.streamInterval = setInterval(() => {
          this.metricsWatch();
        }, 1000);
        break;
      }
      case 'stop':
        this.player.reset();
        clearInterval(this.streamInterval);
        break;
      case 'function':
        if (this.player === undefined) {
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

  /**
   * Player response:
   * player api calls repsonse
   */
  @Event({
    composed: true,
    bubbles: true,
  })
  playerResponse: EventEmitter<any>;

  private playerResponseHandler(todo: any) {
    this.playerResponse.emit(todo);
  }

  @Listen('settingsUpdated', { target: 'document' })
  settingsUpdate(event): void {
    this.player?.updateSettings({
      debug: event?.detail?.debug,
      streaming: event?.detail?.streaming,
    });
  }

  /**
   * Stream metrics:
   * dashMetrcis & dashAdapter calculations
   */
  @Event()
  metricsEvent: EventEmitter<Metrics>;

  private metricsWatch() {
    this.player && this.metricsEvent.emit(this.streamMetrics(this.player, this.metrics));
  }

  private streamMetrics(player: any, metrics: Metrics) {
    const streamInfo = player?.getActiveStream()?.getStreamInfo();
    const dashMetrics = player?.getDashMetrics();
    const dashAdapter = player?.getDashAdapter();

    if (dashMetrics && streamInfo) {
      const periodIdx = streamInfo?.index;
      const currentTimeInSec = Number(player?.time().toFixed(0));

      const currentTime = new Date(currentTimeInSec * 1000).toISOString().substr(11, 8);
      metrics.currentTime = currentTime;
      metrics.video['Live Latency'] = Number(
        setTimeout(() => {
          player?.getCurrentLiveLatency();
        }, 1000),
      );

      // Video Metrics
      const videoRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('video');
      const videoAdaptation = dashAdapter?.getAdaptationForType(periodIdx, 'video', streamInfo);
      const videoHttpMetrics = calculateHTTPMetrics('video', dashMetrics?.getHttpRequests('video'));

      metrics.video['Buffer Length'] = dashMetrics?.getCurrentBufferLevel('video');
      metrics.video['Dropped Frames'] = dashMetrics?.getCurrentDroppedFrames('video')?.droppedFrames;
      metrics.video['Bitrate Downloading'] = videoRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(videoRepSwitch?.to, periodIdx) / 1000) : NaN;
      metrics.video['Index'] = dashAdapter?.getIndexForRepresentation(videoRepSwitch?.to, periodIdx);
      metrics.video['Max Index'] = dashAdapter?.getMaxIndexForBufferType('video', periodIdx);
      metrics.video['Frame Rate'] = videoAdaptation?.Representation_asArray?.find(function (rep) {
        return rep.id === videoRepSwitch?.to;
      })?.frameRate;
      if (videoHttpMetrics != undefined) {
        metrics.video['Download'] =
          videoHttpMetrics.download['video'].low.toFixed(2) +
          ' | ' +
          videoHttpMetrics.download['video'].average.toFixed(2) +
          ' | ' +
          videoHttpMetrics.download['video'].high.toFixed(2);
        metrics.video['Latency'] =
          videoHttpMetrics.latency['video'].low.toFixed(2) +
          ' | ' +
          videoHttpMetrics.latency['video'].average.toFixed(2) +
          ' | ' +
          videoHttpMetrics.latency['video'].high.toFixed(2);
        metrics.video['Ratio'] =
          videoHttpMetrics.ratio['video'].low.toFixed(2) + ' | ' + videoHttpMetrics.ratio['video'].average.toFixed(2) + ' | ' + videoHttpMetrics.ratio['video'].high.toFixed(2);
      }

      // Audio Metrics
      const audioRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('audio');
      const audioHttpMetrics = calculateHTTPMetrics('audio', dashMetrics?.getHttpRequests('audio'));

      metrics.audio['Buffer Length'] = dashMetrics?.getCurrentBufferLevel('audio');
      metrics.audio['Dropped Frames'] = dashMetrics?.getCurrentDroppedFrames('audio')?.droppedFrames;
      metrics.audio['Bitrate Downloading'] = audioRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(audioRepSwitch?.to, periodIdx) / 1000) : NaN;

      metrics.audio['Max Index'] = dashAdapter?.getMaxIndexForBufferType('audio', periodIdx);
      if (audioHttpMetrics != undefined) {
        metrics.audio['Download'] =
          audioHttpMetrics.download['audio'].low.toFixed(2) +
          ' | ' +
          audioHttpMetrics.download['audio'].average.toFixed(2) +
          ' | ' +
          audioHttpMetrics.download['audio'].high.toFixed(2);
        metrics.audio['Latency'] =
          audioHttpMetrics.latency['audio'].low.toFixed(2) +
          ' | ' +
          audioHttpMetrics.latency['audio'].average.toFixed(2) +
          ' | ' +
          audioHttpMetrics.latency['audio'].high.toFixed(2);
        metrics.audio['Ratio'] =
          audioHttpMetrics.ratio['audio'].low.toFixed(2) + ' | ' + audioHttpMetrics.ratio['audio'].average.toFixed(2) + ' | ' + audioHttpMetrics.ratio['audio'].high.toFixed(2);
      }
    }
    return metrics;
  }

  componentDidLoad() {
    this.loadOrUpdateDashJsScript(LocalVariableStore.api_autostart);
  }

  private loadOrUpdateDashJsScript(autoPlay: boolean = false) {
    if (this.version == undefined) {
      return;
    }
    if (this.player != undefined) {
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
        this.playerEventHandler({ detail: { type: 'load', url: LocalVariableStore.mediaUrl, autoPlay: autoPlay } });
      };
      script.src = `https://cdn.dashjs.org/${this.version}/dash.all.${this.type}.js`;

      document.head.appendChild(script);
    } else {
      if (typeof dashjs != 'undefined') {
        this.playerEventHandler({ detail: { type: 'load', url: LocalVariableStore.mediaUrl, autoPlay: autoPlay } });
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
