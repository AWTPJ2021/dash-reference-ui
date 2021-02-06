import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
declare var dashjs: any;

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
  @Watch('url')
  protected watchHandlerUrl(newUrl: string): void {
    console.log('Changed value: ' + newUrl);
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), newUrl, this.autoPlay);
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
        this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), event.detail.url, event.detail.autoPlay == 'true');
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

  @Prop() streamUrl: string;
  @State() currentUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
  // @State() isPaused: boolean;

  @Event() streamMetricsEvent: EventEmitter<Object>;

  streamMetricsEventHandler(player: any) {
    this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    this.loadOrUpdateDashJsScript();
    // this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), this.url, this.autoPlay);
    // this.isPaused = this.player.isPaused();
    //let url = this.currentUrl;
    //let player = MediaPlayer().create();
    //player.initialize(this.element.shadowRoot.querySelector('#myMainVideoPlayer'), url, true);
  }

  private loadOrUpdateDashJsScript() {
    debugger;
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
            <video controls={true} id="myMainVideoPlayer"></video>
          </ion-card>
        </slot>
      </Host>
    );
  }
}
