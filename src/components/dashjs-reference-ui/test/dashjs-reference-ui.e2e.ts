import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-reference-ui', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-reference-ui></dashjs-reference-ui>');

    const element = await page.find('dashjs-reference-ui');
    expect(element).toHaveClass('hydrated');
  });
});
