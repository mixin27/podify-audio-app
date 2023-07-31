import { NextFunction, Request, RequestHandler, Response } from "express";
import * as yup from "yup";

export const validate = (schema: any): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body)
      return res.status(422).json({ error: "Empty body is not accepted." });

    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      await schemaToValidate.validate(
        {
          body: req.body,
        },
        {
          abortEarly: true,
        }
      );

      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(422).json({ error: error.message });
      }
    }
  };
};
