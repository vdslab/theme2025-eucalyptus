import "../styles/generationPanel.css";
import GeminiApi from "./GeminiApi";
const GenerationPanel = ({ flowerList, flowerMetadata }) => {
  return (
    <div className="generation">
      <GeminiApi flowerList={flowerList} flowerMetadata={flowerMetadata} />
    </div>
  );
};

export default GenerationPanel;
