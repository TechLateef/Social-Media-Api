import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class RequireFieldHandler {
    // Method to validate required fields
    static Requiredfield<T>(req: Request, res: Response, requiredFields: Array<keyof T>): void | Response {
        // Filter to find missing fields
        const missingFields = requiredFields.filter((field) => !(field in req.body));

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
            return res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
        }
    }
}
