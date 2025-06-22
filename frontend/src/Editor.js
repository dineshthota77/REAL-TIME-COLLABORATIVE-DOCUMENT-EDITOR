
import React, { useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
let socket;
let quill;

export default function Editor() {
  const { id: documentId } = useParams();

  useEffect(() => {
    socket = io("http://localhost:3001");
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const editorContainer = document.getElementById("editor-container");
    quill = new Quill(editorContainer, { theme: "snow" });
    quill.disable();
    quill.setText("Loading...");
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;
    socket.once("load-document", document => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handler = delta => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handler = delta => {
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [socket, quill]);

  return <div id="editor-container" />;
}
