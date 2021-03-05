import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-input-search', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-input-search></dashjs-input-search>');

    const element = await page.find('dashjs-input-search');
    expect(element).toHaveClass('hydrated');
  });
});
