import "../styles/generationPanel.css";
import GeminiApi from "./GeminiApi";

const GenerationPanel = ({
  selectedNodes,
  flowerMetadata,
  generatedImage,
  setGeneratedImage,
  error,
  setError,
  loading,
  setLoading,
  prevSelectedNodesRef,
}) => {
  return (
    <div className="generation">
      <GeminiApi
        selectedNodes={selectedNodes}
        flowerMetadata={flowerMetadata}
        generatedImage={generatedImage}
        setGeneratedImage={setGeneratedImage}
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
        prevSelectedNodesRef={prevSelectedNodesRef}
      />
    </div>
  );
};

export default GenerationPanel;
