import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-statistics', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-statistics></dashjs-statistics>');

    const element = await page.find('dashjs-statistics');
    expect(element).toHaveClass('hydrated');
  });
});
