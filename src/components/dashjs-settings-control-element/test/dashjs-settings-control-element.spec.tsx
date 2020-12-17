import { newSpecPage } from '@stencil/core/testing';
import { DashjsSettingsControlElement } from '../dashjs-settings-control-element';

describe('dashjs-settings-control-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsSettingsControlElement],
      html: `<dashjs-settings-control-element></dashjs-settings-control-element>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-settings-control-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-settings-control-element>
    `);
  });
});
