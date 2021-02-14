import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-generic-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-generic-modal></dashjs-generic-modal>');

    const element = await page.find('dashjs-generic-modal');
    expect(element).toHaveClass('hydrated');
  });
});
