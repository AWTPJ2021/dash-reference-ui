import { newSpecPage } from '@stencil/core/testing';
import { DashjsSettingsControl } from '../dashjs-settings-control';

describe('dashjs-settings-control', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsSettingsControl],
      html: `<dashjs-settings-control></dashjs-settings-control>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-settings-control>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-settings-control>
    `);
  });
});
