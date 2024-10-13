import cors from "cors";
import express, { Application } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
const app: Application = express();

//parsers
app.use(express.json());
app.set("trust proxy", true);
app.use(cookieParser());

// Allow all origins by setting origin to true
app.use(
  cors({
    origin: true, // This allows all origins
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-refresh-token",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["set-cookie"],
  }),
);

// application routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "recipe is blooming  ",
  });
});

app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
