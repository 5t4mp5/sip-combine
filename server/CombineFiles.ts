import * as XLSX from 'xlsx';
import { parse } from 'path';

type Product = Map<string, string>;

const parseFileToJsonArr: Function = (file: Buffer): JSON[] => {
  const sheet: XLSX.WorkSheet = XLSX.read(file, { type: 'buffer' }).Sheets
    .Sheet1;
  return XLSX.utils.sheet_to_json(sheet);
};

const consolidateProductDesc = (prod: Product): Product => {
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

const parseJsonToProductArr = (file: JSON[], type: string) => {
  const skip: string[] = [
    'STDPACK',
    'INCR_OF',
    'P_WWW',
    'WARNUMBER',
    'WARPERIOD',
    'P_DELIV',
    'LEADTIME',
    'ITEMTYPE',
    'FOB_AK',
    'FOB_HI',
    'FOB_PR',
    'FOB_US',
    'PSC_CODE',
    'ZONE_NUM',
    'TPRSTART',
    'TPRSTOP',
  ];
  return file.map(
    (record: JSON): Product => {
      const map = new Map();
      for (let key in record) {
        if (record.hasOwnProperty(key) && !skip.includes(key)) {
          map.set(key, record[key]);
        }
      }
      return type === 'iprod' ? consolidateProductDesc(map) : map;
    }
  );
};

const combineJsonFiles: Function = (
  iprod: Product[],
  iprice: Product[]
): Product[] => {
  return iprod.map((prod: Product) => {
    const found: Product = iprice.find(
      (price: Product) =>
        price.get('MFGPART') === prod.get('MFGPART') &&
        price.get('MFGNAME') === prod.get('MFGNAME')
    );
    ['GSAPRICE', 'TEMPRICE'].forEach((header: string) =>
      prod.set(header, found.get(header))
    );
    return prod;
  });
};

export default (iprod: Buffer, iprice: Buffer) => {
  const iprodMapArr: Product[] = parseJsonToProductArr(
    parseFileToJsonArr(iprod),
    'iprod'
  );
  const ipriceMapArr: Product[] = parseJsonToProductArr(
    parseFileToJsonArr(iprice),
    'iprice'
  );
  const catalogMapArr: Product[] = combineJsonFiles(iprodMapArr, ipriceMapArr);
  console.log(catalogMapArr);
};
