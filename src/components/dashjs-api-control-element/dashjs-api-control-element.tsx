import { Component, EventEmitter, h, Prop, Event, State } from '@stencil/core';
import { Type, MediaType } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-element',
  styleUrl: 'dashjs-api-control-element.css',
  shadow: true,
})
export class DashjsAPIControlElement {
  /**
   * The displayed name of the control element.
   */
  @Prop() name: string;
  @Prop() options: string[];
  @Prop() type: Type;
  @Event()
  valueChanged: EventEmitter<any>;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @State() functionValue: any = [''];

  private setValue(counter: number, val: any): void {
    this.functionValue[counter] = val;
  }

  render() {
    const control = [];
    if (this.param.length > 0) {
      for (let i = 0; i < this.param.length; i++) {
        const index = i;
        switch (this.param[i].type) {
          case 'string':
            control.push(<ion-input class="input-border" debounce={300} value={''} onIonChange={change => this.setValue(index, change.detail.value)}></ion-input>);
            control.push(<div class="gap"></div>);
            break;
          case 'number':
            control.push(
              <ion-input class="input-border" debounce={300} type="number" value={0} onIonChange={change => this.setValue(index, Number(change.detail.value))}></ion-input>,
            );
            control.push(<div class="gap"></div>);
            break;
          case 'boolean':
            control.push(<ion-toggle onIonChange={change => this.setValue(index, change.detail.checked)}></ion-toggle>);
            control.push(<div class="gap"></div>);
            break;
          case 'MediaType':
            control.push(
              <ion-select class="input-border" placeholder="Select MediaType" interface="popover" onIonChange={change => this.setValue(index, change.detail.value)}>
                {Object.keys(MediaType).map(val => (
                  <ion-select-option value={MediaType[val]}>{MediaType[val]}</ion-select-option>
                ))}
              </ion-select>,
            );
            control.push(<div class="gap"></div>);
            break;
        }
      }
    }
    control.push(
      <ion-button shape="round" size="small" onClick={() => this.valueChanged.emit(this.functionValue)}>
        Call
      </ion-button>,
    );

    return (
      <ion-grid>
        <ion-row>
          <ion-col class="middle">{this.name}</ion-col>
          <ion-col size="auto">
            <ion-item lines="none">{control}</ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
