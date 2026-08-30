import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  PlusCircle,
  Trash2,
} from "lucide-react";
import api from "../api";

const blankForm = {
  name: "",
  studentClass: "",
  category: "Academic",
  title: "",
  description: "",
};

const statusOrder = ["Pending", "In Progress", "Resolved"];

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ComplaintPortal() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState("");

  useEffect(() => {
    let active = true;

    const loadComplaints = async () => {
      try {
        setLoading(true);
        const response = await api.get("/complaints");

        if (active) {
          setComplaints(response.data);
        }
      } catch (error) {
        if (active) {
          setMessage(
            getErrorMessage(error, "Unable to load complaints from the server.")
          );
          setMessageType("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadComplaints();

    return () => {
      active = false;
    };
  }, []);

  const visibleComplaints = useMemo(() => {
    if (filter === "All") return complaints;

    return complaints.filter(
      (complaint) => complaint.status === filter
    );
  }, [complaints, filter]);

  const countStatus = (status) =>
    complaints.filter((complaint) => complaint.status === status).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const submitComplaint = async (event) => {
    event.preventDefault();
    setMessage("");

    const payload = {
      name: form.name.trim(),
      studentClass: form.studentClass.trim(),
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim(),
    };

    if (
      !payload.name ||
      !payload.studentClass ||
      !payload.title ||
      !payload.description
    ) {
      setMessage("Please complete all required fields.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/complaints", payload);

      setComplaints((currentComplaints) => [
        response.data,
        ...currentComplaints,
      ]);

      setForm(blankForm);
      setMessage(
        `Complaint submitted successfully. Tracking ID: ${response.data.trackingId}`
      );
      setMessageType("success");
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Unable to submit the complaint.")
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (complaint) => {
    const currentIndex = statusOrder.indexOf(complaint.status);
    const nextStatus =
      statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      setActiveComplaint(complaint._id);
      setMessage("");

      const response = await api.put(
        `/complaints/${complaint._id}`,
        { status: nextStatus }
      );

      setComplaints((currentComplaints) =>
        currentComplaints.map((item) =>
          item._id === complaint._id ? response.data : item
        )
      );

      setMessage(`Status updated to ${nextStatus}.`);
      setMessageType("success");
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Unable to update complaint status.")
      );
      setMessageType("error");
    } finally {
      setActiveComplaint("");
    }
  };

  const removeComplaint = async (complaint) => {
    const confirmed = window.confirm(
      `Delete complaint ${complaint.trackingId || ""}?`
    );

    if (!confirmed) return;

    try {
      setActiveComplaint(complaint._id);
      setMessage("");

      await api.delete(`/complaints/${complaint._id}`);

      setComplaints((currentComplaints) =>
        currentComplaints.filter(
          (item) => item._id !== complaint._id
        )
      );

      setMessage("Complaint deleted successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Unable to delete the complaint.")
      );
      setMessageType("error");
    } finally {
      setActiveComplaint("");
    }
  };

  return (
    <main className="task-page complaint-theme">
      <section className="task-hero">
        <div className="container task-hero-content">
          <div>
            <span className="task-label">
              TASK 01 · STUDENT SERVICES
            </span>

            <h1>School Complaint Portal</h1>

            <p>
              A transparent place for students to report concerns and
              follow every complaint from submission to resolution.
            </p>
          </div>

          <div className="hero-symbol">
            <ClipboardList />
          </div>
        </div>
      </section>

      <div className="container task-content">
        <section className="dashboard-stats">
          <article>
            <span className="stat-symbol total">
              <ClipboardList />
            </span>

            <div>
              <strong>{complaints.length}</strong>
              <span>Total Complaints</span>
            </div>
          </article>

          <article>
            <span className="stat-symbol pending">
              <Clock3 />
            </span>

            <div>
              <strong>{countStatus("Pending")}</strong>
              <span>Pending</span>
            </div>
          </article>

          <article>
            <span className="stat-symbol progress">
              <AlertCircle />
            </span>

            <div>
              <strong>{countStatus("In Progress")}</strong>
              <span>In Progress</span>
            </div>
          </article>

          <article>
            <span className="stat-symbol resolved">
              <CheckCircle2 />
            </span>

            <div>
              <strong>{countStatus("Resolved")}</strong>
              <span>Resolved</span>
            </div>
          </article>
        </section>

        <section className="complaint-layout">
          <article className="content-card complaint-form-card">
            <div className="card-heading">
              <div>
                <span>NEW REQUEST</span>
                <h2>Submit a complaint</h2>
              </div>

              <PlusCircle />
            </div>

            <form
              onSubmit={submitComplaint}
              className="school-form"
            >
              <div className="form-row">
                <label>
                  Student name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={submitting}
                  />
                </label>

                <label>
                  Class *
                  <input
                    name="studentClass"
                    value={form.studentClass}
                    onChange={handleChange}
                    placeholder="Example: Class 10-A"
                    disabled={submitting}
                  />
                </label>
              </div>

              <label>
                Complaint category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option>Academic</option>
                  <option>Facilities</option>
                  <option>Transport</option>
                  <option>Bullying</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Complaint title *
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Write a short title"
                  disabled={submitting}
                />
              </label>

              <label>
                Description *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Explain the issue clearly..."
                  disabled={submitting}
                />
              </label>

              {message && (
                <p
                  className={
                    messageType === "success"
                      ? "form-success"
                      : "form-error"
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="task-button"
                disabled={submitting}
              >
                <PlusCircle />
                {submitting
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>
            </form>
          </article>

          <article className="content-card status-card">
            <div className="card-heading status-heading">
              <div>
                <span>LIVE DATABASE TRACKING</span>
                <h2>Complaint status</h2>
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value)
                }
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <div className="complaint-list">
              {loading ? (
                <div className="empty-state">
                  <Clock3 />
                  <h3>Loading complaints</h3>
                  <p>Retrieving your records from MongoDB...</p>
                </div>
              ) : visibleComplaints.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList />
                  <h3>No complaints found</h3>
                  <p>
                    There are no complaints under this status.
                  </p>
                </div>
              ) : (
                visibleComplaints.map((complaint) => (
                  <div
                    className="complaint-item"
                    key={complaint._id}
                  >
                    <div className="complaint-item-top">
                      <span
                        className={`status-badge ${complaint.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>

                      <span className="complaint-date">
                        {complaint.trackingId} ·{" "}
                        {formatDate(complaint.createdAt)}
                      </span>
                    </div>

                    <h3>{complaint.title}</h3>
                    <p>{complaint.description}</p>

                    <div className="complaint-meta">
                      <span>{complaint.name}</span>
                      <span>{complaint.studentClass}</span>
                      <span>{complaint.category}</span>
                    </div>

                    <div className="complaint-actions">
                      <button
                        type="button"
                        onClick={() => changeStatus(complaint)}
                        disabled={
                          activeComplaint === complaint._id
                        }
                      >
                        {activeComplaint === complaint._id
                          ? "Updating..."
                          : "Change Status"}
                      </button>

                      <button
                        type="button"
                        className="delete-action"
                        onClick={() =>
                          removeComplaint(complaint)
                        }
                        disabled={
                          activeComplaint === complaint._id
                        }
                        aria-label="Delete complaint"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default ComplaintPortal;

