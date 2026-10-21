import express from "express";
import cors from "cors";

// App ko alag file me rakha hai taaki tests isko bina server start kiye use kar sake
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // In-memory data (demo ke liye). Real project me yahan MongoDB aayega.
  let todos = [
    { id: 1, text: "Code GitHub pe push karo", done: true },
    { id: 2, text: "GitHub Actions test chalayega", done: true },
    { id: 3, text: "Docker image Docker Hub pe jayegi", done: false },
  ];
  let nextId = 4;

  // Health check -> Kubernetes isi se check karta hai ki app zinda hai ya nahi
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      version: process.env.APP_VERSION || "local",
      env: process.env.NODE_ENV || "development",
      time: new Date().toISOString(),
    });
  });

  app.get("/api/todos", (req, res) => res.json(todos));

  app.post("/api/todos", (req, res) => {
    const text = (req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });
    const todo = { id: nextId++, text, done: false };
    todos.push(todo);
    res.status(201).json(todo);
  });

  app.patch("/api/todos/:id", (req, res) => {
    const todo = todos.find((t) => t.id === Number(req.params.id));
    if (!todo) return res.status(404).json({ error: "not found" });
    todo.done = !todo.done;
    res.json(todo);
  });

  app.delete("/api/todos/:id", (req, res) => {
    const before = todos.length;
    todos = todos.filter((t) => t.id !== Number(req.params.id));
    if (todos.length === before) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  });

  return app;
}
