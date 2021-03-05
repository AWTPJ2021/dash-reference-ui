import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
import ControlBar from './ControlBar.js';
import { getMediaURL, getStringLocally, calculateHTTPMetrics } from '../../utils/utils';
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
  metrics = {
    video: {
      'Buffer Length': [0, 0, 0, 0, 0, 0, 0, 0],
      'Bitrate Downloading': [0, 0, 0, 0, 0, 0, 0, 0],
      'Dropped Frames': [0, 0, 0, 0, 0, 0, 0, 0],
      'Frame Rate': [0, 0, 0, 0, 0, 0, 0, 0],
      'Index': [0, 0, 0, 0, 0, 0, 0, 0],
      'Max Index': [0, 0, 0, 0, 0, 0, 0, 0],
      'Live Latency': [0, 0, 0, 0, 0, 0, 0, 0],
      'Latency': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
      'Download': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
      'Ratio': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
    },
    audio: {
      'Buffer Length': [0, 0, 0, 0, 0, 0, 0, 0],
      'Bitrate Downloading': [0, 0, 0, 0, 0, 0, 0, 0],
      'Dropped Frames': [0, 0, 0, 0, 0, 0, 0, 0],
      'Max Index': [0, 0, 0, 0, 0, 0, 0, 0],
      'Latency': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
      'Download': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
      'Ratio': ['0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0', '0|0|0'],
    },
    currentTime: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'],
  };

  @State()
  controlbar: any;

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
        this.streamInterval && clearInterval(this.streamInterval);
        this.streamInterval = setInterval(() => {
          this.metricsWatch();
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

  /* Stream Metrics */
  @Event()
  metricsEvent: EventEmitter<string>;

  private metricsWatch() {
    this.player && this.metricsEvent.emit(this.streamMetrics(this.player, this.metrics));
  }

  private streamMetrics(player: any, metrics: any) {
    const streamInfo = player?.getActiveStream()?.getStreamInfo();
    const dashMetrics = player?.getDashMetrics();
    const dashAdapter = player?.getDashAdapter();

    if (dashMetrics && streamInfo) {
      const periodIdx = streamInfo?.index;
      const currentTimeInSec = player?.time().toFixed(0);

      const currentTime = new Date(currentTimeInSec * 1000).toISOString().substr(11, 8);
      metrics.currentTime.shift();
      metrics.currentTime.push(currentTime);
      metrics.video['Live Latency'].shift();
      metrics.video['Live Latency'].push(
        Number(
          setTimeout(() => {
            player?.getCurrentLiveLatency();
          }, 1000),
        ),
      );

      // Video Metrics
      const videoRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('video');
      const videoAdaptation = dashAdapter?.getAdaptationForType(periodIdx, 'video', streamInfo);
      const videoHttpMetrics = calculateHTTPMetrics('video', dashMetrics?.getHttpRequests('video'));

      metrics.video['Buffer Length'].shift();
      metrics.video['Buffer Length'].push(dashMetrics?.getCurrentBufferLevel('video'));
      metrics.video['Dropped Frames'].shift();
      metrics.video['Dropped Frames'].push(dashMetrics?.getCurrentDroppedFrames('video')?.droppedFrames);
      metrics.video['Bitrate Downloading'].shift();
      metrics.video['Bitrate Downloading'].push(videoRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(videoRepSwitch?.to, periodIdx) / 1000) : NaN);
      metrics.video['Index'].shift();
      metrics.video['Index'].push(dashAdapter?.getIndexForRepresentation(videoRepSwitch?.to, periodIdx));
      metrics.video['Max Index'].shift();
      metrics.video['Max Index'].push(dashAdapter?.getMaxIndexForBufferType('video', periodIdx));
      metrics.video['Frame Rate'].shift();
      metrics.video['Frame Rate'].push(
        videoAdaptation?.Representation_asArray?.find(function (rep) {
          return rep.id === videoRepSwitch?.to;
        })?.frameRate,
      );
      if (videoHttpMetrics) {
        metrics.video['Download'].shift();
        metrics.video['Download'].push(
          videoHttpMetrics.download['video'].low.toFixed(2) +
            ' | ' +
            videoHttpMetrics.download['video'].average.toFixed(2) +
            ' | ' +
            videoHttpMetrics.download['video'].high.toFixed(2),
        );
        metrics.video['Latency'].shift();
        metrics.video['Latency'].push(
          videoHttpMetrics.latency['video'].low.toFixed(2) +
            ' | ' +
            videoHttpMetrics.latency['video'].average.toFixed(2) +
            ' | ' +
            videoHttpMetrics.latency['video'].high.toFixed(2),
        );
        metrics.video['Ratio'].shift();
        metrics.video['Ratio'].push(
          videoHttpMetrics.ratio['video'].low.toFixed(2) + ' | ' + videoHttpMetrics.ratio['video'].average.toFixed(2) + ' | ' + videoHttpMetrics.ratio['video'].high.toFixed(2),
        );
      }

      // Audio Metrics
      const audioRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('audio');
      const audioHttpMetrics = calculateHTTPMetrics('audio', dashMetrics?.getHttpRequests('audio'));

      metrics.audio['Buffer Length'].shift();
      metrics.audio['Buffer Length'].push(dashMetrics?.getCurrentBufferLevel('audio'));
      metrics.audio['Dropped Frames'].shift();
      metrics.audio['Dropped Frames'].push(dashMetrics?.getCurrentDroppedFrames('audio')?.droppedFrames);
      metrics.audio['Bitrate Downloading'].shift();
      metrics.audio['Bitrate Downloading'].push(audioRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(audioRepSwitch?.to, periodIdx) / 1000) : NaN);
      metrics.audio['Max Index'].shift();
      metrics.audio['Max Index'].push(dashAdapter?.getMaxIndexForBufferType('audio', periodIdx));
      if (audioHttpMetrics) {
        metrics.audio['Download'].shift();
        metrics.audio['Download'].push(
          audioHttpMetrics.download['audio'].low.toFixed(2) +
            ' | ' +
            audioHttpMetrics.download['audio'].average.toFixed(2) +
            ' | ' +
            audioHttpMetrics.download['audio'].high.toFixed(2),
        );
        metrics.audio['Latency'].shift();
        metrics.audio['Latency'].push(
          audioHttpMetrics.latency['audio'].low.toFixed(2) +
            ' | ' +
            audioHttpMetrics.latency['audio'].average.toFixed(2) +
            ' | ' +
            audioHttpMetrics.latency['audio'].high.toFixed(2),
        );
        metrics.audio['Ratio'].shift();
        metrics.audio['Ratio'].push(
          audioHttpMetrics.ratio['audio'].low.toFixed(2) + ' | ' + audioHttpMetrics.ratio['audio'].average.toFixed(2) + ' | ' + audioHttpMetrics.ratio['audio'].high.toFixed(2),
        );
      }
    }
    return metrics;
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
