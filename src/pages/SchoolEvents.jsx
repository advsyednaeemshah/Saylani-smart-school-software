import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  TicketCheck,
  Users,
  X,
} from "lucide-react";
import api from "../api";

const blankForm = {
  name: "",
  email: "",
  studentClass: "",
};

function getErrorMessage(error, fallback) {
  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error.response?.status === 500) {
    return "You may already be registered for this event.";
  }

  return error.response?.data?.message || fallback;
}

function getRegistrationEventId(registration) {
  if (
    registration.event &&
    typeof registration.event === "object"
  ) {
    return registration.event._id;
  }

  return registration.event;
}

function SchoolEvents() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let active = true;

    const loadEventData = async () => {
      try {
        setLoading(true);
        setPageError("");

        const [eventsResponse, registrationsResponse] =
          await Promise.all([
            api.get("/events"),
            api.get("/registrations"),
          ]);

        if (active) {
          setEvents(eventsResponse.data);
          setRegistrations(registrationsResponse.data);
        }
      } catch (error) {
        if (active) {
          setPageError(
            getErrorMessage(
              error,
              "Unable to load events from the server."
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEventData();

    return () => {
      active = false;
    };
  }, []);

  const registeredEventIds = useMemo(() => {
    return new Set(
      registrations
        .map(getRegistrationEventId)
        .filter(Boolean)
        .map(String)
    );
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" || event.category === category;

      const matchesSearch =
        event.title.toLowerCase().includes(normalizedSearch) ||
        event.venue.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [events, search, category]);

  const isRegistered = (event) =>
    registeredEventIds.has(String(event._id));

  const openRegistration = (event) => {
    setSelectedEvent(null);
    setMessage("");
    setMessageType("");

    if (isRegistered(event)) {
      setRegistering(event);
      setMessage("You are already registered for this event.");
      setMessageType("success");
      return;
    }

    setRegistering(event);
    setForm(blankForm);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const submitRegistration = async (submitEvent) => {
    submitEvent.preventDefault();
    setMessage("");

    const payload = {
      eventId: registering._id,
      name: form.name.trim(),
      email: form.email.trim(),
      studentClass: form.studentClass.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.studentClass
    ) {
      setMessage("Please complete all registration fields.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/registrations",
        payload
      );

      setRegistrations((currentRegistrations) => [
        ...currentRegistrations,
        response.data,
      ]);

      setForm(blankForm);
      setMessage("Registration completed successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        getErrorMessage(
          error,
          "Unable to complete the registration."
        )
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const featuredEvent = events[0];

  return (
    <main className="events-page">
      <section className="events-hero">
        <div className="container events-hero-grid">
          <div>
            <span className="task-label">
              TASK 02 · SCHOOL COMMUNITY
            </span>

            <h1>
              Learn. Connect.
              <br />
              <span>Celebrate together.</span>
            </h1>

            <p>
              Discover upcoming school programs, competitions,
              festivals, and learning opportunities created for
              every student.
            </p>
          </div>

          <div className="event-highlight">
            <span className="highlight-date">
              <strong>
                {featuredEvent?.date?.split(" ")[1]?.replace(",", "") ||
                  "18"}
              </strong>
              <small>
                {featuredEvent?.date
                  ?.split(" ")[0]
                  ?.slice(0, 3)
                  ?.toUpperCase() || "SEP"}
              </small>
            </span>

            <div>
              <small>FEATURED EVENT</small>
              <h3>
                {featuredEvent?.title ||
                  "Annual Science Exhibition"}
              </h3>

              <p>
                <MapPin />
                {featuredEvent?.venue ||
                  "Main School Auditorium"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container events-content">
        <section className="events-summary">
          <div>
            <CalendarDays />
            <strong>{events.length}</strong>
            <span>Upcoming Events</span>
          </div>

          <div>
            <Users />
            <strong>{registrations.length}</strong>
            <span>Your Registrations</span>
          </div>

          <div>
            <TicketCheck />
            <strong>Free</strong>
            <span>Student Entry</span>
          </div>
        </section>

        <section className="event-controls">
          <div className="event-search">
            <Search />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search events or venues..."
            />
          </div>

          <div className="category-buttons">
            {[
              "All",
              "Academic",
              "Sports",
              "Arts",
              "Seminar",
            ].map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="event-section-heading">
          <div>
            <span>LIVE FROM MONGODB</span>
            <h2>Upcoming school events</h2>
          </div>

          <p>{filteredEvents.length} events available</p>
        </div>

        {pageError && (
          <div className="events-empty">
            <CalendarDays />
            <h3>Unable to load events</h3>
            <p>{pageError}</p>
          </div>
        )}

        {loading ? (
          <div className="events-empty">
            <Clock3 />
            <h3>Loading school events</h3>
            <p>Retrieving the latest events from MongoDB...</p>
          </div>
        ) : (
          <section className="events-grid">
            {filteredEvents.map((event) => (
              <article className="event-card" key={event._id}>
                <div
                  className={`event-cover ${
                    event.gradient || "science"
                  }`}
                >
                  <span>{event.category}</span>
                  <CalendarDays />
                </div>

                <div className="event-card-content">
                  <p className="event-date">
                    <CalendarDays />
                    {event.date}
                  </p>

                  <h3>{event.title}</h3>

                  <p className="event-description">
                    {event.description}
                  </p>

                  <div className="event-information">
                    <span>
                      <Clock3 />
                      {event.time}
                    </span>

                    <span>
                      <MapPin />
                      {event.venue}
                    </span>

                    <span>
                      <Users />
                      {event.seats} seats available
                    </span>
                  </div>

                  <div className="event-actions">
                    <button
                      type="button"
                      className="event-details-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="event-register-button"
                      onClick={() => openRegistration(event)}
                      disabled={isRegistered(event)}
                    >
                      {isRegistered(event)
                        ? "Registered"
                        : "Register"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading &&
          !pageError &&
          filteredEvents.length === 0 && (
            <div className="events-empty">
              <CalendarDays />
              <h3>No matching events</h3>
              <p>Try another search word or category.</p>
            </div>
          )}
      </div>

      {selectedEvent && (
        <div className="event-modal-backdrop">
          <section className="event-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              <X />
            </button>

            <span className="modal-category">
              {selectedEvent.category}
            </span>

            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>

            <div className="modal-details">
              <span>
                <CalendarDays />
                {selectedEvent.date}
              </span>

              <span>
                <Clock3 />
                {selectedEvent.time}
              </span>

              <span>
                <MapPin />
                {selectedEvent.venue}
              </span>

              <span>
                <Users />
                {selectedEvent.seats} available seats
              </span>
            </div>

            <button
              type="button"
              className="event-register-button full-button"
              onClick={() =>
                openRegistration(selectedEvent)
              }
              disabled={isRegistered(selectedEvent)}
            >
              {isRegistered(selectedEvent)
                ? "Already Registered"
                : "Register for this Event"}
            </button>
          </section>
        </div>
      )}

      {registering && (
        <div className="event-modal-backdrop">
          <section className="event-modal">
            <button
              type="button"
              className="modal-close"
              onClick={() => setRegistering(null)}
              aria-label="Close registration form"
            >
              <X />
            </button>

            <span className="modal-category">
              EVENT REGISTRATION
            </span>

            <h2>{registering.title}</h2>

            <p className="registration-subtitle">
              Complete this form to reserve your place.
            </p>

            {isRegistered(registering) ? (
              <div className="events-empty">
                <CheckCircle2 />
                <h3>Your place is reserved</h3>
                <p>
                  You are already registered for this event.
                </p>
              </div>
            ) : (
              <form
                className="school-form"
                onSubmit={submitRegistration}
              >
                <label>
                  Student name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                    disabled={submitting}
                  />
                </label>

                <label>
                  Email address *
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="student@example.com"
                    disabled={submitting}
                  />
                </label>

                <label>
                  Class *
                  <input
                    name="studentClass"
                    value={form.studentClass}
                    onChange={handleFormChange}
                    placeholder="Example: Class 10-A"
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
                    {messageType === "success" && (
                      <CheckCircle2 />
                    )}
                    {message}
                  </p>
                )}

                <button
                  className="event-register-button full-button"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving Registration..."
                    : "Confirm Registration"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default SchoolEvents;

