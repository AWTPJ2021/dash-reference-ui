import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-api-control', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-api-control></dashjs-api-control>');

    const element = await page.find('dashjs-api-control');
    expect(element).toHaveClass('hydrated');
  });
});
