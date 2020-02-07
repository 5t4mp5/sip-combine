import { Product } from './InterfacesAndTypes';
export default (catalog: Product[]): string => {
  const headers: string[] = [...catalog[0].keys()];
  const body: string = catalog.reduce(
    (str: string, product: Product): string => {
      product.forEach((value: string) => (str += `${value}\t`));
      return str + '\n';
    },
    ''
  );
  return `${headers.join('\t')}\n${body}`;
};
