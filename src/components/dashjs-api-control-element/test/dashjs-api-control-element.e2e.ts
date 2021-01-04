import { newE2EPage } from '@stencil/core/testing';

describe('dashjs-api-control-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-api-control-element></dashjs-api-control-element>');

    const element = await page.find('dashjs-api-control-element');
    expect(element).toHaveClass('hydrated');
  });
});
