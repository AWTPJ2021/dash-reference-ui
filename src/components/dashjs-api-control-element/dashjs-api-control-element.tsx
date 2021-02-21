import { Component, EventEmitter, h, Prop, Event, State } from '@stencil/core';
import { Type, MediaType } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-element',
  styleUrl: 'dashjs-api-control-element.css',
  shadow: true,
})
export class DashjsAPIControlElement {
  @Prop() name: string;
  @Prop() options: string[];
  @Prop() type: Type;
  @Event() valueChanged: EventEmitter<any>;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @State() control = [];

  @State() functionValue : any = "";

  setValue(counter : number, val : any) {
    if(counter > 0) {
      if(!Array.isArray(this.functionValue)) {
        const oldValue = this.functionValue;
        this.functionValue = [];
        this.functionValue[0] = oldValue;
      }
      this.functionValue[counter] = val;
    } else {
      Array.isArray(this.functionValue) ? this.functionValue[0] = val  : this.functionValue = val;
    }
  }

  updateControl() {
    this.control = [];
    if (this.param.length > 0) {
      for(var i = 0; i<this.param.length; i++) {
        const index = i;
        switch (this.param[i].type) {
          case "string":
            this.control.push(<ion-input class="input-border" debounce={300} value={""} onIonChange={change => this.setValue(index, change.detail.value)}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case "number":
            this.control.push(<ion-input class="input-border" debounce={300} type="number" value={0} onIonChange={change => this.setValue(index, Number(change.detail.value))}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case "boolean":
            this.control.push(<ion-toggle onIonChange={change => this.setValue(index, change.detail.checked)}></ion-toggle>)
            this.control.push(<div class="gap"></div>);
            break;
          case "MediaType": 
            this.control.push(
            <ion-select class="input-border" placeholder="Select MediaType" interface="popover" onIonChange={change => this.setValue(index, change.detail.value)}>
            {Object.keys(MediaType).map(val => (
              <ion-select-option value={MediaType[val]}>{MediaType[val]}</ion-select-option>
            ))}
            </ion-select>
            );
            this.control.push(<div class="gap"></div>);
            break;
        }
      }
    }
    this.control.push(<ion-button shape="round" size="small" onClick={ () => this.valueChanged.emit(this.functionValue)}>Call</ion-button>);
  }

  render() {
    this.updateControl();

    return (
      <ion-grid>
        <ion-row>
          <ion-col class="middle">{this.name}</ion-col>
          <ion-col size="auto"><ion-item lines="none">{this.control}</ion-item></ion-col>
        </ion-row>
      </ion-grid>
    );
  }
}
