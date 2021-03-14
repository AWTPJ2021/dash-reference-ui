import { Component, EventEmitter, h, Prop, Event } from '@stencil/core';
import { MediaType } from '../../types/types';
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
  /**
   * Triggers the API call function
   */
  @Event() callFunction: EventEmitter<any>;
  /**
   * Update the api call's function
   */
  @Event() updateFunction: EventEmitter<any>;
  /**
   * Contains the required parameters of the control element
   */
  @Prop() param: any;

  /**
   * Contains the parameter values
   */
  @Prop() value: any;

  /**
   * Emits the inputs for further processing if they passes the validation
   * @param functionValue 
   */
  async checkAndEmit(): Promise<void> {
    let error = false;
    for (let i = 0; i < this.param.length; i++) {
      const index = i;
      switch (this.param[i].type) {
        case 'string':
          if (!(this.value[index] instanceof String)) error = true;
          break;
        case 'number':
          if (isNaN(this.value[index])) error = true;
          break;
        case 'MediaType':
          if (!Object.values(MediaType).includes(this.value[index])) error = true;
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
      this.callFunction.emit(this.value);
    }
  }

  /**
   * Updates the stored API call parameter
   * @param index 
   * @param value 
   */
  private setAndSave (index : number, value : any): void {
    this.value[index] = value;
    this.updateFunction.emit(this.value);
  }

  render() {
    const control : any = [];

    if (this.param.length > 0) {
      this.param.forEach( (curr, index) => {
        {
          switch (curr.type) {
            case 'string':
              control.push(
                <ion-input 
                  class="input-border" 
                  debounce={300} 
                  value={this.value[index]} 
                  onIonChange={change => { 
                    this.setAndSave(index, change.detail.value);
                  }}
                ></ion-input>,
              );
              control.push(<div class="gap"></div>);
              break;
            case 'number':
              control.push(
                <ion-input
                  class='input-border'
                  debounce={300}
                  type='number'
                  value={this.value[index]}
                  onIonChange={change => {
                    this.setAndSave(index, Number(change.detail.value));}
                  }
                ></ion-input>,
              );
              control.push(<div class="gap"></div>);
              break;
            case 'boolean':
              control.push(<ion-toggle checked={this.value[index]} onIonChange={change => {this.setAndSave(index, change.detail.checked);}}></ion-toggle>);
              control.push(<div class="gap"></div>);
              break;
            case 'MediaType':
              control.push(
                <ion-select class="input-border" value={this.value[index]} placeholder="Select MediaType" interface="popover" onIonChange={change => {this.setAndSave(index, change.detail.value);}}>
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
