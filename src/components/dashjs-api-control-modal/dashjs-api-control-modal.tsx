import { modalController } from '@ionic/core';
import { Component, h, Prop, State } from '@stencil/core';
import { DashFunction } from '../../types/types';

@Component({
  tag: 'dashjs-api-control-modal',
  styleUrl: 'dashjs-api-control-modal.scss',
  shadow: false,
})
export class DashjsSettingsControlModal {
  componentWillLoad() {
    this.viewedFunctions = this.functionList;
  }
  /**
   * List of all available dashjs api calls
   */
  @Prop() functionList: DashFunction[] = [];

  /**
   * List of all selected dashjs api calls
   */
  @Prop() selectedFunctions: Map<string, any> = new Map();

  /**
   * List of all viewed dashjs api calls
   */
  @State() viewedFunctions: DashFunction[] = [];

  /**
   * variable to trigger a re-render
   */
  @State() triggerRerender = 0;

  private filterSettings(str: string): void {
    if (str === '') {
      this.viewedFunctions = this.functionList;
      return;
    }
    this.viewedFunctions = this.functionList.filter(s => (s.name as string).includes(str));
  }

  private save(): void {
    modalController.dismiss(this.selectedFunctions);
  }

  private cancel(): void {
    modalController.dismiss();
  }

  private defaultValues(param: any): any[]{
    let functionValue : any = [];
    param.forEach( (curr, index) => {
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
        default:
          functionValue[index] = null;
      }
    });
    return functionValue;
  }

  render() {
    return [
      <ion-searchbar
        onIonChange={e => {
          this.filterSettings(e.detail.value!);
        }}
      ></ion-searchbar>,
      <ion-content>
          <ion-grid>
          <ion-row>
              <ion-col size="1"></ion-col>
              <ion-col size="3">Function</ion-col>
              <ion-col size="6">Description</ion-col>
              <ion-col size="2">Parameters</ion-col>
          </ion-row>
          <ion-grid>
          {this.viewedFunctions.map(item => item.parameters.length <= 1 ? (
            <ion-row onClick={() => {
              this.selectedFunctions.set(item.name, this.selectedFunctions.get(item.name) === undefined ? this.defaultValues(item.parameters) : undefined);
              this.triggerRerender++;
            }}>
                <ion-col size="1">
                    <ion-checkbox
                      checked={this.selectedFunctions.get(item.name) != undefined}
                    ></ion-checkbox>
                  </ion-col>
                <ion-col size="3">{item.name}</ion-col>
                <ion-col size="6" innerHTML={item.description}></ion-col>
                <ion-col size="2"> {item.parameters.map(p => (p.name + "(" + p.type+")"))} </ion-col>
            </ion-row>
          ) : "" )}
          </ion-grid>
          </ion-grid>
      </ion-content>,
      <ion-toolbar>
        <ion-button shape="round" fill="outline" onClick={() => this.cancel()}>
          Cancel
        </ion-button>
        <ion-button shape="round" slot="end" onClick={() => this.save()}>
          Save
        </ion-button>
      </ion-toolbar>,
    ];
  }
}
