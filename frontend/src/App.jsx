import { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    joiningDate: "",
    department: "IT"
  });
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const completed = useMemo(
    () => current?.tasks?.filter((task) => task.status === "Completed").length || 0,
    [current]
  );

  const loadHistory = async () => {
    const res = await fetch(`${API}/checklists`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory().catch(() => setMessage("Could not connect to backend."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateChecklist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/checklists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setCurrent(data);
      setMessage("Checklist generated successfully.");
      await loadHistory();
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const res = await fetch(`${API}/checklists/${current._id}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCurrent(data);
      await loadHistory();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const openHistory = async (id) => {
    const res = await fetch(`${API}/checklists/${id}`);
    const data = await res.json();
    setCurrent(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <div className="eyebrow">HR AUTOMATION</div>
          <h1>OnboardFlow</h1>
          <p>Automated employee onboarding checklist generator</p>
        </div>
        <div className="hero-badge">Employee Onboarding</div>
      </header>

      <main className="container">
        <section className="grid">
          <div className="card">
            <div className="section-title">
              <div>
                <span className="step">01</span>
                <h2>Employee Details</h2>
              </div>
              <span className="muted">Enter employee information</span>
            </div>

            <form onSubmit={generateChecklist}>
              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rohit Sutar"
                  required
                />
              </label>
              <label>
                Employee ID
                <input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@company.com"
                  required
                />
              </label>
              <label>
                Joining Date
                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Department
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option>IT</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                </select>
              </label>
              <button className="primary" disabled={loading}>
                {loading ? "Generating..." : "Generate Checklist →"}
              </button>
            </form>

            {message && <div className="message">{message}</div>}
          </div>

          <div className="card checklist-card">
            <div className="section-title">
              <div>
                <span className="step">02</span>
                <h2>Generated Checklist</h2>
              </div>
              {current && (
                <span className="progress">
                  {completed}/{current.tasks.length} completed
                </span>
              )}
            </div>

            {!current ? (
              <div className="empty">
                <div className="empty-icon">✓</div>
                <h3>No checklist yet</h3>
                <p>
                  Enter employee details and generate a department-based
                  onboarding checklist.
                </p>
              </div>
            ) : (
              <>
                <div className="employee-summary">
                  <div>
                    <strong>{current.employee.name}</strong>
                    <span>{current.employee.employeeId}</span>
                  </div>
                  <span className="department">
                    {current.employee.department}
                  </span>
                </div>
                <div className="tasks">
                  {current.tasks.map((task, index) => (
                    <div
                      className={`task ${task.status === "Completed" ? "done" : ""}`}
                      key={task.id}
                    >
                      <div className="task-number">{index + 1}</div>
                      <div className="task-content">
                        <strong>{task.title}</strong>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateStatus(task.id, e.target.value)
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="card history-card">
          <div className="section-title">
            <div>
              <span className="step">03</span>
              <h2>Checklist History</h2>
            </div>
            <span className="muted">{history.length} saved checklist(s)</span>
          </div>

          {history.length === 0 ? (
            <p className="muted">Generated checklists will appear here.</p>
          ) : (
            <div className="history-list">
              {history.map((item) => {
                const done = item.tasks.filter(
                  (t) => t.status === "Completed",
                ).length;
                return (
                  <button
                    className="history-item"
                    key={item._id}
                    onClick={() => openHistory(item._id)}
                  >
                    <div>
                      <strong>{item.employee.name}</strong>
                      <span>
                        {item.employee.employeeId} · {item.employee.department}
                      </span>
                    </div>
                    <div className="history-right">
                      <span>
                        {done}/{item.tasks.length} done
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer>
        OnboardFlow · Full-Stack College Project · React + Node.js + MongoDB
      </footer>
    </div>
  );
}

export default App;
