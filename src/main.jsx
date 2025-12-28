import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { AppToggleProvider } from "./Context/AppToggleContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppToggleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppToggleProvider>
  </BrowserRouter>
);
