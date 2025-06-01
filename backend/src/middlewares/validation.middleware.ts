import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
      excludeExtraneousValues: true,
      enableCircularCheck: true
    });
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false }
    });

    if (errors.length > 0) {
      const errorMessages = errors.map(error => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        return ['驗證錯誤'];
      }).flat();

      console.log('驗證錯誤:', errors);
      return res.status(400).json({
        success: false,
        error: errorMessages[0]
      });
    }

    req.body = dtoObject;
    next();
  };
}; 