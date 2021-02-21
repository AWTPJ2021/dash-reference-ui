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
  @State() control = [];

  @State() functionValue: any = '';

  setValue(val) {
    this.functionValue = val;
  }

  updateControl() {
    this.control = [];
    if (this.param.length > 0) {
      for (let i = 0; i < this.param.length; i++) {
        switch (this.param[i].type) {
          case 'string':
            this.control.push(<ion-input class="input-border" debounce={300} value={''} onIonChange={change => this.setValue(change.detail.value)}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case 'number':
            this.control.push(<ion-input class="input-border" debounce={300} type="number" value={0} onIonChange={change => this.setValue(change.detail.value)}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case 'boolean':
            this.control.push(<ion-toggle onIonChange={change => this.setValue(change.detail.checked)}></ion-toggle>);
            this.control.push(<div class="gap"></div>);
            break;
          case 'MediaType':
            this.control.push(
              <ion-select class="input-border" placeholder="Select MediaType" interface="popover" onIonChange={change => this.setValue(change.detail.value)}>
                {Object.keys(MediaType).map(val => (
                  <ion-select-option value={MediaType[val]}>{MediaType[val]}</ion-select-option>
                ))}
              </ion-select>,
            );
            this.control.push(<div class="gap"></div>);
            break;
        }
      }
    }
  }

  render() {
    this.updateControl();

    return (
      <ion-grid>
        <ion-row>
          <ion-col class="middle">{this.name}</ion-col>
          <ion-col size="auto">
            <ion-item lines="none">
              {this.control}
              <ion-button shape="round" size="small" onClick={() => this.valueChanged.emit('')}>
                Call
              </ion-button>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
