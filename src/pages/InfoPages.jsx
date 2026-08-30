import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import api from "../api";

function PageHero({ label, title, description, icon }) {
  return (
    <section className="info-page-hero">
      <div className="container info-page-hero-content">
        <div>
          <span>{label}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="info-page-symbol">{icon}</div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <main className="info-page">
      <PageHero
        label="ABOUT SAYLANI SMART SCHOOL"
        title="Learning powered by technology and purpose."
        description="A connected digital school experience designed to make everyday student services simpler, faster, and more accessible."
        icon={<GraduationCap />}
      />

      <section className="container info-page-content">
        <div className="info-introduction">
          <span>OUR DIGITAL VISION</span>
          <h2>One platform for the complete student journey.</h2>

          <p>
            Saylani Smart School is a full-stack student project that
            demonstrates how modern technology can connect important school
            services through one accessible and responsive platform.
          </p>

          <p>
            Students can submit and track complaints, discover events,
            organize academic tasks, explore books, order meals, and present
            their achievements without moving between disconnected systems.
          </p>
        </div>

        <div className="info-values-grid">
          <article>
            <strong>01</strong>
            <h3>Student First</h3>
            <p>
              Every module is designed around common student needs and
              straightforward digital experiences.
            </p>
          </article>

          <article>
            <strong>02</strong>
            <h3>Connected Services</h3>
            <p>
              School tools work together through a shared React, Express,
              and MongoDB architecture.
            </p>
          </article>

          <article>
            <strong>03</strong>
            <h3>Secure Access</h3>
            <p>
              Authentication and protected routes help keep each student's
              personal records separated.
            </p>
          </article>

          <article>
            <strong>04</strong>
            <h3>Continuous Innovation</h3>
            <p>
              The platform is designed to grow with new educational,
              automation, and artificial-intelligence features.
            </p>
          </article>
        </div>

        <section className="info-highlight">
          <div>
            <span>THE TECHNOLOGY</span>
            <h2>Created as a complete full-stack experience.</h2>
            <p>
              The frontend uses React and responsive CSS. Express provides
              the API layer, MongoDB stores persistent records, and JWT
              authentication protects student services.
            </p>
          </div>

          <div className="info-tech-list">
            <span>React</span>
            <span>Express.js</span>
            <span>MongoDB</span>
            <span>JWT Authentication</span>
            <span>Responsive Design</span>
            <span>REST APIs</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    setStatus({ type: "", text: "" });

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({
        type: "error",
        text: "Please complete all fields.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/contact", payload);

      setStatus({
        type: "success",
        text:
          response.data?.message ||
          "Your message was received successfully.",
      });

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to send your message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="info-page">
      <PageHero
        label="CONTACT & SUPPORT"
        title="Start a conversation with us."
        description="Send a question, suggestion, or project enquiry through our MongoDB-connected contact system."
        icon={<Mail />}
      />

      <section className="container info-page-content">
        <div className="contact-page-grid">
          <div className="contact-page-information">
            <span className="info-section-label">GET IN TOUCH</span>
            <h2>Questions, ideas, or feedback?</h2>

            <p>
              We welcome thoughtful feedback about the platform, its modules,
              accessibility, and future educational features.
            </p>

            <div className="info-contact-card">
              <Mail />

              <div>
                <small>EMAIL</small>
                <a href="mailto:Advocatesyednaeemshah@gmail.com">
                  Advocatesyednaeemshah@gmail.com
                </a>
              </div>
            </div>

            <div className="info-contact-card">
              <MapPin />

              <div>
                <small>LOCATION</small>
                <strong>Quetta, Balochistan, Pakistan</strong>
              </div>
            </div>

            <div className="info-contact-card">
              <UserRound />

              <div>
                <small>DEVELOPER</small>
                <strong>Syed Naeem Shah</strong>
              </div>
            </div>
          </div>

          <form
            className="school-contact-form"
            onSubmit={submitMessage}
          >
            <span className="info-section-label">SEND A MESSAGE</span>
            <h2>How can we help?</h2>

            <label>
              Your name *
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={submitting}
              />
            </label>

            <label>
              Email address *
              <input
                required
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={submitting}
              />
            </label>

            <label>
              Your message *
              <textarea
                required
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your question or feedback..."
                disabled={submitting}
              />
            </label>

            {status.text && (
              <p
                className={
                  status.type === "success"
                    ? "contact-status success"
                    : "contact-status error"
                }
              >
                {status.type === "success" && <CheckCircle2 />}
                {status.text}
              </p>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
              <Send />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export function HelpPage() {
  const questions = [
    {
      question: "Do I need an account to use the modules?",
      answer:
        "Yes. Student modules are protected so that records can be associated with the correct account.",
    },
    {
      question: "Where is my information stored?",
      answer:
        "Module records are sent through the Express API and stored in MongoDB. Your authentication token remains in your browser.",
    },
    {
      question: "How do I track a complaint?",
      answer:
        "Open the Complaint Portal after logging in. Your complaints, tracking IDs, and current statuses appear in the live tracking section.",
    },
    {
      question: "How do event registrations work?",
      answer:
        "Open School Events, select an event, and complete the registration form. Your registration is saved to your account.",
    },
    {
      question: "Can I use the website on a mobile phone?",
      answer:
        "Yes. The interface is designed to adapt to desktop, tablet, and mobile screen sizes.",
    },
    {
      question: "Is this an official Saylani website?",
      answer:
        "No. This is an independent educational project created for a coding challenge and portfolio demonstration.",
    },
  ];

  return (
    <main className="info-page">
      <PageHero
        label="HELP CENTRE"
        title="Answers when you need them."
        description="Learn how accounts, modules, data storage, and student services work across the platform."
        icon={<UserRound />}
      />

      <section className="container info-page-content">
        <div className="faq-heading">
          <span className="info-section-label">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2>How can we help you?</h2>
          <p>
            Select a question below to view its answer.
          </p>
        </div>

        <div className="faq-list">
          {questions.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="help-contact-banner">
          <div>
            <h3>Still need assistance?</h3>
            <p>
              Send your question through our contact page.
            </p>
          </div>

          <NavLink to="/contact">
            Contact Support <Send />
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export function PrivacyPage() {
  return (
    <main className="info-page">
      <PageHero
        label="PRIVACY & RESPONSIBLE DATA"
        title="Simple, transparent data practices."
        description="An overview of how this demonstration platform handles account information and student-generated records."
        icon={<ShieldCheck />}
      />

      <section className="container info-page-content">
        <article className="policy-document">
          <p className="policy-updated">
            Educational project privacy notice
          </p>

          <h2>1. Information collected</h2>
          <p>
            The platform may collect account information, complaints,
            event registrations, study tasks, library favourites, orders,
            and contact messages submitted through the available forms.
          </p>

          <h2>2. How information is used</h2>
          <p>
            Information is used only to demonstrate the operation of the
            platform and provide its student-facing features.
          </p>

          <h2>3. Database storage</h2>
          <p>
            Application records are stored in MongoDB through an Express API.
            Authentication passwords are hashed before storage.
          </p>

          <h2>4. Authentication</h2>
          <p>
            A JWT authentication token may be stored in the browser so that
            signed-in users can access protected modules.
          </p>

          <h2>5. Demonstration warning</h2>
          <p>
            Do not enter highly sensitive information, official complaints,
            financial information, passwords used on other websites, or
            confidential personal records into this demonstration project.
          </p>

          <h2>6. Independent project</h2>
          <p>
            This website is an independent student project created for
            educational and portfolio purposes. It should not be treated as
            an official production service unless formally authorized and
            deployed by the relevant organization.
          </p>

          <h2>7. Contact</h2>
          <p>
            Privacy-related questions can be sent to
            Advocatesyednaeemshah@gmail.com.
          </p>
        </article>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span>404</span>
        <GraduationCap />
        <h1>We could not find that page.</h1>
        <p>
          The page may have moved, or the address may be incorrect.
        </p>

        <div>
          <NavLink to="/" className="portfolio-primary">
            Return Home
          </NavLink>

          <NavLink to="/help" className="portfolio-secondary">
            Visit Help Centre
          </NavLink>
        </div>
      </div>
    </main>
  );
}
