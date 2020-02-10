import { Product } from './InterfacesAndTypes';

const consolidateProductDesc: Function = (prod: Product): Product => {
  prod.set(
    'PRODDESC',
    `${prod.get('PRODDESC')} ${prod.get('PRODDESC2')} ${prod.get(
      'PRODDESC3'
    )} ${prod.get('PRODDESC4')}`.trim()
  );
  prod.delete('PRODDESC2');
  prod.delete('PRODDESC3');
  prod.delete('PRODDESC4');
  return prod;
};

const filterWeight: Function = (catalog: Product[]) => {
  const weightIsGood: boolean = catalog.some((product: Product) => {
    product.get('WEIGHT') !== 1;
  });
  if (!weightIsGood)
    return catalog.map((product: Product) => {
      product.delete('WEIGHT');
      return product;
    });
  return catalog;
};

const filterTempPrice: Function = (catalog: Product[]) => {
  const tempPriceGood: boolean = catalog.some(
    (product: Product) => !!product.get('TEMPRICE')
  );
  if (!tempPriceGood)
    catalog.forEach((product: Product) => {
      product.delete('WEIGHT');
    });
  return catalog;
};

const handleDimensions: Function = (prod: Product): Product => {
  ['VALUE1', 'VALUE2', 'VALUE3'].forEach((column: string) => {
    prod.set(prod.get(`TYPE${column.slice(-1)}`).toString(), prod.get(column));
    prod.delete(column);
    prod.delete(`TYPE${column.slice(-1)}`);
  });
  return prod;
};

export default (catalog: Product[]) => {
  catalog = catalog.map((product: Product) => {
    consolidateProductDesc(product);
    handleDimensions(product);
    return product;
  });
  filterWeight(catalog);
  filterTempPrice(catalog);
  return catalog;
};
