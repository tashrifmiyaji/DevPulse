import app from "../src/app";

// Vercel will use the default export as the serverless handler.
// The Express `app` is a valid request handler (req, res) => void.
// Export it directly so all incoming requests are handled by the Express app.
export default app as any;
