import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import JsonTester from "./pages/JsonTester";
import XmlTester from "./pages/XmlTester";
import FormTester from "./pages/FormTester";

function App() {
  const [message, setMessage] = useState("");
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, [reloadFlag]);

  return (
    <>
      <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
        <button
          onClick={() => setReloadFlag((reloadFlag) => reloadFlag + 1)}
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors"
        >
          Retry Connection: {reloadFlag} times
        </button>

        <p className="text-gray-700 font-medium">Backend Status: {message}</p>
      </div>
      <BrowserRouter>
        <nav className="p-4 bg-gray-100 space-x-4">
          <Link to="/json" className="text-blue-500 hover:underline">
            JSON Tester
          </Link>
          <Link to="/xml" className="text-green-500 hover:underline">
            XML Tester
          </Link>
          <Link to="/form" className="text-red-500 hover:underline">
            Form Tester
          </Link>
        </nav>

        <div className="p-4">
          <Routes>
            <Route path="/json" element={<JsonTester />} />
            <Route path="/xml" element={<XmlTester />} />
            <Route path="/form" element={<FormTester />} />
            <Route
              path="*"
              element={<div>Welcome! Choose a tester above.</div>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
