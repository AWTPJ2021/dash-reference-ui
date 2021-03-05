import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'ion-accordion',
  styleUrl: 'ion-accordion.scss',
  shadow: true,
})
export class IonAccordion {
  /**
   * The Title of the accordion. Can be left blank.
   */
  @Prop() titleText = '';
  @State() expanded = true;
  render() {
    return (
      <Host>
        <ion-card>
          <ion-card-header>
            <div class="header">
              <h2>{this.titleText}</h2>
              <div style={{ display: 'flex' }}>
                <slot name="title" />
                <ion-button fill="clear" onClick={() => (this.expanded = !this.expanded)}>
                  <ion-icon slot="icon-only" color="dark" name={this.expanded ? 'chevron-up-outline' : 'chevron-down-outline'}></ion-icon>
                </ion-button>
              </div>
            </div>
          </ion-card-header>
          {this.expanded ? (
            <ion-card-content>
              <slot></slot>{' '}
            </ion-card-content>
          ) : null}
        </ion-card>
      </Host>
    );
  }
}
