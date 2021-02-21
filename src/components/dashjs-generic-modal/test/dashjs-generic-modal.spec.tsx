import { newSpecPage } from '@stencil/core/testing';
import { DashjsGenericModal } from '../dashjs-generic-modal';

xdescribe('dashjs-generic-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsGenericModal],
      html: `<dashjs-generic-modal></dashjs-generic-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-generic-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-generic-modal>
    `);
  });
});
