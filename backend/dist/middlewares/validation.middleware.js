"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validateDto = (dtoClass) => {
    return async (req, res, next) => {
        const dtoObject = (0, class_transformer_1.plainToInstance)(dtoClass, req.body, {
            enableImplicitConversion: true,
            exposeDefaultValues: true,
            excludeExtraneousValues: true,
            enableCircularCheck: true
        });
        const errors = await (0, class_validator_1.validate)(dtoObject, {
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
exports.validateDto = validateDto;
