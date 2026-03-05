import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { DocsRouter } from "./docs";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import FieldSwitcher from "./pages/FieldSwitcher";

function AppLayout() {
  const location = useLocation();
  const isDocs = location.pathname.startsWith("/docs");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isDocs && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/field-switcher" element={<FieldSwitcher />} />
          <Route path="/docs/*" element={<DocsRouter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
