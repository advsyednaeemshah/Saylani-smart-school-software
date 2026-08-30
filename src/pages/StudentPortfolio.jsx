import { useState } from "react";
import {
  ArrowUpRight,
  Award,
  Code2,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Moon,
  Send,
  Sparkles,
  Sun,
  UserRound,
} from "lucide-react";

const skills = [
  {
    number: "01",
    name: "Frontend Engineering",
    level: "HTML, CSS, JavaScript and responsive UI",
  },
  {
    number: "02",
    name: "React Development",
    level: "Components, state, routing and interfaces",
  },
  {
    number: "03",
    name: "Backend APIs",
    level: "Node.js, Express and REST architecture",
  },
  {
    number: "04",
    name: "MongoDB",
    level: "Schemas, persistence and CRUD systems",
  },
  {
    number: "05",
    name: "Authentication",
    level: "JWT, protected routes and password security",
  },
  {
    number: "06",
    name: "Digital Product Design",
    level: "Useful, accessible and engaging experiences",
  },
  {
    number: "07",
    name: "AI-Assisted Workflows",
    level: "Prompting, automation and rapid prototyping",
  },
  {
    number: "08",
    name: "Creative Communication",
    level: "Storytelling, media and audience engagement",
  },
];

const projects = [
  {
    number: "01",
    type: "FLAGSHIP FULL-STACK PLATFORM",
    title: "Saylani Smart School",
    description:
      "A connected digital school ecosystem featuring secure authentication, complaint tracking, events, study planning, library services, canteen ordering, and student portfolios.",
    tags: ["React", "Express", "MongoDB"],
    color: "blue",
  },
  {
    number: "02",
    type: "FULL-STACK PRODUCTIVITY APPLICATION",
    title: "Hackathon Task Manager",
    description:
      "A secure productivity application with account registration, login, protected routes, task creation, status management, deletion, REST APIs, and persistent database storage.",
    tags: ["JWT", "Node.js", "CRUD"],
    color: "purple",
  },
  {
    number: "03",
    type: "AI & CREATIVE TECHNOLOGY",
    title: "Intelligent Content Workflow",
    description:
      "An evolving collection of AI-assisted tools and automation concepts designed to improve research, scripting, content preparation, and digital production workflows.",
    tags: ["AI Tools", "Automation", "Content"],
    color: "cyan",
  },
];

const achievements = [
  {
    year: "2026",
    icon: <Award />,
    title: "Saylani Smart School Full-Stack Build",
    description:
      "Designed and developed a multi-module school platform that connects a React frontend with Express APIs, JWT authentication, and MongoDB persistence.",
  },
  {
    year: "2026",
    icon: <Code2 />,
    title: "Secure MERN Architecture Milestone",
    description:
      "Implemented account authentication, protected application routes, user-specific database records, and complete create, read, update, and delete workflows.",
  },
  {
    year: "2025",
    icon: <Sparkles />,
    title: "Google Prompting Essentials",
    description:
      "Completed Google's Prompting Essentials Specialization and applied structured prompting to development, research, automation, and creative problem-solving.",
  },
];

