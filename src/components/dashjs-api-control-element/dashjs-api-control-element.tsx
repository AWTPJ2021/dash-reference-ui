import { Component, EventEmitter, h, Prop, Event, State } from '@stencil/core';
import { Type } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-element',
  styleUrl: 'dashjs-api-control-element.css',
  shadow: true,
})
export class DashjsAPIControlElement {
  @Prop() name: string;
  @Prop() options: string[];
  @Prop() type: Type;
  @Prop() defaultValue: any;
  @Event() valueChanged: EventEmitter<any>;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @State() control = (<div>No known type!</div>);

  @State() functionValue : any;

  setValue(val) {
    this.functionValue = val;
  }

  componentWillLoad() {
    if (this.options != undefined) {
      this.control = [
        <ion-select placeholder="Select One" interface="popover" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}>
          {this.options.map(val => (
            <ion-select-option value={val}>{val}</ion-select-option>
          ))}
        </ion-select>,
        // <ion-label position="floating">{this.name}</ion-label>,
        // <ion-select placeholder="Select One" interface="popover" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}>
        //   {this.options.map(val => (
        //     <ion-select-option value={val}>{val}</ion-select-option>
        //   ))}
        // </ion-select>,
      ];
    } else if (this.param.length < 1) {
      this.control = [
        <ion-item lines="none"><ion-button shape="round" size="small" onClick={ () => this.valueChanged.emit("")}>Call</ion-button></ion-item>
      ];
    } else if (this.param.length === 1) {
      switch (this.param[0].type) {
        case "string":
          this.control = [
          <ion-item lines="none"><ion-input debounce={300} value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-input>
          <div class="gap"></div><ion-button size="small" class="left_gap" shape="round" onClick={ () => this.valueChanged.emit("")}>Call</ion-button></ion-item>
        ];
          break;
        case "number":
          this.control = [
            <ion-item lines="none"><ion-input debounce={300} type="number" value={this.defaultValue} onIonChange={change => this.setValue(change.detail.value)}></ion-input>
            <div class="gap"></div><ion-button size="small" shape="round" onClick={ () => this.valueChanged.emit(this.functionValue)}>Call</ion-button></ion-item>
            // <ion-range min={20} max={80} step={2}>
            //   <ion-icon size="small" slot="start" name="sunny"></ion-icon>
            //   <ion-icon slot="end" name="sunny"></ion-icon>
            // </ion-range>
          ];
          break;
        case "boolean":
          this.control = [
          <ion-item lines="none"><ion-toggle value={this.defaultValue} onIonChange={change => this.setValue(change.detail.checked)}></ion-toggle>
          <ion-button size="small" shape="round" onClick={ () => this.valueChanged.emit(this.functionValue)}>Call</ion-button></ion-item>
          ];
          break;
      }
    }
  }
  render() {
    return (
      <ion-grid>
        <ion-row>
          <ion-col class="middle">{this.name}</ion-col>
          <ion-col size="auto">{this.control}</ion-col>
        </ion-row>
      </ion-grid>
    );
    // return this.control;
    // return <ion-item lines="none">{this.control}</ion-item>;
    // return (
    //   <Host>
    //     <ion-list>
    //       <ion-item>
    //         <ion-label>Radio</ion-label>
    //         <ion-radio slot="end"></ion-radio>
    //       </ion-item>
    //       <ion-item>
    //         <ion-label>Checkbox</ion-label>
    //         <ion-checkbox slot="start"></ion-checkbox>
    //       </ion-item>
    //       <ion-item>
    //         <ion-segment /*onIonChange={ev => this.segmentChanged(ev)} */>
    //           <ion-segment-button value="friends">
    //             <ion-label>Friends</ion-label>
    //           </ion-segment-button>
    //           <ion-segment-button value="enemies">
    //             <ion-label>Enemies</ion-label>
    //           </ion-segment-button>
    //         </ion-segment>
    //       </ion-item>

    //       <ion-item>
    //         <ion-range min={20} max={80} step={2}>
    //           <ion-icon size="small" slot="start" name="sunny"></ion-icon>
    //           <ion-icon slot="end" name="sunny"></ion-icon>
    //         </ion-range>
    //       </ion-item>
    //     </ion-list>
    //   </Host>
    // );
  }
}
