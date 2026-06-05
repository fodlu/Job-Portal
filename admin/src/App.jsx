import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <div className="">
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App