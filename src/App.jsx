import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Menu,
  ShoppingBasket,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import "./App.css";
import ComplaintPortal from "./pages/ComplaintPortal";
import SchoolEvents from "./pages/SchoolEvents";
import StudyPlanner from "./pages/StudyPlanner";
import DigitalLibrary from "./pages/DigitalLibrary";
import SchoolCanteen from "./pages/SchoolCanteen";
import StudentPortfolio from "./pages/StudentPortfolio";
import AuthPage from "./pages/AuthPage";
import {
  AboutPage,
  ContactPage,
  HelpPage,
  NotFoundPage,
  PrivacyPage,
} from "./pages/InfoPages";
import {
  AuthProvider,
  RequireAuth,
  useAuth,
} from "./AuthContext";

const modules = [
  {
    number: "01",
    title: "Complaint Portal",
    description:
      "Submit school complaints and follow their resolution status.",
    path: "/complaints",
    icon: ClipboardCheck,
    color: "#4f46e5",
  },
  {
    number: "02",
    title: "School Events",
    description:
      "Discover activities, view event details, and register online.",
    path: "/events",
    icon: CalendarDays,
    color: "#9333ea",
  },
  {
    number: "03",
    title: "Study Planner",
    description:
      "Organize subjects, deadlines, priorities, and daily progress.",
    path: "/planner",
    icon: GraduationCap,
    color: "#ea580c",
  },
  {
    number: "04",
    title: "Digital Library",
    description:
      "Search books by title, author, category, and availability.",
    path: "/library",
    icon: BookOpen,
    color: "#059669",
  },
  {
    number: "05",
    title: "School Canteen",
    description:
      "Browse meals, add items to a cart, and place an order.",
    path: "/canteen",
    icon: ShoppingBasket,
    color: "#dc2626",
  },
  {
    number: "06",
    title: "Student Portfolio",
    description:
      "Explore student skills, projects, certificates, and contact details.",
    path: "/portfolio",
    icon: UserRound,
    color: "#0891b2",
  },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <nav className="nav container">
        <NavLink
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="brand-icon">
            <GraduationCap />
          </span>

          <span>
            Saylani Smart <strong>School</strong>
          </span>
        </NavLink>

        <button
          type="button"
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Open navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <div className={"nav-links " + (open ? "open" : "")}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink
            to="/complaints"
            onClick={() => setOpen(false)}
          >
            Complaints
          </NavLink>

          <NavLink
            to="/events"
            onClick={() => setOpen(false)}
          >
            Events
          </NavLink>

          <NavLink
            to="/planner"
            onClick={() => setOpen(false)}
          >
            Planner
          </NavLink>

          <NavLink
            to="/library"
            onClick={() => setOpen(false)}
          >
            Library
          </NavLink>

          <NavLink
            to="/canteen"
            onClick={() => setOpen(false)}
          >
            Canteen
          </NavLink>

          <NavLink
            to="/portfolio"
            onClick={() => setOpen(false)}
          >
            Portfolio
          </NavLink>

          {user ? (
            <span className="auth-user">
              {user.name}
              <button type="button" onClick={logout}>
                Logout
              </button>
            </span>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              SMART SCHOOL DIGITAL PLATFORM
            </span>

            <h1>
              One school.
              <br />
              <span>Every essential experience.</span>
            </h1>

            <p>
              Saylani Smart School brings student services, events,
              planning, learning, meals, and achievements into one
              modern digital platform.
            </p>

            <div className="hero-actions">
              <a href="#modules" className="primary-button">
                Explore Modules
              </a>

              <NavLink
                to="/portfolio"
                className="secondary-button"
              >
                View Student Work
              </NavLink>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-heading">
              <span>Student Dashboard</span>
              <span className="live-badge">● LIVE</span>
            </div>

            <div className="stat-grid">
              <div>
                <strong>06</strong>
                <span>Digital Modules</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Student Access</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Responsive</span>
              </div>

              <div>
                <strong>01</strong>
                <span>Unified Platform</span>
              </div>
            </div>

            <div className="activity-card">
              <span className="activity-icon">
                <BookOpen />
              </span>

              <div>
                <strong>Everything in one place</strong>
                <p>Simple, fast, and designed for students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="modules" className="modules-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                EXPLORE SAYLANI SMART SCHOOL
              </span>

              <h2>Six connected school experiences</h2>
            </div>

            <p>
              Each module solves a different everyday school
              challenge.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <NavLink
                  to={module.path}
                  className="module-card"
                  key={module.path}
                  style={{ "--accent": module.color }}
                >
                  <div className="module-top">
                    <span className="module-icon">
                      <Icon />
                    </span>

                    <span className="module-number">
                      TASK {module.number}
                    </span>
                  </div>

                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <span className="open-link">
                    Open module →
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

function Footer() {
  const location = useLocation();

  // Student Portfolio already contains its own custom footer.
  if (location.pathname === "/portfolio") {
    return null;
  }

  return (
    <footer className="school-footer">
      <div className="container school-footer-grid">
        <div className="school-footer-about">
          <div className="school-footer-brand">
            <span className="brand-icon">
              <GraduationCap />
            </span>

            <div>
              <strong>Saylani Smart School</strong>
              <small>LEARN · BUILD · LEAD</small>
            </div>
          </div>

          <p>
            A connected digital school platform designed to make
            student services simpler, faster, and more accessible.
          </p>
        </div>

        <div className="school-footer-column">
          <h3>School Services</h3>
          <NavLink to="/complaints">Complaint Portal</NavLink>
          <NavLink to="/events">School Events</NavLink>
          <NavLink to="/planner">Study Planner</NavLink>
          <NavLink to="/library">Digital Library</NavLink>
          <NavLink to="/canteen">School Canteen</NavLink>
        </div>

        <div className="school-footer-column">
          <h3>Useful Links</h3>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/portfolio">Developer Portfolio</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          <NavLink to="/help">Help & FAQ</NavLink>
          <NavLink to="/privacy">Privacy Policy</NavLink>
        </div>

        <div className="school-footer-column footer-contact">
          <h3>Contact</h3>
          <span>Quetta, Balochistan</span>
          <span>Pakistan</span>

          <a href="mailto:Advocatesyednaeemshah@gmail.com">
            Advocatesyednaeemshah@gmail.com
          </a>
        </div>
      </div>

      <div className="container school-footer-bottom">
        <span>
          © 2026 Saylani Smart School. Designed by Syed Naeem Shah.
        </span>

        <span>
          Independent student project created for Saylani Coding Night.
        </span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/login"
            element={<AuthPage mode="login" />}
          />

          <Route
            path="/signup"
            element={<AuthPage mode="signup" />}
          />

          <Route
            path="/complaints"
            element={
              <RequireAuth>
                <ComplaintPortal />
              </RequireAuth>
            }
          />

          <Route
            path="/events"
            element={
              <RequireAuth>
                <SchoolEvents />
              </RequireAuth>
            }
          />

          <Route
            path="/planner"
            element={
              <RequireAuth>
                <StudyPlanner />
              </RequireAuth>
            }
          />

          <Route
            path="/library"
            element={
              <RequireAuth>
                <DigitalLibrary />
              </RequireAuth>
            }
          />

          <Route
            path="/canteen"
            element={
              <RequireAuth>
                <SchoolCanteen />
              </RequireAuth>
            }
          />

          <Route
            path="/portfolio"
            element={
              <RequireAuth>
                <StudentPortfolio />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
