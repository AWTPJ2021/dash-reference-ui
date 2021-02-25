import { Component, EventEmitter, h, Prop, Event } from '@stencil/core';
import { Type, MediaType } from '../../types/types';
import { toastController } from '@ionic/core';
import { LocalStorage } from '../../utils/localStorage';

const STRING_API_ELEM = 'api_element';
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

  private setValue(functionValue : any[]): void {
    LocalStorage.updateKeyInKeyValueObject(STRING_API_ELEM, this.name, JSON.stringify(functionValue));
  }

  async checkAndEmit(functionValue : any[]) {
    let error = false;
    for (let i = 0; i < this.param.length; i++) {
      const index = i;
      switch (this.param[i].type) {
        case 'string':
          if (!(functionValue[index] instanceof String)) error = true;
          break;
        case 'number':
          if (isNaN(functionValue[index])) error = true;
          break;
        case 'MediaType':
          if (!Object.values(MediaType).includes(functionValue[index])) error = true;
          break;
      }
      if (error) break;
    }
    if (error) {
      const toast = await toastController.create({
        message: 'Please set all parameters for the function.',
        duration: 2000,
      });
      toast.present();
    } else {
      this.valueChanged.emit(functionValue);
    }
  }

  render() {
    let functionValue = [];
    let control = [];

    this.param.forEach( (curr, index) {
      switch (curr.type) {
        case 'string':
          functionValue[index] = '';
          break;
        case 'number':
          functionValue[index] = 0;
          break;
        case 'boolean':
          functionValue[index] = false;
          break;
      }
    });

    let elem_values = LocalStorage.getKeyValueObject(STRING_API_ELEM);

    if(elem_values) {
      if(elem_values[this.name] != null) {
        functionValue = this.param.length > 0 ? JSON.parse(elem_values[this.name]).length == this.param.length ? JSON.parse(elem_values[this.name]) : functionValue : elem_values[this.name];
      }
    }

    if (this.param.length > 0) {
      this.param.forEach( (curr, index) {
        {
          switch (curr.type) {
            case 'string':
              control.push(
                <ion-input class="input-border" debounce={300} value={functionValue[index]} onIonChange={change => { functionValue[index] = change.detail.value; this.setValue(functionValue)}}></ion-input>,
              );
              control.push(<div class="gap"></div>);
              break;
            case 'number':
              control.push(
                <ion-input
                  class='input-border'
                  debounce={300}
                  type='number'
                  value={functionValue[index]}
                  onIonChange={change => {functionValue[index] =  Number(change.detail.value); this.setValue(functionValue)}}
                ></ion-input>,
              );
              control.push(<div class="gap"></div>);
              break;
            case 'boolean':
              control.push(<ion-toggle checked={functionValue[index]} onIonChange={change => {functionValue[index] = change.detail.checked; this.setValue(functionValue)}}></ion-toggle>);
              control.push(<div class="gap"></div>);
              break;
            case 'MediaType':
              control.push(
                <ion-select class="input-border" value={functionValue[index]} placeholder="Select MediaType" interface="popover" onIonChange={change => {functionValue[index] = change.detail.value; this.setValue(functionValue)}}>
                  {Object.keys(MediaType).map(val => (
                    <ion-select-option value={MediaType[val]}>{MediaType[val]}</ion-select-option>
                  ))}
                </ion-select>,
              );
              control.push(<div class="gap"></div>);
              break;
          }
        }
      });
    }
    control.push(
      <ion-button shape="round" size="small" onClick={() => this.checkAndEmit(functionValue)}>
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
