import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-api-link-selector', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-api-link-selector></dashjs-api-link-selector>');

    const element = await page.find('dashjs-api-link-selector');
    expect(element).toHaveClass('hydrated');
  });
});
