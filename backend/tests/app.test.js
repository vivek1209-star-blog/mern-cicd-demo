// Node ka built-in test runner (koi extra library nahi chahiye)
// GitHub Actions me CI step yahi tests chalata hai. Ek bhi fail => pipeline STOP.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test("GET /api/health returns ok", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /api/todos returns a list", async () => {
  const res = await fetch(`${base}/api/todos`);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 1);
});

test("POST /api/todos creates a todo", async () => {
  const res = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Kubernetes seekhna hai" }),
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.text, "Kubernetes seekhna hai");
  assert.equal(body.done, false);
});

test("POST /api/todos without text gives 400", async () => {
  const res = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});
