import * as express from 'express';
const app: express.Express = express();
import * as path from 'path';
import * as multer from 'multer';
const storage: multer.StorageEngine = multer.memoryStorage();
const upload: any = multer({ storage: storage });
import * as XLSX from 'xlsx';

const PORT: string = process.env.PORT || '1337';

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/main.js', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'main.js'));
});

app.post(
  '/make-catalog',
  upload.any(),
  (req: express.Request, res: express.Response) => {
    const files: Array<Express.Multer.File> = req.files as Express.Multer.File[];
    const iprod: any = files.find((file: any) => file.fieldname === 'IPROD')
      .buffer;
    const iprice: any = files.find((file: any) => file.fieldname === 'IPRICE')
      .buffer;
    const iprodFile: XLSX.WorkBook = XLSX.read(iprod, { type: 'buffer' });
    const myJson: JSON[] = XLSX.utils.sheet_to_json(iprodFile.Sheets.Sheet1);
    console.log(myJson);

    // const catalog: string = makeCombinedCatalog(iprod, iprice);
    res.contentType('text/plain');
    // res.send(catalog);
    res.send('OK');
  }
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
