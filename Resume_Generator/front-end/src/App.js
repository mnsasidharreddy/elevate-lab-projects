import { useState } from "react";
import ResumeForm from "./components/ResumeForm.jsx";
import ResumePreview from "./pages/ResumePreview.jsx";

function App() {
  const [payload, setPayload] = useState(null);

  const handleBack = () => {
    setPayload(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!payload ? (
        <ResumeForm onSubmit={(p) => setPayload(p)} />
      ) : (
        <ResumePreview payload={payload} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
