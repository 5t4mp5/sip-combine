import { Product } from './InterfacesAndTypes';
export default (catalog: Product[]): string => {
  const headers: string[] = [];
  const firstRow: Product = catalog[0];
  firstRow.forEach((value: string, key: string) => headers.push(key));
  const body: string = catalog.reduce(
    (str: string, product: Product): string => {
      let output: string = '';
      product.forEach((value: string) => (output += `${value}\t`));
      return str + output + '\n';
    },
    ''
  );
  return `${headers.join('\t')}\n${body}`;
};
