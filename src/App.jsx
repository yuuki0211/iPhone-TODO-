import { useState, useRef, useEffect } from "react";

const TASKS_KEY = "handwritten_tasks";

const paperTexture = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E`;

const COLORS = ["#f9e4b7", "#c8e6c9", "#f8bbd0", "#bbdefb", "#e1bee7"];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function WiggleLine({ width = "100%", color = "#888", opacity = 0.35, mt = 8 }) {
  const id = useRef(`wiggle-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg
      width={width}
      height="8"
      style={{ display: "block", marginTop: mt, marginBottom: 2, opacity }}
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
    >
      <path
        d="M0,4 Q10,1 20,4 Q30,7 40,4 Q50,1 60,4 Q70,7 80,4 Q90,1 100,4 Q110,7 120,4 Q130,1 140,4 Q150,7 160,4 Q170,1 180,4 Q190,7 200,4"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      aria-label={checked ? "完了解除" : "完了にする"}
      style={{
        width: 28,
        height: 28,
        borderRadius: 4,
        border: "2.5px solid #5a4a3a",
        background: checked ? "#5a4a3a" : "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.18s",
        boxShadow: checked ? "2px 2px 0 #b5a080" : "none",
        transform: "rotate(-1deg)",
        outline: "none",
      }}
    >
      {checked && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2.5 8.5 Q5 11.5 7 13 Q10 8 14 3"
            stroke="#f5f0e8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const rot = useRef((Math.random() - 0.5) * 1.2).current;

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px 10px",
        marginBottom: 10,
        background: task.color,
        borderRadius: 6,
        border: "1.5px solid #c8b89a",
        boxShadow: hovered
          ? "4px 5px 0 #b5a080, 0 0 0 1.5px #c8b89a"
          : "2px 3px 0 #c8b89a",
        transform: `rotate(${rot}deg) ${hovered ? "scale(1.02)" : "scale(1)"}`,
        transition: "box-shadow 0.15s, transform 0.15s",
        position: "relative",
        cursor: "default",
      }}
    >
      <Checkbox checked={task.done} onChange={() => onToggle(task.id)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 20,
            color: task.done ? "#a89880" : "#2d221a",
            textDecoration: task.done ? "line-through" : "none",
            margin: 0,
            lineHeight: 1.4,
            wordBreak: "break-word",
            transition: "color 0.2s",
          }}
        >
          {task.text}
        </p>
        <WiggleLine color="#8b7355" opacity={0.25} mt={4} />
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 13,
            color: "#b0997a",
            marginTop: 2,
            display: "block",
          }}
        >
          {task.date}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        aria-label="削除"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#c87070",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
          fontSize: 20,
          lineHeight: 1,
          padding: "0 2px",
          fontFamily: "'Caveat', cursive",
          flexShrink: 0,
        }}
        tabIndex={hovered ? 0 : -1}
      >
        ✕
      </button>
    </li>
  );
}

function AddTaskForm({ onAdd }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#fff9ee",
        border: "2px dashed #c8b89a",
        borderRadius: 8,
        padding: "16px 18px 14px",
        marginBottom: 28,
        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <label
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 17,
          color: "#7a5c3a",
          marginBottom: 2,
        }}
      >
        ✏️ 新しいタスクを書く...
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="ここに書いてね"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 20,
          color: "#2d221a",
          background: "transparent",
          border: "none",
          borderBottom: "2px solid #c8b89a",
          outline: "none",
          resize: "none",
          width: "100%",
          padding: "4px 0",
          lineHeight: 1.5,
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={!value.trim()}
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 18,
            background: "#5a4a3a",
            color: "#f5f0e8",
            border: "none",
            borderRadius: 6,
            padding: "8px 26px",
            cursor: value.trim() ? "pointer" : "not-allowed",
            boxShadow: value.trim() ? "3px 3px 0 #b5a080" : "none",
            transform: value.trim() ? "rotate(-0.5deg)" : "none",
            transition: "all 0.15s",
            opacity: value.trim() ? 1 : 0.5,
          }}
        >
          追加する →
        </button>
      </div>
    </form>
  );
}

function FilterTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 17,
        background: active ? "#5a4a3a" : "transparent",
        color: active ? "#f5f0e8" : "#8b7355",
        border: "1.5px solid #c8b89a",
        borderRadius: 20,
        padding: "5px 18px",
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: active ? "2px 2px 0 #b5a080" : "none",
        transform: active ? "rotate(-0.5deg)" : "none",
      }}
    >
      {label}
    </button>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(text) {
    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setTasks((prev) => [
      { id: Date.now(), text, done: false, color: getRandomColor(), date },
      ...prev,
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = tasks.filter((t) => {
    if (filter === "todo") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          min-height: 100vh;
          background: #ede8df;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              rgba(180,160,120,0.13) 31px,
              rgba(180,160,120,0.13) 32px
            ),
            url("${paperTexture}");
          font-family: 'Caveat', cursive;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #c8b89a; border-radius: 3px; }
        ul { list-style: none; }
      `}</style>

      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "40px 20px 60px",
        }}
      >
        <div style={{ marginBottom: 32, position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              background: "#f5f0e8",
              border: "2px solid #5a4a3a",
              borderRadius: 6,
              padding: "8px 20px 6px",
              boxShadow: "4px 4px 0 #5a4a3a",
              transform: "rotate(-1deg)",
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 38,
                fontWeight: 700,
                color: "#2d221a",
                letterSpacing: 1,
              }}
            >
              📝 My To-Do
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 17,
              color: "#8b7355",
              marginLeft: 8,
            }}
          >
            {tasks.length === 0
              ? "タスクはまだないよ。追加してみよう！"
              : `全${tasks.length}件 ・ 完了${doneCount}件`}
          </p>
          <WiggleLine color="#5a4a3a" opacity={0.18} mt={10} />
        </div>

        <AddTaskForm onAdd={addTask} />

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <FilterTab label="すべて" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterTab label="未完了" active={filter === "todo"} onClick={() => setFilter("todo")} />
          <FilterTab label="完了済み" active={filter === "done"} onClick={() => setFilter("done")} />
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              fontFamily: "'Caveat', cursive",
              fontSize: 20,
              color: "#b0997a",
            }}
          >
            {filter === "done"
              ? "まだ完了したタスクがないよ 🌱"
              : filter === "todo"
              ? "やることは全部終わった！🎉"
              : "タスクを追加してみよう ✨"}
          </div>
        ) : (
          <ul>
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}

        {tasks.length > 0 && (
          <p
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 15,
              color: "#c8b89a",
              textAlign: "center",
              marginTop: 32,
            }}
          >
            ← タスクにカーソルを当てると削除ボタンが出るよ
          </p>
        )}
      </div>
    </>
  );
}