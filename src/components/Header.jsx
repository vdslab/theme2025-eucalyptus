import "../styles/header.css";

const Header = ({ onColorSearchClick }) => {
  return (
    <div>
      <header className="header">
        <h1 className="site-title">花束作成支援サイト</h1>
        <div className="search-content">
          {/* todo:クリックしたら下矢印を上矢印にする */}
          <button className="search-button" onClick={onColorSearchClick}>
            色から探す▼
          </button>
          <button className="search-button">開花時期から探す▼</button>
          <button className="search-button">イベントから探す▼</button>
        </div>
      </header>
    </div>
  );
};

export default Header;
