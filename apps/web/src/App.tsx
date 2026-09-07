import { Link, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { About } from "./routes/About";

export function App() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <nav className="mb-6 flex gap-4 text-sm font-medium text-blue-600">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
