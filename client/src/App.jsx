import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Footer, Navbar } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindProjects,
  ProjectDetail,
  UploadProject,
  UserProfile,
  Admin,
  StudentApplications,
  ApplicationDetails,
  StudentList,
  CompanyProfessorList,
  UploadedList,
  Notes,
  ProfessorNotes,
  AdminApplications,
  ProfessorProfile,
  AdminProjects,
} from "./pages";
import Projects from "./pages/Projects";
import MyApplications from "./pages/MyApplications";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <Navbar /> {/* The Sidebar/ Navbar remains fixed on the left */}
      {/* Main Content */}
      <div className="flex-grow ml-64">
        <Outlet />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}

// Public Layout for pages without authentication
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <main className="bg-[#f7fdfd]">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      <Routes>
        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={
                    user.accountType === "seeker"
                      ? "/find-projects"
                      : user.accountType === "company"
                      ? "/projects"
                      : user.accountType === "admin"
                      ? "/admin"
                      : "/"
                  }
                  replace
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/find-projects" element={<FindProjects />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/user-profile/:id?" element={<UserProfile />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/professor-profile" element={<ProfessorProfile />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/upload-project" element={<UploadProject />} />
          <Route path="/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route
            path="/company-professor-list"
            element={<CompanyProfessorList />}
          />
          <Route path="/uploaded-list" element={<UploadedList />} />
          <Route
            path="/student-applications"
            element={<StudentApplications />}
          />
          <Route
            path="/applications/:applicationId"
            element={<ApplicationDetails />}
          />
          <Route path="/notes" element={<Notes />} />
          <Route path="/professor-notes/:id" element={<ProfessorNotes />} />
          <Route path="/admin-applications" element={<AdminApplications />} />
          <Route path="/admin-project" element={<AdminProjects />} />
          <Route path="/about-us" element={<About />} />
          <Route
            path="/admin"
            element={
              user?.accountType === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}></Route>

        {/* Authentication Routes */}
        <Route path="/user-auth" element={<AuthPage />} />
      </Routes>
    </main>
  );
}

export default App;
