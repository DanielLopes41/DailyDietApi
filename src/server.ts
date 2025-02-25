import { app } from "./app";

const port = 3000;

app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`http://localhost:${port}`);
});
