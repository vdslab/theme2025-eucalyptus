import "../styles/generationPanel.css";
import GeminiApi from "./GeminiApi";
const GenerationPanel = ({ flowerList }) => {
  return (
    <div className="generation">
      <GeminiApi flowerList={flowerList} />
    </div>
  );
};

export default GenerationPanel;
