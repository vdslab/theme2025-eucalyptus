import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import MainPage from "./pages/MainPage";
import SubPage from "./pages/SubPage";

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: 0, end: 11 });

  return (
    <AppLayout
      monthRange={monthRange}
      onMonthChange={setMonthRange}
      rightContent={<SubPage />}
    >
      <MainPage
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        monthRange={monthRange}
      />
    </AppLayout>
  );
}

export default App;
