import { Component, EventEmitter, h, Prop, Event } from '@stencil/core';
import { Type } from '../../types/types';

@Component({
  tag: 'dashjs-settings-control-element',
  styleUrl: 'dashjs-settings-control-element.css',
  shadow: true,
})
export class DashjsSettingsControlElement {
  @Prop() name: string;
  @Prop() options: string[];
  @Prop() type: Type;
  @Prop() defaultValue: any;
  @Event() valueChanged: EventEmitter<any>;
  render() {
    if (this.options != undefined) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-select placeholder="Select One" interface="popover" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}>
            {this.options.map(val => (
              <ion-select-option value={val}>{val}</ion-select-option>
            ))}
          </ion-select>
        </ion-item>
      );
    } else if (this.type == Type.string) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-input value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-input>
        </ion-item>
      );
    } else if (this.type == Type.number) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-input type="number" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-input>
          {/* <ion-range min={20} max={80} step={2}>
            <ion-icon size="small" slot="start" name="sunny"></ion-icon>
            <ion-icon slot="end" name="sunny"></ion-icon>
          </ion-range> */}
        </ion-item>
      );
    } else if (this.type == Type.boolean) {
      return (
        <ion-item>
          <ion-label>{this.name}</ion-label>
          <ion-toggle slot="end" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-toggle>
        </ion-item>
      );
    } else {
      return <div>No known type!</div>;
    }
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
