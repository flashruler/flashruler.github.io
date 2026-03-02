// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DocsRouter } from "./docs";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/docs" replace />} />
        <Route path="/docs/*" element={<DocsRouter />} />
        <Route path="*" element={<Navigate to="/docs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}