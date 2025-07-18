import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App";
import "./styles/global.css";
import "./styles/layout.css";

Modal.setAppElement("#content");

createRoot(document.querySelector("#content")).render(<App />);
