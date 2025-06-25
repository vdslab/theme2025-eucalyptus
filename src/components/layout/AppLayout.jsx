import Header from "./Header";
import "../../styles/layout.css";

const AppLayout = ({ children, monthRange, onMonthChange }) => {
  return (
    <div className="app-container">
      <Header monthRange={monthRange} onMonthChange={onMonthChange} />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
