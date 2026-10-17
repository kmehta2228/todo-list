const KEY = "todo-list-v1";
let todos = [];
let filter = "all";

try { todos = JSON.parse(localStorage.getItem(KEY)) || []; } catch { todos = []; }

const $ = (id) => document.getElementById(id);
const save = () => localStorage.setItem(KEY, JSON.stringify(todos));

function render() {
  const shown = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done);

  $("list").innerHTML = "";
  for (const t of shown) {
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = t.done;
    box.onchange = () => { t.done = box.checked; save(); render(); };

    const label = document.createElement("span");
    label.textContent = t.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "×";
    del.title = "Delete";
    del.onclick = () => { todos = todos.filter((x) => x.id !== t.id); save(); render(); };

    li.append(box, label, del);
    $("list").append(li);
  }

  const left = todos.filter((t) => !t.done).length;
  $("count").textContent = `${left} item${left === 1 ? "" : "s"} left`;
  document.querySelectorAll("#filters button").forEach((b) =>
    b.classList.toggle("active", b.dataset.filter === filter));
}

$("add-form").onsubmit = (e) => {
  e.preventDefault();
  const text = $("new-task").value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  $("new-task").value = "";
  save();
  render();
};

document.querySelectorAll("#filters button").forEach((b) =>
  b.onclick = () => { filter = b.dataset.filter; render(); });

$("clear-done").onclick = () => { todos = todos.filter((t) => !t.done); save(); render(); };

render();
