import { Product } from './InterfacesAndTypes';

export default (iprod: Product[], iprice: Product[]): Product[] => {
  return iprod.map((prod: Product) => {
    const found: Product = iprice.find(
      (price: Product) =>
        price.get('MFGPART') === prod.get('MFGPART') &&
        price.get('MFGNAME') === prod.get('MFGNAME')
    );
    ['GSAPRICE', 'TEMPRICE'].forEach((header: string) =>
      header === 'TEMPRICE'
        ? prod.set(header, found.get(header) ? found.get(header) : '')
        : prod.set(header, found.get(header))
    );
    return prod;
  });
};
