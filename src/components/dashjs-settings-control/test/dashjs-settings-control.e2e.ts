import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-settings-control', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-settings-control></dashjs-settings-control>');

    const element = await page.find('dashjs-settings-control');
    expect(element).toHaveClass('hydrated');
  });
});
