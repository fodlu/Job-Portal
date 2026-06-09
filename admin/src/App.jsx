import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import AddJobs from "./pages/AddJobs";
import ListJob from "./pages/ListJob";
import CompanyPage from "./pages/CompanyPage";
import CompanyQuestion from "./pages/CompanyQuestion";

const App = () => {
  return (
    <div className="">
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addjobs" element={<AddJobs />} />
          <Route path="/list/jobs" element={<ListJob />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/company-questions" element={<CompanyQuestion />} />
        </Routes>
      </div>
    </div>
  )
}

export default App