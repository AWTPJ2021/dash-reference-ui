import { newE2EPage } from '@stencil/core/testing';

xdescribe('dashjs-tree', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dashjs-tree></dashjs-tree>');

    const element = await page.find('dashjs-tree');
    expect(element).toHaveClass('hydrated');
  });
});
