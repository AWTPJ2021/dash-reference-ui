import { newSpecPage } from '@stencil/core/testing';
import { DashjsApiControl } from '../dashjs-api-control';

describe('dashjs-api-control', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsApiControl],
      html: `<dashjs-api-control></dashjs-api-control>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-api-control>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-api-control>
    `);
  });
});
