
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./Editor";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavigateToNewDoc />} />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

function NavigateToNewDoc() {
  window.location.href = `/documents/${uuidV4()}`;
  return null;
}

export default App;
