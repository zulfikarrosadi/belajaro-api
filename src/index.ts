import express, { Application } from 'express';
import cors from 'cors';

import postRouter from './router/postRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(3000, () => console.log('http://localhost:3000'));

app.use('/post', postRouter);
