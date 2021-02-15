import { Component, Host, h, Element, State, Prop, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { MediaPlayerClass } from 'dashjs';
import { getMediaURL,  getStringLocally } from '../../utils/utils';
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

  @State() streamInterval: any;

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
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
      case 'function':
        var returnValue = this.player[event.detail.name](event.detail.param);
        var toSend = {
          "event": event.detail.name,
          "return": returnValue
        }
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
    this.player?.updateSettings({
      debug: event?.detail?.debug,
      streaming: event?.detail?.streaming,
    });
  }

  @Event() streamMetricsEvent: EventEmitter<Object>;

  streamMetricsEventHandler(player: any) {
    this.streamMetricsEvent.emit(player);
  }

  componentDidLoad() {
    this.loadOrUpdateDashJsScript();
    this.player = dashjs.MediaPlayer().create();
    this.player.initialize(this.element.querySelector('#myMainVideoPlayer'), getMediaURL(), getStringLocally('api_autostart') == 'true');
    this.streamInterval = setInterval(() => {
      this.streamMetricsEventHandler(this.player);
    }, 1000);
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
