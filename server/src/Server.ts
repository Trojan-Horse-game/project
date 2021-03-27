import helmet from "helmet";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "demo")));

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

// Export express instance
export default app;
