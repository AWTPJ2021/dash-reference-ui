import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-api-control-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-api-control-modal></dashjs-api-control-modal>');

    const element = await page.find('dashjs-api-control-modal');
    expect(element).toHaveClass('hydrated');
  });
});
