import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-help-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-help-button></dashjs-help-button>');

    const element = await page.find('dashjs-help-button');
    expect(element).toHaveClass('hydrated');
  });
});
