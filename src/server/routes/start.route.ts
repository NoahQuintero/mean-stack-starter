// Import only what we need from express
import { Router, Request, Response } from 'express';
import * as path from 'path';

// Assign router to the express.Router() instance
const router: Router = Router();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /
router.get('/', (req: Request, res: Response) => {
    const dir = path.resolve(__dirname, '../../client/index.html');

    res.sendFile(dir);
});

// Export the express.Router() instance to be used by server.ts
export const StartRoute: Router = router;
