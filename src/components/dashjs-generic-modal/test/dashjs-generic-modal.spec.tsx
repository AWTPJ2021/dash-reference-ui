import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { DashjsGenericModal } from '../dashjs-generic-modal';

describe('dashjs-generic-modal', () => {
  it('should build', () => {
    expect(new DashjsGenericModal()).toBeTruthy();
  });
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsGenericModal],
      template: () => <dashjs-generic-modal textTitle="I am a Title" content="Here is the content"></dashjs-generic-modal>,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-generic-modal>
        <mock:shadow-root>
          <ion-header translucent>
            <ion-toolbar>
              <ion-title>I am a Title</ion-title>
              <ion-buttons slot="end">
                <ion-button>
                  <ion-icon name="close-circle-outline"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen>
            <ion-grid>
              <ion-item class="spacing" lines="none">
                Here is the content
              </ion-item>
            </ion-grid>
          </ion-content>
        </mock:shadow-root>
      </dashjs-generic-modal>
    `);
  });
});
