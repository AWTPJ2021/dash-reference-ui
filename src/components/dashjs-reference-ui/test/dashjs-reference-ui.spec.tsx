import { newSpecPage } from '@stencil/core/testing';
import { DashjsReferenceUi } from '../dashjs-reference-ui';

xdescribe('dashjs-reference-ui', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsReferenceUi],
      html: `<dashjs-reference-ui></dashjs-reference-ui>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-reference-ui>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-reference-ui>
    `);
  });
});
