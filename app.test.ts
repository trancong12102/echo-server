import { app, EchoPayload } from "./app.ts";
import { expect } from "jsr:@std/expect";

const SERVICE = "echo-test";
Deno.env.set("SERVICE", SERVICE);

Deno.test("GET /", async () => {
  const headers = {
    "X-Custom-Header": "Hello, World!",
  };
  const res = await app.request("/", {
    headers,
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, body, service } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("GET");
  expect(body).toBeNull();
  const allLowerCaseHeaders = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]),
  );
  expect(payload.headers).toEqual(allLowerCaseHeaders);
  expect(service).toEqual(SERVICE);
});

Deno.test("GET /some/path", async () => {
  const res = await app.request("/some/path");
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, body } = payload;
  expect(path).toEqual("/some/path");
  expect(method).toEqual("GET");
  expect(body).toBeNull();
  expect(payload.headers).toEqual({});
});

Deno.test("POST / json body", async () => {
  const body = { hello: "world" };
  const res = await app.request("/", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, headers } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("POST");
  expect(payload.body).toEqual(body);
  expect(headers["content-type"]).toEqual("application/json");
});

Deno.test("POST / multipart form body", async () => {
  const body = new FormData();
  body.append("hello", "world");
  const res = await app.request("/", {
    method: "POST",
    body,
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, headers } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("POST");
  expect(payload.body).toEqual({ hello: "world" });
  expect(headers["content-type"]).toContain("multipart/form-data");
});

Deno.test("POST / form body", async () => {
  const body = new URLSearchParams();
  body.append("hello", "world");
  const res = await app.request("/", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, headers } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("POST");
  expect(payload.body).toEqual({ hello: "world" });
  expect(headers["content-type"]).toEqual("application/x-www-form-urlencoded");
});

Deno.test("POST / empty body", async () => {
  const res = await app.request("/", {
    method: "POST",
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, body } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("POST");
  expect(body).toBeNull();
  expect(payload.headers).toEqual({});
});

Deno.test("PUT /", async () => {
  const body = { hello: "world" };
  const res = await app.request("/", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, headers } = payload;
  expect(path).toEqual("/");
  expect(method).toEqual("PUT");
  expect(payload.body).toEqual(body);
  expect(headers["content-type"]).toEqual("application/json");
});

Deno.test("DELETE /abc", async () => {
  const res = await app.request("/abc", {
    method: "DELETE",
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, body } = payload;
  expect(path).toEqual("/abc");
  expect(method).toEqual("DELETE");
  expect(body).toBeNull();
  expect(payload.headers).toEqual({});
});

Deno.test("PATCH /abc", async () => {
  const body = { hello: "world" };
  const res = await app.request("/abc", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, headers } = payload;
  expect(path).toEqual("/abc");
  expect(method).toEqual("PATCH");
  expect(payload.body).toEqual(body);
  expect(headers["content-type"]).toEqual("application/json");
});

Deno.test("OPTIONS /abc", async () => {
  const res = await app.request("/abc", {
    method: "OPTIONS",
  });
  const payload: EchoPayload = await res.json();

  expect(payload).not.toBeNull();
  expect(payload).not.toBeUndefined();

  const { path, method, body } = payload;
  expect(path).toEqual("/abc");
  expect(method).toEqual("OPTIONS");
  expect(body).toBeNull();
  expect(payload.headers).toEqual({});
});
