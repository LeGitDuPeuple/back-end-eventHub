import type { NextFunction, Request, Response } from "express";

export interface JsonApiResponse {
    success: boolean;
    data: any;
    error?: {
        message: string,
        code: number
    }
}

declare module "express-serve-static-core" {
    interface Response {
        jsonSuccess(data: any, statusCode?: number): void,
        jsonError(error: any, statusCode?: number): void
    }
}

export function jsonApiResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    res.jsonSuccess = (data: any, statusCode: number = 200) => {
        const response: JsonApiResponse = {
            success: true, 
            data
        };
        res.status(statusCode).json(response)
    }

    res.jsonError = (error: any, statusCode: number = 400) => {
        const response: JsonApiResponse = {
            success: false,
            data: null,
            error: {
                message: error,
                code: statusCode
            }
        };
        res.status(statusCode).json(response)
    };
    next(); 
}