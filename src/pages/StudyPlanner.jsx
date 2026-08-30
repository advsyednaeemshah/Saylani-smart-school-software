import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Plus,
  Trash2,
} from "lucide-react";

const starterTasks = [
  {
    id: 1,
    title: "Complete algebra exercises",
    subject: "Mathematics",
    priority: "High",
    deadline: "2026-09-02",
    status: "In Progress",
    progress: 50,
  },
  {
    id: 2,
    title: "Read chapter five",
    subject: "English",
    priority: "Medium",
    deadline: "2026-09-04",
    status: "Pending",
    progress: 0,
  },
  {
    id: 3,
    title: "Prepare science presentation",
    subject: "Science",
    priority: "High",
    deadline: "2026-09-06",
    status: "Completed",
    progress: 100,
  },
];

const emptyTask = {
  title: "",
  subject: "",
  priority: "Medium",
  deadline: "",
};

function StudyPlanner() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eduverse-study-tasks")) || starterTasks;
    } catch {
      return starterTasks;
    }
  });
  const [form, setForm] = useState(emptyTask);
  const [view, setView] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("eduverse-study-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "All") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const completed = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter((task) => task.status === "In Progress").length;
  const totalProgress = tasks.length
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  const addTask = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.subject.trim() || !form.deadline) {
      setMessage("Please complete every task field.");
      return;
    }

    setTasks([
      {
        id: Date.now(),
        ...form,
        status: "Pending",
        progress: 0,
      },
      ...tasks,
    ]);
    setForm(emptyTask);
    setMessage("Study task added successfully.");
    setView("dashboard");
  };

  const advanceTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== id) return task;
        if (task.status === "Pending") {
          return { ...task, status: "In Progress", progress: 50 };
        }
        if (task.status === "In Progress") {
          return { ...task, status: "Completed", progress: 100 };
        }
        return { ...task, status: "Pending", progress: 0 };
      })
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortedCalendarTasks = [...tasks].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  return (
    <main className="planner-page">
      <section className="planner-hero">
        <div className="container planner-hero-content">
          <div>
            <span className="task-label">TASK 03 · PRODUCTIVITY</span>
            <h1>Plan better. Study smarter.</h1>
            <p>
              Organize schoolwork, manage deadlines, and monitor learning
              progress from one focused student dashboard.
            </p>
          </div>
          <div className="planner-progress-ring">
            <strong>{totalProgress}%</strong>
            <span>Overall progress</span>
          </div>
        </div>
      </section>

      <div className="container planner-content">
        <nav className="planner-tabs">
          <button
            className={view === "dashboard" ? "active" : ""}
            onClick={() => setView("dashboard")}
          >
            <ListTodo /> Dashboard
          </button>
          <button
            className={view === "add" ? "active" : ""}
            onClick={() => {
              setView("add");
              setMessage("");
            }}
          >
            <Plus /> Add Task
          </button>
          <button
            className={view === "calendar" ? "active" : ""}
            onClick={() => setView("calendar")}
          >
            <CalendarDays /> Calendar
          </button>
        </nav>

        {view === "dashboard" && (
          <>
            <section className="planner-stats">
              <article><ListTodo /><strong>{tasks.length}</strong><span>Total Tasks</span></article>
              <article><Clock3 /><strong>{inProgress}</strong><span>In Progress</span></article>
              <article><CheckCircle2 /><strong>{completed}</strong><span>Completed</span></article>
              <article><BookOpenCheck /><strong>{totalProgress}%</strong><span>Progress</span></article>
            </section>

            <section className="planner-dashboard">
              <article className="content-card">
                <div className="planner-list-heading">
                  <div>
                    <span>MY STUDY PLAN</span>
                    <h2>Upcoming tasks</h2>
                  </div>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>All</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="study-task-list">
                  {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                      <ListTodo />
                      <h3>No study tasks</h3>
                      <p>Add a task to begin planning.</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div className="study-task" key={task.id}>
                        <button
                          className={`task-check ${task.status === "Completed" ? "done" : ""}`}
                          onClick={() => advanceTask(task.id)}
                          title="Change task status"
                        >
                          {task.status === "Completed" ? <CheckCircle2 /> : <Circle />}
                        </button>

                        <div className="study-task-main">
                          <div className="study-task-top">
                            <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            <span className="subject-tag">{task.subject}</span>
                          </div>
                          <h3>{task.title}</h3>
                          <div className="task-deadline">
                            <CalendarDays /> Due {task.deadline}
                          </div>
                          <div className="progress-track">
                            <span style={{ width: `${task.progress}%` }} />
                          </div>
                          <small>{task.status} · {task.progress}%</small>
                        </div>

                        <button
                          className="planner-delete"
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>

              <aside className="planner-side-card">
                <span>WEEKLY FOCUS</span>
                <h2>Stay consistent</h2>
                <p>Complete a little every day instead of waiting for the deadline.</p>
                <div className="week-bars">
                  {[45, 70, 35, 90, 60, 30, 15].map((height, index) => (
                    <div key={index}>
                      <span style={{ height: `${height}%` }} />
                      <small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small>
                    </div>
                  ))}
                </div>
                <button onClick={() => setView("add")}><Plus /> Add New Task</button>
              </aside>
            </section>
          </>
        )}

        {view === "add" && (
          <section className="planner-form-wrapper">
            <article className="content-card planner-form-card">
              <span className="planner-kicker">NEW STUDY TASK</span>
              <h2>What do you need to complete?</h2>
              <p>Add the task information and Saylani Smart School will include it in your plan.</p>

              <form className="school-form" onSubmit={addTask}>
                <label>
                  Task title *
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Example: Revise chapter three"
                  />
                </label>

                <div className="form-row">
                  <label>
                    Subject *
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Example: Science"
                    />
                  </label>
                  <label>
                    Priority
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                </div>

                <label>
                  Deadline *
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </label>

                {message && (
                  <p className={message.includes("successfully") ? "form-success" : "form-error"}>
                    {message}
                  </p>
                )}

                <button className="planner-main-button" type="submit">
                  <Plus /> Add to Study Plan
                </button>
              </form>
            </article>
          </section>
        )}

        {view === "calendar" && (
          <section className="content-card calendar-view">
            <div className="planner-list-heading">
              <div>
                <span>DEADLINE TIMELINE</span>
                <h2>Study calendar</h2>
              </div>
              <CalendarDays />
            </div>

            <div className="calendar-task-list">
              {sortedCalendarTasks.map((task) => (
                <article key={task.id}>
                  <div className="calendar-date">
                    <strong>{new Date(`${task.deadline}T00:00:00`).getDate()}</strong>
                    <span>
                      {new Date(`${task.deadline}T00:00:00`).toLocaleString("en", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="subject-tag">{task.subject}</span>
                    <h3>{task.title}</h3>
                    <p>{task.status} · {task.priority} priority</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default StudyPlanner;

