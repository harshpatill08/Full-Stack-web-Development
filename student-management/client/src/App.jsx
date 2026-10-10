
import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("studentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [students, setStudents] = useState([]);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    rollNo: "",
    department: "",
    branch: "",
    year: "",
    age: "",
  });

  const showMessage = (text, isError = false) => {
    setMessage(text);
    setError(isError);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/register", registerForm);
      showMessage(response.data.message);
      setRegisterForm({ name: "", email: "", password: "" });
      setPage("login");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Registration failed. Check your backend.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", loginForm);
      const session = {
        user: response.data.user,
        token: response.data.token,
      };

      localStorage.setItem("studentUser", JSON.stringify(session));
      setUser(session);
      setLoginForm({ email: "", password: "" });
      setPage("students");
      showMessage("Login successful!");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Login failed. Check your backend.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch {
      showMessage("Unable to load students.", true);
    }
  };

  useEffect(() => {
    if (page === "students") loadStudents();
  }, [page]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/students", {
        ...studentForm,
        rollNo: Number(studentForm.rollNo),
        year: Number(studentForm.year),
        age: Number(studentForm.age),
      });

      setStudentForm({
        name: "",
        rollNo: "",
        department: "",
        branch: "",
        year: "",
        age: "",
      });

      showMessage("Student added successfully!");
      await loadStudents();
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Unable to add student.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      showMessage("Student deleted successfully!");
      await loadStudents();
    } catch {
      showMessage("Unable to delete student.", true);
    }
  };

  const logout = () => {
    localStorage.removeItem("studentUser");
    setUser(null);
    setPage("login");
    showMessage("Logged out successfully.");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage student records easily</p>
      </header>

      <main className="container">
        <nav className="nav">
          {!user ? (
            <>
              <button onClick={() => { setPage("login"); setMessage(""); }}>
                Login
              </button>
              <button onClick={() => { setPage("register"); setMessage(""); }}>
                Register
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("students")}>Students</button>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </nav>

        {message && (
          <div className={`notice ${error ? "error" : "success"}`} role="status">
            {message}
          </div>
        )}

        {page === "login" && !user && (
          <section className="card">
            <h2>Welcome Back</h2>
            <p>Login to your account</p>

            <form onSubmit={handleLogin}>
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
              />

              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />

              <button className="primary" disabled={loading}>
                {loading ? "Please wait..." : "Login"}
              </button>
            </form>

            <p>
              New user?{" "}
              <button className="text-button" onClick={() => setPage("register")}>
                Create an account
              </button>
            </p>
          </section>
        )}

        {page === "register" && !user && (
          <section className="card">
            <h2>Create Account</h2>
            <p>Register to manage student records</p>

            <form onSubmit={handleRegister}>
              <label>Full Name</label>
              <input
                required
                placeholder="Enter your name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />

              <label>Password (minimum 8 characters)</label>
              <input
                type="password"
                minLength={8}
                required
                placeholder="Create a password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />

              <button className="primary" disabled={loading}>
                {loading ? "Please wait..." : "Register"}
              </button>
            </form>
          </section>
        )}

        {page === "students" && user && (
          <section className="dashboard">
            <div className="dashboard-heading">
              <div>
                <h2>Student Dashboard</h2>
                <p>Welcome, {user.user.name}</p>
              </div>
              <span className="count">{students.length} students</span>
            </div>

            <section className="card student-form-card">
              <h3>Add New Student</h3>

              <form className="student-form" onSubmit={handleAddStudent}>
                <label>Full Name</label>
                <input
                  required
                  placeholder="Student name"
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                />

                <label>Roll Number</label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="Roll number"
                  value={studentForm.rollNo}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, rollNo: e.target.value })
                  }
                />

                <label>Department</label>
                <input
                  required
                  placeholder="e.g. CSE"
                  value={studentForm.department}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, department: e.target.value })
                  }
                />

                <label>Branch</label>
                <input
                  required
                  placeholder="e.g. Computer Science"
                  value={studentForm.branch}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, branch: e.target.value })
                  }
                />

                <label>Year</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 3"
                  value={studentForm.year}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, year: e.target.value })
                  }
                />

                <label>Age</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Age"
                  value={studentForm.age}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, age: e.target.value })
                  }
                />

                <button className="primary" disabled={loading}>
                  {loading ? "Saving..." : "Add Student"}
                </button>
              </form>
            </section>

            <section className="card records-card">
              <h3>Student Records</h3>

              {students.length === 0 ? (
                <p>No students found. Add your first student above.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Roll No.</th>
                        <th>Department</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Age</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>{student.rollNo}</td>
                          <td>{student.department}</td>
                          <td>{student.branch}</td>
                          <td>{student.year}</td>
                          <td>{student.age}</td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteStudent(student._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </section>
        )}

        {page === "students" && !user && (
          <section className="card">
            <h2>Please log in first</h2>
            <p>You need an account to open the student dashboard.</p>
            <button className="primary" onClick={() => setPage("login")}>
              Go to Login
            </button>
          </section>
        )}
      </main>

      <footer>Student Management System · Experiment 10</footer>
    </div>
  );
}

export default App;