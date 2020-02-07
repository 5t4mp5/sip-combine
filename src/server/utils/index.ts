import parseFilesToObjs from './ParseFilesToObjs';
import combineFiles from './CombineFiles';
import createTextFile from './CreateTextFile';

export default (files: Express.Multer.File[]) => {
  const { iprod, iprice } = parseFilesToObjs(files);
  return createTextFile(combineFiles(iprod, iprice));
};
