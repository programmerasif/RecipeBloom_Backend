/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

//parsers
app.use(express.json());

app.use(cors({ origin: ['http://localhost:3000','http://localhost:5000','http://localhost:3001','https://recipe-bloom.vercel.app'],credentials:true }));
app.use(cookieParser())
// application routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'recipe-bloom is running ',
  });
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
