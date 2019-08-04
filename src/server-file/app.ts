import * as express from 'express';
import * as cors from 'cors';

import router from './router';

const app = express();
const port = 8081;

app.set('port', port);

app.use(cors());

app.use('/', router);

app.use((err, req, res, next) => {
  res.status(500);
  res.end(err.toString());
});

app.listen(port, () => {
  console.log(`File Server Started at ${port}`);
});
