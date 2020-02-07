import * as XLSX from 'xlsx';
import { JSON, Product } from './InterfacesAndTypes';

const parseFileToJsonArr: Function = (file: Buffer): JSON[] => {
  const sheet: XLSX.WorkSheet = XLSX.read(file, { type: 'buffer' }).Sheets
    .Sheet1;
  return XLSX.utils.sheet_to_json(sheet);
};

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

const parseJsonToProductArr: Function = (file: JSON[], type: string) => {
  const skip: any[] = [
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
      const map: Product = new Map();
      for (let key in record) {
        if (record.hasOwnProperty(key) && !skip.includes(key)) {
          map.set(key, record[key]);
        }
      }
      return type === 'iprod' ? consolidateProductDesc(map) : map;
    }
  );
};

const parseFiles: Function = (
  files: Express.Multer.File[]
): { iprod: Product[]; iprice: Product[] } => {
  const iprod: any = files.find((file: any) => file.fieldname === 'IPROD')
    .buffer;
  const iprice: any = files.find((file: any) => file.fieldname === 'IPRICE')
    .buffer;
  const iprodMaps: Product[] = parseJsonToProductArr(
    parseFileToJsonArr(iprod),
    'iprod'
  );
  const ipriceMaps: Product[] = parseJsonToProductArr(
    parseFileToJsonArr(iprice),
    'iprice'
  );
  return { iprod: iprodMaps, iprice: ipriceMaps };
};

export default parseFiles;
