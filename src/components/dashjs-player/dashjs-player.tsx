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

  // @State() streamInfo;
  // @State() dashMetrics;
  // @State() dashAdapter;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        console.log('Re-initializing the player:\n' + JSON.stringify(event.detail));
        this.player.reset();
        this.player = MediaPlayer().create();
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), event.detail.url, event.detail.autoPlay == 'true');
        setInterval(() => {
          this.streamMetrics(this.player);
        }, 2000);
        break;
      case 'stop':
        console.log('Resetting the player');
        this.player.reset();
        this.player.on(MediaPlayer.events['PLAYBACK_ENDED'], function () {
          clearInterval(this.streamMetrics(this.player));
        });
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
    this.player.on(MediaPlayer.events['PLAYBACK_ENDED'], function () {
      clearInterval(this.streamMetrics);
    });
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

  streamMetrics(player: any) {
    const streamInfo = player.getActiveStream().getStreamInfo();
    const dashMetrics = player.getDashMetrics();
    const dashAdapter = player.getDashAdapter();

    if (dashMetrics && streamInfo) {
      const periodIdx = streamInfo.index;
      let latency = setTimeout(() => {
        player.getCurrentLiveLatency();
      }, 2000);

      // Video Metrics
      let videoRepSwitch = dashMetrics.getCurrentRepresentationSwitch('video', true);
      let videoBufferLevel = dashMetrics.getCurrentBufferLevel('video', true);
      let videoBufferLength = player.getBufferLength('video');
      let videoDroppedFrames = dashMetrics.getCurrentDroppedFrames('video', true).droppedFrames;
      let videoBitrate = videoRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(videoRepSwitch.to, periodIdx) / 1000) : NaN;
      let videoAdaptation = dashAdapter.getAdaptationForType(periodIdx, 'video', streamInfo);
      let videoFrameRate = videoAdaptation.Representation_asArray.find(function (rep) {
        return rep.id === videoRepSwitch.to;
      }).frameRate;

      // Audio Metrics
      let audioRepSwitch = dashMetrics.getCurrentRepresentationSwitch('audio', true);
      let audioBufferLevel = dashMetrics.getCurrentBufferLevel('audio', true);
      let audioBufferLength = player.getBufferLength('audio');
      let audioDroppedFrames = dashMetrics.getCurrentDroppedFrames('audio', true).droppedFrames;
      let audioBitrate = audioRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(audioRepSwitch.to, periodIdx) / 1000) : NaN;

      // console.log('audioRepSwitch', audioRepSwitch);
      // console.log('audioBufferLevel', audioBufferLevel);
      // console.log('audioDroppedFrames', audioDroppedFrames);
      // console.log('audioBitrate', audioBitrate);
      // console.log('audioBufferLength', audioBufferLength);
      // console.log('videoBufferLength', videoBufferLength);
      // console.log('latency', latency);
    }
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
