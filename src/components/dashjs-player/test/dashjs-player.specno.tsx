import { newSpecPage } from '@stencil/core/testing';
import { DashjsPlayer } from '../dashjs-player';

xdescribe('dashjs-player', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsPlayer],
      html: `<dashjs-player></dashjs-player>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-player>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-player>
    `);
  });
});
