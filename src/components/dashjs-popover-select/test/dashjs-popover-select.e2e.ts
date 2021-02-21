import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-popover-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-popover-select></dashjs-popover-select>');

    const element = await page.find('dashjs-popover-select');
    expect(element).toHaveClass('hydrated');
  });
});
