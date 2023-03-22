import React from "react";
import Start from "./pages/Start";
import Company from "./pages/Company";
import Companies from "./pages/Companies";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Start />} />
          <Route exact path="/company/:name" element={<Company />} />
          <Route exact path="/companies" element={<Companies />} />
        </Routes>
      </Router>
    </div>
  );
}
