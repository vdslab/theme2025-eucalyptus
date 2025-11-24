import "../styles/generationPanel.css";
import GeminiApi from "./GeminiAPI";
const GenerationPanel = ({ flowerList }) => {
  return (
    <div className="generation">
      <GeminiApi flowerList={flowerList} />
    </div>
  );
};

export default GenerationPanel;
