import * as express from 'express';
const app: express.Express = express();
import * as path from 'path';
import * as multer from 'multer';
const storage: multer.StorageEngine = multer.memoryStorage();
const upload: any = multer({ storage: storage });
import createCatalog from './utils';

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
    const catalog: string = createCatalog(files);
    res.contentType('text/plain');
    res.send(catalog);
  }
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
