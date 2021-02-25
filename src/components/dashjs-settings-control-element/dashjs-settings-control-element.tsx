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
  @Prop() optionsLabels: string[] = undefined;
  @Prop() type: Type;
  @Prop() defaultValue: any;
  @Event()
  valueChanged: EventEmitter<any>;
  render() {
    let control = <div>No known type!</div>;
    if (this.options != undefined) {
      control = [
        <ion-select
          class="input-border"
          placeholder="Select One"
          interface="popover"
          value={String(this.defaultValue)}
          onIonChange={change => this.valueChanged.emit(change.detail.value)}
        >
          {this.options.map((val, index) => (
            <ion-select-option value={val.toString()}>{this.optionsLabels != undefined ? this.optionsLabels[index] : val}</ion-select-option>
          ))}
        </ion-select>,
        // <ion-label position="floating">{this.name}</ion-label>,
        // <ion-select placeholder="Select One" interface="popover" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}>
        //   {this.options.map(val => (
        //     <ion-select-option value={val}>{val}</ion-select-option>
        //   ))}
        // </ion-select>,
      ];
    } else if (this.type == Type.string) {
      control = [<ion-input class="input-border" debounce={300} value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-input>];
    } else if (this.type == Type.number) {
      control = [
        <ion-input class="input-border" debounce={300} type="number" value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.value)}></ion-input>,
        // <ion-range min={20} max={80} step={2}>
        //   <ion-icon size="small" slot="start" name="sunny"></ion-icon>
        //   <ion-icon slot="end" name="sunny"></ion-icon>
        // </ion-range>
      ];
    } else if (this.type == Type.boolean) {
      control = <ion-toggle value={this.defaultValue} onIonChange={change => this.valueChanged.emit(change.detail.checked)}></ion-toggle>;
    }
    return (
      <ion-grid>
        <ion-row>
          <ion-col>{this.name}</ion-col>
          <ion-col size="auto">{control}</ion-col>
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
