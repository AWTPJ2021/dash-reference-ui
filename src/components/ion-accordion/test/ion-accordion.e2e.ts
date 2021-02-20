import { newE2EPage } from '@stencil/core/testing';

xdescribe('ion-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ion-accordion></ion-accordion>');

    const element = await page.find('ion-accordion');
    expect(element).toHaveClass('hydrated');
  });
});
