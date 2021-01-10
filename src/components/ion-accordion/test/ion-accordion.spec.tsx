import { newSpecPage } from '@stencil/core/testing';
import { IonAccordion } from '../ion-accordion';

describe('ion-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [IonAccordion],
      html: `<ion-accordion></ion-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <ion-accordion>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ion-accordion>
    `);
  });
});
