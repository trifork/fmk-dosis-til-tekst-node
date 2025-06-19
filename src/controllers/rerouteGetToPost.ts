import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';


export async function rerouteGetToPost(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    // We expose many services in both a GET and a POST variant. GET variants in order to support standard HTTP caching. 
    // This middleware handler does the following: 
    // 1. Change http method from GET to POST
    // 2. Moves query parameters to request body
    // 3. Sets an apropriate cache control header
    // 4. Restarts Express routing with the modified request. 
    // The benefit of this approach is that we get detailed TSOA validation logic applied to GET requests with query parameters. 
    try {
        req.method = "POST";
        req.body = req.query;
        if (req.query) {
            let dosageJson = req.query.dosageJson;
            if (!dosageJson) {
                throw Error("dosageJson parameter is mandatory");
            }
            if (Array.isArray(dosageJson)) {
                throw new Error("Only one dosageJson parameter allowed");
            }
            req.body = { dosage: JSON.parse(decodeURIComponent(dosageJson as string)) }
            if (req.query.options) {
                req.body.options = req.query.options;
            }
            if (req.query.maxLength) {
                req.body.maxLength = req.query.maxLength;
            }
        }
        // Clear query parameters: 
        Object.keys(req.query).forEach(key => delete req.query[key]);
        next();
    } catch (err) {
        // Unexpected error (e.g., parsing failure)
        next(err); // Let Express global error handler deal with it
    }
}
