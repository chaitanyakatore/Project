import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import TextEditor from "./TextEditor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 1: The Homepage (Redirects to a new random document) */}
        <Route
          path="/"
          element={<Navigate to={`/documents/${uuidV4()}`} replace />}
        />

        {/* Route 2: The Document Room (Loads the editor with the URL's ID) */}
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
