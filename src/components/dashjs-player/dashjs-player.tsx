import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
import { getMediaURL, getStringLocally } from '../../utils/utils';
declare let dashjs: any;
/**
 * Loads dashjs player.
 * It makes use of dashjs cdn to load the script
 */
@Component({
  tag: 'dashjs-player',
  styleUrl: 'dashjs-player.css',
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

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        if (this.player) {
          this.player.reset();
        }
        this.initPlayer(event.detail.autoPlay == 'true');
        break;
      case 'stop':
        this.player.reset();
        clearInterval(this.streamInterval);
        break;
      case 'function':
        if (!this.player) {
          this.playerResponseHandler({ event: event.detail.name, return: null });
        } else {
          var returnValue = this.player[event.detail.name].apply(this, event.detail.param);
          var toSend = {
            event: event.detail.name,
            return: returnValue
          }
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
    this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    this.loadOrUpdateDashJsScript(getStringLocally('api_autostart') == 'true');
  }

  private initPlayer(autoPlay: boolean = false): void {
    this.player = dashjs.MediaPlayer().create();
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), getMediaURL(), autoPlay);
    this.streamInterval = setInterval(() => {
      this.streamMetricsEventHandler(this.player);
    }, 1000);
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
      this.initPlayer(autoPlay);
    };
    script.src = `https://cdn.dashjs.org/${this.version}/dash.all.${this.type}.js`;

    document.head.appendChild(script);
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
