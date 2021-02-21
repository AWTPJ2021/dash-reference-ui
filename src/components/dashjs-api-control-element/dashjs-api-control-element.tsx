import { Component, EventEmitter, h, Prop, Event, State } from '@stencil/core';
import { Type, MediaType } from '../../types/types';
import { toastController } from '@ionic/core';

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
  @Event() valueChanged: EventEmitter<any>;
  @Prop() param: any;
  @Prop() paramDesc: any;
  @State() functionValue: any = [''];

  private setValue(counter: number, val: any): void {
    this.functionValue[counter] = val;
  }

  componentWillLoad() {
    for (let i = 0; i < this.param.length; i++) {
      const index = i;
        switch (this.param[i].type) {
          case 'string':
            this.functionValue[index] = "";
            break;
          case 'number':
            this.functionValue[index] = 0;
            break;
          case 'boolean':
            this.functionValue[index] = false;
            break;
        }
    }
  }

  async checkAndEmit() {
    let error = false;
    for (let i = 0; i < this.param.length; i++) {
      const index = i;
        switch (this.param[i].type) {
          case 'string':
            if(!(this.functionValue[index] instanceof String)) error = true;
            break;
          case 'number':
            if(isNaN(this.functionValue[index])) error = true;
            break;
          case 'MediaType':
            if(!Object.values(MediaType).includes(this.functionValue[index])) error = true;
            break;
        }
        if(error) break;
    }
    if(error) {
      const toast = await toastController.create({
        message: "Please set all parameters for the function.",
        duration: 2000,
      });
      toast.present();
    } else {
      this.valueChanged.emit(this.functionValue);
    }
  }

  render() {
    const control = [];
    if (this.param.length > 0) {
      for (let i = 0; i < this.param.length; i++) {
        const index = i;
        switch (this.param[i].type) {
          case 'string':
            control.push(<ion-input class="input-border" debounce={300} value={this.functionValue[index]} onIonChange={change => this.setValue(index, change.detail.value)}></ion-input>);
            control.push(<div class="gap"></div>);
            break;
          case 'number':
            control.push(
              <ion-input class={"input-border " + this.functionValue[index]} debounce={300} type="number" value={this.functionValue[index]} onIonChange={change => this.setValue(index, Number(change.detail.value))}></ion-input>,
            );
            control.push(<div class="gap"></div>);
            break;
          case 'boolean':
            control.push(<ion-toggle checked={this.functionValue[index]} onIonChange={change => this.setValue(index, change.detail.checked)}></ion-toggle>);
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
      <ion-button shape="round" size="small" onClick={() => this.checkAndEmit()}>
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
