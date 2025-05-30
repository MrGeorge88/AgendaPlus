import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Debug } from './pages/debug';

function AppMinimal() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Debug />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="*" element={<Debug />} />
      </Routes>
    </Router>
  );
}

export default AppMinimal;
