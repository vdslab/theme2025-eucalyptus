import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <AppLayout>
      <MainPage activeSlide={activeSlide} setActiveSlide={setActiveSlide} />
    </AppLayout>
  );
}

export default App;
