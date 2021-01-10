import { newSpecPage } from '@stencil/core/testing';
import { DashjsSettingsControlModal } from '../dashjs-api-control-modal';

describe('dashjs-api-control-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsSettingsControlModal],
      html: `<dashjs-api-control-modal></dashjs-api-control-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-api-control-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-api-control-modal>
    `);
  });
});
