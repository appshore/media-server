import 'regenerator-runtime/runtime';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { getMedia } from './media';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// for REST only endpoints
app.use('/*', (req, res, next) => {
  if (
    req.headers
    && (req.headers.accept === 'application/json'
      || req.headers['content-type'] === 'application/json')
  ) {
    next();
  } else {
    res.status(422).send({ status: 'error', message: 'Invalid API' });
  }
});

app.get(`/${process.env.API}/media/:search`, async (req, res) => {
  const {
    params: { search }
  } = req;

  res.send(await getMedia({ search }));
});

// catch all for unknown endpoints
app.all('/*', (req, res) => {
  res.status(422).send({ status: 'error', message: 'Unknown endpoint' });
});

app.listen(process.env.PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server listening on port ${process.env.PORT}`);
});
