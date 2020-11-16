import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-player', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-player></dashjs-player>');

    const element = await page.find('dashjs-player');
    expect(element).toHaveClass('hydrated');
  });
});
