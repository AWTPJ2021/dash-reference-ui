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
  @Prop() defaultValue: any;
  @Event() valueChanged: EventEmitter<any>;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @State() control = [];

  @State() functionValue : any = "";

  setValue(val) {
    this.functionValue = val;
  }

  componentWillLoad() {
    if (this.param.length > 0) {
      for(var i = 0; i <this.param.length; i++) {
        switch (this.param[i].type) {
          case "string":
            this.control.push(<ion-input class="input-border" debounce={300} value={this.defaultValue} onIonChange={change => this.setValue(change.detail.value)}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case "number":
            this.control.push(<ion-input class="input-border" debounce={300} type="number" value={this.defaultValue} onIonChange={change => this.setValue(change.detail.value)}></ion-input>);
            this.control.push(<div class="gap"></div>);
            break;
          case "boolean":
            this.control.push(<ion-toggle value={this.defaultValue} onIonChange={change => this.setValue(change.detail.checked)}></ion-toggle>)
            this.control.push(<div class="gap"></div>);
            break;
          case "MediaType": 
            this.control.push(
            <ion-select class="input-border" placeholder="Select MediaType" interface="popover" value={this.defaultValue} onIonChange={change => this.setValue(change.detail.value)}>
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
  }
  render() {
    return (
      <ion-grid>
        <ion-row>
          <ion-col class="middle">{this.name}</ion-col>
          <ion-col size="auto"><ion-item lines="none">{this.control}<ion-button shape="round" size="small" onClick={ () => this.valueChanged.emit("")}>Call</ion-button></ion-item></ion-col>
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
