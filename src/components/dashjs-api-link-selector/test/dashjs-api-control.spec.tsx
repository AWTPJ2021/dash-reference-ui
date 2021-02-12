import { newSpecPage } from '@stencil/core/testing';
import { PagePopover } from '../dashjs-api-link-selector';

describe('dashjs-api-link-selector', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PagePopover],
      html: `<dashjs-api-link-selector></dashjs-api-link-selector>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-api-link-selector>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-api-link-selector>
    `);
  });
});
