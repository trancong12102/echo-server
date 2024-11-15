import { Hono } from "hono/tiny";
import { validator } from "hono/validator";

const valueValidator = (value: unknown) =>
  !!value && Object.keys(value).length > 0;

export const app = new Hono();

export type EchoPayload = {
  url: string;
  path: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

app.all(
  "*",
  validator("form", valueValidator),
  validator("json", valueValidator),
  async (c) => {
    const { req } = c;
    const { url, path, method } = req;

    const body = await (async () => {
      const isJson = req.valid("json");
      if (isJson) {
        return await req.json();
      }

      const isForm = req.valid("form");
      if (isForm) {
        return await req.parseBody();
      }

      return null;
    })();

    return c.json<EchoPayload>({
      url,
      path,
      method,
      headers: req.header(),
      body,
    });
  },
);
