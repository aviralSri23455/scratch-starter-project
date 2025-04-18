import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SpriteProvider } from "./context/SpriteContext"; // Import the provider
import "tailwindcss/tailwind.css";

console.log("hi");

ReactDOM.render(
  <React.StrictMode>
    <SpriteProvider> {/* Wrap App with the provider */}
      <App />
    </SpriteProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
