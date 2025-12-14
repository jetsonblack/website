// <!-- 
// ___________________________________________________________________________

//                             copyright © 2024 Jetson Black
//                             x.com/jetsonbb
//                             http://jetsonblack.com/

//                             just a simple page for myself!
// ___________________________________________________________________________
// -->
import { useEffect, useMemo, useState, useCallback } from "react";

const STORAGE_KEY = "persistent_todos_v1";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PersistentTodo
 * Props:
 *   initialItems?: string[]  // optional seed on first run
 *   title?: string
 */
export default function PersistentTodo({ initialItems = [], title = "Things to Do" }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      // seed from props (first run only)
      if (initialItems.length) {
        return initialItems.map((t) => ({
          id: uid(),
          text: t,
          done: false,
          createdAt: Date.now(),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [draft, setDraft] = useState("");

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [{ id: uid(), text, done: false, createdAt: Date.now() }, ...prev]);
    setDraft("");
  }, [draft]);

  const toggleItem = useCallback((id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const editItem = useCallback((id, text) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, text: text.trim() || it.text } : it))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((it) => !it.done));
  }, []);

  const stats = useMemo(() => {
    const total = items.length || 1;
    const done = items.filter((i) => i.done).length;
    const pct = Math.round((done / total) * 100);
    return { total: items.length, done, pct, remaining: items.length - done };
  }, [items]);

  return (
    <div className="todo-card">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: ".5rem" }}>
        <h4 className="todo-title" style={{ margin: 0 }}>{title}</h4>
        <span style={{ fontSize: ".85rem", opacity: .85 }}>
          {stats.done}/{stats.total || 0} done • {stats.pct}%
        </span>
      </div>

      {/* progress bar */}
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
        aria-label="progress"
      >
        <div
          style={{
            width: `${stats.pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, rgba(255,255,255,.7), rgba(255,255,255,.25))",
          }}
        />
      </div>

      {/* add input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add a task and press Enter…"
          aria-label="Add todo"
          style={{
            flex: 1,
            padding: ".7rem .9rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: ".7rem 1rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.09)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <ul className="todo-list">
        {items.map((it) => (
          <TodoRow
            key={it.id}
            item={it}
            onToggle={() => toggleItem(it.id)}
            onRemove={() => removeItem(it.id)}
            onEdit={(txt) => editItem(it.id, txt)}
          />
        ))}
      </ul>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", gap: 8 }}>
        <span style={{ fontSize: ".9rem", opacity: .8 }}>
          {stats.remaining} remaining
        </span>
        <button
          onClick={clearCompleted}
          style={{
            padding: ".55rem .8rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}

function TodoRow({ item, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const commit = useCallback(() => {
    setEditing(false);
    if (text.trim() !== item.text.trim()) onEdit(text);
  }, [text, item.text, onEdit]);

  return (
    <li className={item.done ? "todo-done" : undefined} style={{ display: "grid", gridTemplateColumns: "28px 1fr auto", alignItems: "center", gap: "10px" }}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        aria-label="toggle"
        style={{ width: 18, height: 18, cursor: "pointer" }}
      />
      {!editing ? (
        <div
          onDoubleClick={() => setEditing(true)}
          style={{ userSelect: "none", lineHeight: 1.35, cursor: "text" }}
          title="Double-click to edit"
        >
          {item.text}
        </div>
      ) : (
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => (e.key === "Enter" ? commit() : e.key === "Escape" ? (setText(item.text), setEditing(false)) : null)}
          autoFocus
          style={{
            padding: ".45rem .6rem",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            outline: "none",
          }}
        />
      )}
      <button
        onClick={onRemove}
        aria-label="delete"
        title="Delete"
        style={{
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          borderRadius: 8,
          padding: ".35rem .6rem",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </li>
  );
}
