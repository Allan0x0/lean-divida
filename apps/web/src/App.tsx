import { Route, Routes } from "react-router-dom";
import { About } from "./routes/About";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";

export function App() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
