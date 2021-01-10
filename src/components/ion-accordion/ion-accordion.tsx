import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'ion-accordion',
  styleUrl: 'ion-accordion.css',
  shadow: true,
})
export class IonAccordion {
  @Prop() title = '';
  @State() expanded = true;
  render() {
    return (
      <Host>
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {this.title}
              <ion-button fill="clear" style={{ float: 'right' }} onClick={() => (this.expanded = !this.expanded)}>
                <ion-icon slot="icon-only" color="dark" name={this.expanded ? 'chevron-up-outline' : 'chevron-down-outline'}></ion-icon>
              </ion-button>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>{this.expanded ? <slot></slot> : null}</ion-card-content>
        </ion-card>
      </Host>
    );
  }
}
