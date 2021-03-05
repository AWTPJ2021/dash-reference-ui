import { newSpecPage } from '@stencil/core/testing';
import { DashjsInputSearch } from '../dashjs-input-search';

describe('dashjs-input-search', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsInputSearch],
      html: `<dashjs-input-search></dashjs-input-search>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-input-search>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-input-search>
    `);
  });
});
