import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(3000, function () {
  console.log('running http://localhost:3000');

  routes(app);
});
