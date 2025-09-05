// <!-- 
// ___________________________________________________________________________

//                             copyright © 2024 Jetson Black
//                             x.com/jetsonbb
//                             http://jetsonblack.com/

//                             just a simple page for myself!
// ___________________________________________________________________________
// -->
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./css/todo.css";
import "./css/hero.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
