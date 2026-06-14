import { Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import JobPage from "./pages/JobPage";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ViewProfilePage from "./pages/ViewProfilePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/jobs' element={<JobPage />} />
        <Route path='/jobsdetails/:id' element={<JobDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/viewprofile' element={<ViewProfilePage />} />
      </Routes>
    </>
  )
}

export default App