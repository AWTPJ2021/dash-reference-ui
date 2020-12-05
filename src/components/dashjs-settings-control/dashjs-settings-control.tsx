import { modalController } from '@ionic/core';
import { Component, Host, h, Prop, Watch, Method, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'dashjs-settings-control',
  styleUrl: 'dashjs-settings-control.css',
  shadow: false,
})
export class DashjsSettingsControl {
  @Prop() defaultSettings: Object;
  @Watch('defaultSettings')
  updateSettings(newValue, oldValue) {
    // Update the settings
  }

  @Method()
  resetSettings() {
    // Resets the Settings
  }

  @Event() settingsUpdated: EventEmitter<Object>;

  async openSettings() {
    const modal = await modalController.create({
      component: 'dashjs-settings-control-modal',
    });
    await modal.present();
  }
  componentWillLoad() {
    fetch('/static/out.json')
      .then((response: Response) => response.json())
      .then(response => {
        console.log(response);
      });
  }
  render() {
    return (
      <Host>
        <ion-card>
          <ion-card-header>
            <ion-card-title onClick={event => this.settingsUpdated.emit('test')}>Settings</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-chip>
              <ion-label>Setting 1</ion-label>
              <ion-icon name="close-circle"></ion-icon>
            </ion-chip>
            <ion-chip color="secondary">
              <ion-label color="secondary">Secondary Label</ion-label>
              <ion-icon name="close-circle"></ion-icon>
            </ion-chip>
            <ion-button shape="round" color="dark" onClick={() => this.openSettings()}>
              Browse Settings
              <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
            </ion-button>
            <ion-button shape="round" fill="outline" color="dark" onClick={() => this.resetSettings()}>
              Reset
            </ion-button>
            <ion-list>
              <ion-item>
                <ion-label>Input</ion-label>
                <ion-input></ion-input>
              </ion-item>
              <ion-item>
                <ion-label>Toggle</ion-label>
                <ion-toggle slot="end"></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>Radio</ion-label>
                <ion-radio slot="end"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>Checkbox</ion-label>
                <ion-checkbox slot="start"></ion-checkbox>
              </ion-item>
              <ion-item>
                <ion-segment /*onIonChange={ev => this.segmentChanged(ev)} */>
                  <ion-segment-button value="friends">
                    <ion-label>Friends</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="enemies">
                    <ion-label>Enemies</ion-label>
                  </ion-segment-button>
                </ion-segment>
              </ion-item>
              <ion-item>
                <ion-label>Pets</ion-label>
                <ion-select interface="popover" multiple={true} value={['bird', 'dog']}>
                  <ion-select-option value="bird">Bird</ion-select-option>
                  <ion-select-option value="cat">Cat</ion-select-option>
                  <ion-select-option value="dog">Dog</ion-select-option>
                  <ion-select-option value="honeybadger">Honey Badger</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-range min={20} max={80} step={2}>
                  <ion-icon size="small" slot="start" name="sunny"></ion-icon>
                  <ion-icon slot="end" name="sunny"></ion-icon>
                </ion-range>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </Host>
    );
  }
}
