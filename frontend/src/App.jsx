import { useEffect, useState } from "react";

const STEPS = ["Push", "Test", "Docker Image", "Docker Hub", "Kubernetes", "Live"];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [t, h] = await Promise.all([
        fetch("/api/todos").then((r) => r.json()),
        fetch("/api/health").then((r) => r.json()),
      ]);
      setTodos(t);
      setHealth(h);
      setError("");
    } catch {
      setError("Backend se connect nahi ho paya. Kya backend chal raha hai?");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const todo = await res.json();
    setTodos((prev) => [...prev, todo]);
    setText("");
  }

  async function toggle(id) {
    const res = await fetch(`/api/todos/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function remove(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="page">
      <header className="hero">
        <span className="badge">
          <span className={`dot ${health ? "on" : ""}`} />
          {health ? `API ${health.status} · v${health.version} · ${health.env}` : "API connecting…"}
        </span>
        <h1>
          My <span className="grad">CI/CD</span> Todo
        </h1>
        <p className="sub">React + Node · Docker · GitHub Actions · Kubernetes</p>

        <div className="track">
          {STEPS.map((s, i) => (
            <div key={s} className="step" style={{ animationDelay: `${i * 0.35}s` }}>
              <div className="ball">{i + 1}</div>
              <small>{s}</small>
            </div>
          ))}
        </div>
      </header>

      <main className="card">
        {error && <div className="error">{error}</div>}

        <form onSubmit={addTodo} className="row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Naya kaam likho… (e.g. Docker seekhna)"
          />
          <button type="submit">Add</button>
        </form>

        <div className="progress">
          <div style={{ width: todos.length ? `${(doneCount / todos.length) * 100}%` : 0 }} />
        </div>
        <p className="meta">
          {doneCount}/{todos.length} done
        </p>

        <ul>
          {todos.map((t) => (
            <li key={t.id} className={t.done ? "done" : ""}>
              <button className="check" onClick={() => toggle(t.id)} aria-label="toggle">
                {t.done ? "✓" : ""}
              </button>
              <span>{t.text}</span>
              <button className="del" onClick={() => remove(t.id)} aria-label="delete">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer>Change karo → git push → pipeline khud deploy karegi 🚀</footer>
    </div>
  );
}
