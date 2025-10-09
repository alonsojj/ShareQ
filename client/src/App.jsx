import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import View from "./pages/View";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/upload" element={<Upload />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
