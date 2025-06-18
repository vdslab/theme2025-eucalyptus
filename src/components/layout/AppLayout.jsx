import React from "react";
import Header from "./Header";
import "../../styles/layout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
