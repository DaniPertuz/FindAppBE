import { NextFunction, Request, Response } from 'express';
import * as express from 'express';

export function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.originalUrl.startsWith('/api/payments/webhook')) {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
}
