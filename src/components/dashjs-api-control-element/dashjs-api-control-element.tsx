import { Component, EventEmitter, h, Prop, Event, State } from '@stencil/core';
import { Type } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-element',
  styleUrl: 'dashjs-api-control-element.css',
  shadow: true,
})
export class DashjsAPIControlElement {
  @Prop() name: string;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @Event() valueChanged: EventEmitter<any>;

  @State() functionValue : any;

  setValue(val) {
    this.functionValue = val;
  }

  render() {
    if (this.param.length < 1) {
      return (
        <ion-item>
          <ion-button shape="round" onClick={ () => this.valueChanged.emit("")}>{this.name}</ion-button>
          <ion-label id={this.name}></ion-label>
        </ion-item>
      );
    } else if (this.paramDesc[0].type.names[0] == Type.string) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-input onIonChange={change => this.setValue(change.detail.value)} type="text"></ion-input>
          <ion-button shape="round" onClick={() => this.valueChanged.emit(this.functionValue)}>Call</ion-button>
        </ion-item>
      );
    } else if (this.paramDesc[0].type.names[0] == Type.number) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-input onIonChange={change => this.setValue(change.detail.value)} type="number"></ion-input>
          <ion-button shape="round" onClick={() => this.valueChanged.emit(parseFloat(this.functionValue))}>Call</ion-button>
        </ion-item>
      );
    } else if (this.paramDesc[0].type.names[0] == Type.boolean) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-toggle slot="end" onIonChange={change => this.valueChanged.emit(change.detail.checked)}></ion-toggle>
        </ion-item>
      );
    } else {
      return <div>No known type!</div>;
    }
  }
}
