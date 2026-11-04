import next from "next";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
const dir = fileURLToPath(new URL("../", import.meta.url));
process.chdir(dir);
process.env.PETAL_APP_ROOT = dir;
const port = Number(process.env.PETAL_PORT || 8766);
const app = next({ dev: false, dir, hostname: "127.0.0.1", port });
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((request, response) => {
  handler(request, response).catch((error) => {
    console.error("Petal request failed", error);
    if (!response.headersSent) {
      response.statusCode = 500;
      response.end(
        "Petal could not handle this request. See the local server log.",
      );
    } else response.destroy(error);
  });
});
server.on("error", (error) => {
  console.error("Petal server failed", error);
  process.exit(1);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Petal listening at http://127.0.0.1:${port}`),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
