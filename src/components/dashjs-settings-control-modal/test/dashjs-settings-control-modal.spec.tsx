import { newSpecPage } from '@stencil/core/testing';
import { DashjsSettingsControlModal } from '../dashjs-settings-control-modal';

describe('dashjs-settings-control-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsSettingsControlModal],
      html: `<dashjs-settings-control-modal></dashjs-settings-control-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-settings-control-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-settings-control-modal>
    `);
  });
});
