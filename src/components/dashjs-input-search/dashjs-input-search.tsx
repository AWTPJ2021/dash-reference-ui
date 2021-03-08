import { popoverController } from '@ionic/core';
import { Component, Host, h, EventEmitter, Event, Prop, State } from '@stencil/core';

@Component({
  tag: 'dashjs-input-search',
  styleUrl: 'dashjs-input-search.css',
  shadow: true,
})
export class DashjsInputSearch {
  /**
   * Search Item that was selected during the search.
   */
  @Event()
  searchItemSelected: EventEmitter<string>;

  /**
   * List of searched Items, single one will be emitted if selected during search
   */
  @Prop()
  searchItemList: string[] = [];
  /**
   * Placholder of the input element
   */
  @Prop()
  placeholder: string = '';
  /**
   * Function applied before display of the Search Item
   */
  @Prop()
  displayFunction: (str: string) => string = str => str;

  @State() searchString: string = '';
  @State() filteredSearchList: string[] = [];

  /**
   * This is just for ion-popover to position the popover correctly
   */
  private ionPopoverEventReference: Event;

  private debounceTimer: NodeJS.Timeout | undefined;
  private searchPopover: HTMLIonPopoverElement | undefined;
  private searchElement: HTMLInputElement;

  private async updateSearch(): Promise<void> {
    if (this.searchString == '') {
      if (this.debounceTimer != undefined) {
        clearTimeout(this.debounceTimer);
        return;
      }
      if (this.searchPopover != undefined) {
        await this.searchPopover.dismiss();
        this.searchPopover = undefined;
      }
      return;
    }
    const next = async () => {
      const regex = new RegExp(this.searchString, 'i');
      const matchingSettings = this.searchItemList
        // Filter only matching keys
        .filter(e => e.match(regex));
      if (this.searchPopover != undefined) {
        await this.searchPopover.dismiss();
        this.searchPopover = undefined;
      }
      this.searchPopover = await popoverController.create({
        component: 'dashjs-popover-select',
        cssClass: 'settings-search-popover',
        showBackdrop: false,
        event: this.ionPopoverEventReference,
        keyboardClose: false,
        leaveAnimation: undefined,
        enterAnimation: undefined,
        componentProps: {
          options: matchingSettings.map(el => this.displayFunction(el)),
        },
      });
      await this.searchPopover.present();
      this.searchElement.focus();
      const { data } = await this.searchPopover.onWillDismiss();
      if (data) {
        this.searchItemSelectedEvent(data);
        this.searchString = '';
      }
    };

    if (this.debounceTimer != undefined) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(next, 500);
  }

  private testIfMatchingString() {
    const element = this.searchItemList
      // Filter for a matching key
      .filter(e => e.match(this.searchString));
    if (element.length === 1) {
      this.searchItemSelectedEvent(element[0]);
      this.searchString = '';
    }
  }

  private searchItemSelectedEvent(item: string): void {
    this.searchItemSelected.emit(item);
  }

  private inputChange = (event: Event) => {
    this.searchString = (event.target as HTMLInputElement).value;
    this.ionPopoverEventReference = event;
    this.updateSearch();
  };

  render() {
    return (
      <Host>
        <ion-input
          value={this.searchString}
          ref={el => (this.searchElement = (el as unknown) as HTMLInputElement)}
          placeholder={this.placeholder}
          onIonChange={this.inputChange}
          onKeyPress={event => (event.code === 'Enter' ? this.testIfMatchingString() : null)}
        ></ion-input>
      </Host>
    );
  }
}
