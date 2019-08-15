import * as express from 'express';
import * as cors from 'cors';

import router from './router';

const app = express();
const port = parseInt(process.env.PORT);

app.set('port', port);

app.use(cors());

app.use('/', router);

app.use((req, res, next) => {
  res.end('Not Found');
});

app.use((err, req, res, next) => {
  res.end(err.toString());
});

app.listen(port, () => {
  console.log(`File Server Started at ${port}`);
});
