import { Component, h, State, EventEmitter, Event} from '@stencil/core';

@Component({
  tag: 'dashjs-api-link-selector',
  styleUrl: 'dashjs-api-link-selector.css',
  shadow: false,
})

export class PagePopover {
  @State() sourceList: any[] = [];
  @State() mediaUrl: string = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';

  componentWillLoad() {
    fetch('/static/sources.json')
      .then((response: Response) => response.json())
      .then(response => {
        this.sourceList = response.items;
        console.log('Here is the source: ' + this.sourceList.length);
      });
  }

  setStreamUrl(url) {
    this.mediaUrl = url;
  }

  @Event({
    composed: true,
    bubbles: true,
  })
  setStream: EventEmitter<String>;

  setStreamHandler(todo: any) {
    this.setStream.emit(todo);    
  }

  render() {
    return [
      <ion-list>
        {this.sourceList.map(item => 
          <ion-item><ion-label>{item.name}</ion-label>
            <ion-select interface="action-sheet" selectedText=" " onIonChange={ev => this.setStreamHandler(ev.detail.value)}>
            {item.submenu.map(eve => <ion-select-option value={eve.url}>{eve.name}</ion-select-option>)}
            </ion-select>
          </ion-item>
        )};
      </ion-list>
    ];
  }
}
