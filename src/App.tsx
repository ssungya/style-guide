import { HashRouter, Route, Routes } from "react-router-dom";
import { useApplyAccessibility } from "./components/Layout";
import Onboarding from "./pages/Onboarding";
import Consent from "./pages/Consent";
import BasicInfo from "./pages/BasicInfo";
import PhotoCapture from "./pages/PhotoCapture";
import Questionnaire from "./pages/Questionnaire";
import Processing from "./pages/Processing";
import DiagnosisResult from "./pages/DiagnosisResult";
import Recommendations from "./pages/Recommendations";
import TryOnSelect from "./pages/TryOnSelect";
import TryOnResult from "./pages/TryOnResult";
import SaveShare from "./pages/SaveShare";
import MyPage from "./pages/MyPage";
import HelpGuide from "./pages/HelpGuide";
import AccessibilitySettings from "./pages/AccessibilitySettings";

function App() {
  useApplyAccessibility();
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/basic-info" element={<BasicInfo />} />
        <Route path="/photo" element={<PhotoCapture />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/result" element={<DiagnosisResult />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/tryon-select" element={<TryOnSelect />} />
        <Route path="/tryon-result" element={<TryOnResult />} />
        <Route path="/save-share" element={<SaveShare />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/help" element={<HelpGuide />} />
        <Route path="/settings" element={<AccessibilitySettings />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
