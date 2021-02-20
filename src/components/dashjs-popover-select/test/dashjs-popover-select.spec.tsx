import { newSpecPage } from '@stencil/core/testing';
import { DashjsPopoverSelect } from '../dashjs-popover-select';

xdescribe('dashjs-popover-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsPopoverSelect],
      html: `<dashjs-popover-select></dashjs-popover-select>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-popover-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-popover-select>
    `);
  });
});
