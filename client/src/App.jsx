import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindProjects,
  ProjectDetail,
  UploadProject,
  UserProfile,
  Admin, // Added Admin import
} from "./pages";
import Projects from "./pages/Projects";
import MyApplications from "./pages/MyApplications";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/user-auth" state={{ from: location }} replace />
  );
}

// New layout component for pages with Navbar and Footer but no auth required
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <main className="bg-[#f7fdfd]">
      <Routes>
        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.accountType === "seeker" ? "/find-projects" : "/projects"}
                  replace
                />
              ) : (
                <Navigate to="/user-auth" replace />
              )
            }
          />
          <Route path="/find-projects" element={<FindProjects />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/user-profile/:id?" element={<UserProfile />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/upload-project" element={<UploadProject />} />
          <Route path="/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/projects" element={<Projects />} />
          {/* New Admin route */}
          <Route 
            path="/admin" 
            element={user?.accountType === "admin" ? <Admin /> : <Navigate to="/admin" replace />} 
          />
        </Route>

        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/about-us" element={<About />} />
        </Route>

        {/* Public Routes without Navbar and Footer */}
        <Route path="/user-auth" element={<AuthPage />} />
      </Routes>
    </main>
  );
}

export default App;