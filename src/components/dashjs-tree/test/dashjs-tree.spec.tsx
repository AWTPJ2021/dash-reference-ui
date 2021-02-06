import { newSpecPage } from '@stencil/core/testing';
import { DashjsTree } from '../dashjs-tree';

describe('dashjs-tree', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsTree],
      html: `<dashjs-tree></dashjs-tree>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-tree>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-tree>
    `);
  });
});
