import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-settings-control-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-settings-control-modal></dashjs-settings-control-modal>');

    const element = await page.find('dashjs-settings-control-modal');
    expect(element).toHaveClass('hydrated');
  });
});
