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
} from "./pages";
import Projects from "./pages/Projects";
import MyApplications from "./pages/MyApplications";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/user-auth' state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <main className='bg-[#f7fdfd]'>
      <Navbar />

      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/'
            // element={<Navigate to='/find-projects' replace={true} 
            element={user ? <Navigate to={user.accountType === "seeker" ? '/find-projects' : '/projects'} replace={true} /> : <Navigate to='/user-auth' replace={true}
            />}
          />
          {/* {user && user.user} */}
          <Route path='/find-projects' element={<FindProjects />} />
          <Route path='/companies' element={<Companies />} />
          {/* <Route path='/' element={<Companies />} /> */}
          <Route path={"/user-profile/:id?"} element={<UserProfile />} />
          <Route path={"/applications/"} element={<MyApplications />}/>
          {/* <Route path={"/"} element={<UserProfile />} /> */}

          <Route path={"/company-profile"} element={<CompanyProfile />} />
          <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
          {/* <Route path={"/upload-project"} element={<UploadProject />} /> */}
          <Route path={"/upload-project"} element={<UploadProject />} />
          {/* <Route path={"/"} element={<UploadProject />} /> */}
          <Route path={"/project-detail/:id"} element={<ProjectDetail />} />
          <Route path={"/projects"} element={<Projects />} />
        </Route>

        <Route path='/about-us' element={<About />} />
        <Route path='/user-auth' element={<AuthPage />} />
      </Routes>
      {user && <Footer />}
    </main>
  );
}

export default App;
