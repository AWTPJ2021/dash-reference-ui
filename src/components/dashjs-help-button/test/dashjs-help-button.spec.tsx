import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { DashjsHelpButton } from '../dashjs-help-button';

describe('dashjs-help-button', () => {
  it('should build', () => {
    expect(new DashjsHelpButton()).toBeTruthy();
  });
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DashjsHelpButton],
      template: () => <dashjs-help-button helperText="I am a help Text!"></dashjs-help-button>,
    });
    expect(page.root).toEqualHtml(`
    <dashjs-help-button>
       <mock:shadow-root>
         <ion-button fill="clear" size="small" title="I am a help Text!">
           <ion-icon color="dark" name="help-circle-outline" slot="icon-only"></ion-icon>
         </ion-button>
       </mock:shadow-root>
    </dashjs-help-button>
    `);
  });
});
