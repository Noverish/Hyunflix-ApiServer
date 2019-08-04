import * as express from 'express';
import * as path from 'path';

import indexRouter from './routes';

// Mozilla/5.0 (Linux; olleh tv; U; ko-kr; CT1101) AppleWebKit/538.37 (KHTML, like Gecko) AltiBrowser/4.20.0 (olleh tv; Large Screen) Safari/538.37

const app = express();
const port = 8082;

app.set('port', port);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/', express.static(path.join(__dirname, './public')));

app.use(function(req, res, next) {
  res.end('Not Found');
})

app.use(function(err, req, res, next) {
  res.end(err.toString())
})

app.listen(port, () => {
  console.log(`HTML Server Started at ${port}`);
});