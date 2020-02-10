import { Product } from './InterfacesAndTypes';
import parseFilesToObjs from './ParseFilesToObjs';
import combineFiles from './CombineFiles';
import shrinkAndConsolidate from './ShrinkAndConsolidate';
import createTextFile from './CreateTextFile';

export default (files: Express.Multer.File[]) => {
  const { iprod, iprice } = parseFilesToObjs(files);
  const finalCatalog: Product[] = shrinkAndConsolidate(
    combineFiles(iprod, iprice)
  );
  return createTextFile(finalCatalog);
};
