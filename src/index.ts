import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Express = express();

app.use(express.json());
app.use(cors());

app.listen(3000, function () {
  console.log('running http://localhost:3000');

  routes(app);
});
