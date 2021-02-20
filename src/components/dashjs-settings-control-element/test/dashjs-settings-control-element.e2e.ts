import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-settings-control-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-settings-control-element></dashjs-settings-control-element>');

    const element = await page.find('dashjs-settings-control-element');
    expect(element).toHaveClass('hydrated');
  });
});
