import { newSpecPage } from '@stencil/core/testing';
import { DashjsHelpButton } from '../dashjs-help-button';

describe('dashjs-help-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsHelpButton],
      html: `<dashjs-help-button></dashjs-help-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dashjs-help-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dashjs-help-button>
    `);
  });
});
