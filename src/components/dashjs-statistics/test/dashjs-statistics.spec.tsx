import { newSpecPage } from '@stencil/core/testing';
import { DashjsStatistics } from '../dashjs-statistics';

xdescribe('dashjs-statistics', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsStatistics],
      html: `<dashjs-statistics></dashjs-statistics>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-statistics>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-statistics>
    `);
  });
});
