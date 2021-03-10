import { Component, h, EventEmitter, Event, Prop } from '@stencil/core';

@Component({
  tag: 'dashjs-api-link-selector',
  styleUrl: 'dashjs-api-link-selector.css',
  shadow: false,
})
export class PagePopover {
  /**
   * List of all links
   */
  @Prop() sourceList: any[];

  /**
   * Emits the selected media url to the api control component
   */
  @Event({ composed: true, bubbles: true, }) setStream: EventEmitter<string>;

  setStreamHandler(todo: string): void{
    this.setStream.emit(todo);
  }

  render() {
    return (
      <ion-list>
        {this.sourceList.map(item => (
          <ion-item>
            <ion-label>{item.name}</ion-label>
            <ion-select interface="action-sheet" selectedText=" " onIonChange={ev => this.setStreamHandler(ev.detail.value)}>
              {item.submenu.map(eve => (
                <ion-select-option value={eve.url}>{eve.name}</ion-select-option>
              ))}
            </ion-select>
          </ion-item>
        ))}
        ;
      </ion-list>
    );
  }
}
