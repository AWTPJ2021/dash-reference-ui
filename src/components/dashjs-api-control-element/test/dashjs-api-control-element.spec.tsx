import { newSpecPage } from '@stencil/core/testing';
import { DashjsSettingsControlElement } from '../dashjs-api-control-element';

describe('dashjs-api-control-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsSettingsControlElement],
      html: `<dashjs-settings-control-element></dashjs-api-control-element>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-api-control-element>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-api-control-element>
    `);
  });
});
