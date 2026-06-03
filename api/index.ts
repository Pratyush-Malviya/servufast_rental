// Vercel Serverless Function Dynamic Router
export default async function handler(req: any, res: any) {
  try {
    // Try importing the server bundle
    let serverModule;
    try {
      serverModule = await import("../server");
    } catch (e1: any) {
      try {
        serverModule = await import("../server.js");
      } catch (e2: any) {
        throw new Error(`Failed to import server bundle. Path e1: ${e1.message}, Path e2: ${e2.message}`);
      }
    }

    const app = serverModule.default || serverModule;
    if (typeof app === "function" || (app && typeof app.handle === "function")) {
      return app(req, res);
    } else {
      throw new Error("Imported server module is not an executable Express application.");
    }
  } catch (err: any) {
    console.error("Vercel Serverless Exception Caught:", err);
    res.status(500).json({
      error: "Vercel Serverless Function Invocation Failure",
      message: err.message,
      stack: err.stack ? err.stack.split("\n").slice(0, 5) : null
    });
  }
}