function StudentPortfolio() {
  const [dark, setDark] = useState(false);
  const [sent, setSent] = useState(false);

  const submitContact = (event) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className={`portfolio-page ${dark ? "portfolio-dark" : ""}`}>
      <nav className="portfolio-nav">
        <div className="portfolio-container">
          <a href="#top" className="portfolio-logo">
            <span>SNS</span>
            Syed Naeem Shah<span className="logo-dot">.</span>
          </a>

          <div className="portfolio-nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#achievements">Achievements</a>
            <a href="#contact">Contact</a>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Change portfolio theme"
          >
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>
      </nav>

      <section id="top" className="portfolio-hero">
        <div className="portfolio-container portfolio-hero-grid">
          <div>
            <span className="portfolio-kicker">
              <Sparkles />
              FULL-STACK DEVELOPER · CREATIVE TECHNOLOGIST
            </span>

            <h1>
              I build digital systems that
              <span> connect ideas, people, and data.</span>
            </h1>

            <p>
              Hi, I am Syed Naeem Shah — a full-stack developer and creative
              technologist based in Quetta. I bring more than ten years of
              digital creativity, communication, and problem-solving experience
              into modern web development using React, Express, MongoDB,
              automation, and AI-assisted workflows.
            </p>

            <div className="portfolio-actions">
              <a href="#projects" className="portfolio-primary">
                Explore My Work <ArrowUpRight />
              </a>

              <a href="#contact" className="portfolio-secondary">
                Build With Me
              </a>
            </div>

            <div className="portfolio-social">
              <span>
                <MapPin />
                Quetta, Balochistan, Pakistan
              </span>

              <span>
                <UserRound />
                Full-Stack Developer
              </span>
            </div>
          </div>

          <div className="profile-visual">
            <div className="profile-card">
              <div className="profile-avatar">SNS</div>

              <span>OPEN TO DEVELOPMENT & INNOVATION</span>

              <h3>
                Creative experience.
                <br />
                Engineering mindset.
              </h3>

              <div>
                <GitBranch />
                <Mail />
                <Code2 />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="portfolio-section">
        <div className="portfolio-container about-grid">
          <div>
            <span className="portfolio-section-label">
              01 · DEVELOPER PROFILE
            </span>

            <h2>
              Ten years of creativity—now engineered into digital products.
            </h2>
          </div>

          <div>
            <p>
              My development journey is powered by more than ten years of
              experience creating digital content, understanding audiences,
              solving communication problems, and transforming complex ideas
              into practical experiences.
            </p>

            <p>
              Today, I apply that foundation to full-stack development. I build
              responsive React interfaces, structured Express APIs, MongoDB
              databases, JWT authentication systems, and user-focused digital
              products.
            </p>

            <p>
              My background in law, communication, storytelling, and technology
              gives me a multidisciplinary perspective. I do not only write
              code—I think about the users, purpose, security, message, and
              real-world impact behind every product.
            </p>

            <div className="about-numbers">
              <div>
                <strong>10+</strong>
                <span>Years Digital Experience</span>
              </div>

              <div>
                <strong>06</strong>
                <span>Connected Saylani Smart School Modules</span>
              </div>

              <div>
                <strong>360°</strong>
                <span>Product Perspective</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="skills"
        className="portfolio-section muted-section"
      >
        <div className="portfolio-container">
          <div className="portfolio-title-row">
            <div>
              <span className="portfolio-section-label">
                02 · TECHNICAL CAPABILITIES
              </span>

              <h2>
                From interface design to database architecture.
              </h2>
            </div>

            <p>
              Building complete experiences across frontend, backend,
              databases, security, AI, and creative communication.
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill) => (
              <article className="skill-card" key={skill.number}>
                <span>{skill.number}</span>
                <Code2 />
                <h3>{skill.name}</h3>
                <p>{skill.level}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="portfolio-section">
        <div className="portfolio-container">
          <div className="portfolio-title-row">
            <div>
              <span className="portfolio-section-label">
                03 · FEATURED BUILDS
              </span>

              <h2>
                Code with purpose. Products with personality.
              </h2>
            </div>

            <p>
              Practical applications that combine engineering, design,
              communication, and problem-solving.
            </p>
          </div>

          <div className="portfolio-projects">
            {projects.map((project) => (
              <article
                className="portfolio-project"
                key={project.number}
              >
                <div className={`project-visual ${project.color}`}>
                  <span>{project.number}</span>
                  <Code2 />
                </div>

                <div className="project-information">
                  <small>{project.type}</small>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <span className="project-link">
                    Explore the concept <ArrowUpRight />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="achievements"
        className="portfolio-section muted-section"
      >
        <div className="portfolio-container achievement-grid">
          <div>
            <span className="portfolio-section-label">
              04 · DEVELOPMENT MILESTONES
            </span>

            <h2>
              Proof of progress through real builds.
            </h2>

            <p>
              These milestones represent practical development work—not just
              theory. Each one demonstrates a stronger understanding of
              architecture, security, databases, interfaces, and intelligent
              workflows.
            </p>
          </div>

          <div className="achievement-list">
            {achievements.map((achievement) => (
              <article key={achievement.title}>
                <span>{achievement.icon}</span>

                <div>
                  <small>{achievement.year}</small>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="portfolio-contact">
        <div className="portfolio-container contact-grid">
          <div>
            <span className="portfolio-section-label light-label">
              05 · LET'S BUILD
            </span>

            <h2>
              Have an ambitious idea?
              <br />
              Let us turn it into a product.
            </h2>

            <p>
              I am open to web development, digital innovation, creative
              technology, AI-assisted projects, collaborations, and
              opportunities to build products that create real value.
            </p>

            <div className="contact-detail">
              <Mail />

              <div>
                <small>EMAIL</small>
                <strong>
                  Advocatesyednaeemshah@gmail.com
                </strong>
              </div>
            </div>

            <div className="contact-detail">
              <MapPin />

              <div>
                <small>LOCATION</small>
                <strong>
                  Quetta, Balochistan, Pakistan
                </strong>
              </div>
            </div>
          </div>

          <form
            className="portfolio-contact-form"
            onSubmit={submitContact}
          >
            <label>
              Your name
              <input
                required
                placeholder="Enter your name"
              />
            </label>

            <label>
              Email address
              <input
                required
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label>
              Project idea
              <textarea
                required
                rows="5"
                placeholder="Tell me about the product you want to build..."
              />
            </label>

            {sent && (
              <p className="portfolio-success">
                Your project enquiry has been received. Thank you!
              </p>
            )}

            <button type="submit">
              Start a Conversation <Send />
            </button>
          </form>
        </div>
      </section>

      <footer className="portfolio-footer">
        <div className="portfolio-container">
          <span>
            © 2026 Syed Naeem Shah. Developer Portfolio.
          </span>

          <span>
            React · Express · MongoDB · AI · Creative Technology
          </span>
        </div>
      </footer>
    </main>
  );
}

export default StudentPortfolio;

