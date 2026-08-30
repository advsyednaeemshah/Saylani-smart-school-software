import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  School,
  UserRound,
} from "lucide-react";
import { useAuth } from "../AuthContext";

function AuthPage({ mode }) {
  const signupMode = mode === "signup";
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentClass: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (signupMode) {
        await signup(form);
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }

      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not connect to the Saylani Smart School server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-showcase-content">
          <div className="auth-brand">
            <span><GraduationCap /></span>
            Saylani Smart School
          </div>

          <div>
            <span className="auth-kicker">THE LIVING DIGITAL CAMPUS</span>
            <h1>
              One secure account.<br />
              <span>Your complete school.</span>
            </h1>
            <p>
              Access student services, events, study planning, books, canteen
              ordering, achievements, and intelligent learning experiences.
            </p>
          </div>

          <div className="auth-benefits">
            <div><CheckCircle2 /> Secure JWT authentication</div>
            <div><CheckCircle2 /> Real MongoDB data storage</div>
            <div><CheckCircle2 /> Six connected school services</div>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrapper">
          <span className="mobile-auth-logo"><School /> EDUVERSE</span>
          <span className="auth-form-kicker">
            {signupMode ? "CREATE STUDENT ACCOUNT" : "WELCOME BACK"}
          </span>

          <h2>{signupMode ? "Join your digital campus." : "Continue your journey."}</h2>
          <p>
            {signupMode
              ? "Create one account to access every Saylani Smart School service."
              : "Enter your account information to access Saylani Smart School."}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {signupMode && (
              <>
                <label>
                  Full name
                  <div className="auth-input">
                    <UserRound />
                    <input
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </label>

                <label>
                  Class
                  <div className="auth-input">
                    <BookOpen />
                    <input
                      name="studentClass"
                      value={form.studentClass}
                      onChange={updateField}
                      required
                      placeholder="Example: Class 10-A"
                    />
                  </div>
                </label>
              </>
            )}

            <label>
              Email address
              <div className="auth-input">
                <Mail />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  placeholder="student@example.com"
                />
              </div>
            </label>

            <label>
              Password
              <div className="auth-input">
                <LockKeyhole />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  required
                  minLength="6"
                  placeholder="Minimum six characters"
                />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : signupMode
                ? "Create My Account"
                : "Login to Saylani Smart School"}
              {!loading && <ArrowRight />}
            </button>
          </form>

          <div className="auth-switch">
            {signupMode ? "Already have an account?" : "New to Saylani Smart School?"}
            <Link to={signupMode ? "/login" : "/signup"}>
              {signupMode ? "Login here" : "Create an account"}
            </Link>
          </div>

          <p className="auth-security">
            <LockKeyhole /> Passwords are securely hashed before database storage.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;

