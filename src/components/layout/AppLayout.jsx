import Header from "./Header";
import "../../styles/layout.css";

const AppLayout = ({ children, monthRange, onMonthChange, rightContent }) => {
  return (
    <div className="app-container">
      <Header monthRange={monthRange} onMonthChange={onMonthChange} />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="left-Panel">{children}</div>
          <div className="right-Panel">{rightContent}</div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
