import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);
// Generate a random document ID for testing, or grab one from the URL
const DOCUMENT_ID = "doc-12345";

function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  // 1. Establish connection on load
  useEffect(() => {
    const s = io("http://localhost:5001"); // Your correct port!
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // 2. Initialize Quill Editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        cursors: true, // Enable the cursor module here
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    q.disable(); // Freeze the editor until we load the data from the server
    q.setText("Loading document...");
    setQuill(q);
  }, []);

  // 3. Load the initial document state
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    // Ask the server for the SPECIFIC document from the URL
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // 4. Handle auto-saving (Send full document state to server every 2 seconds)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => clearInterval(interval);
  }, [socket, quill, documentId]);

  // 5. Handle INCOMING changes
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => quill.updateContents(delta);
    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  // 6. Handle OUTGOING changes
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  // Handle OUTGOING cursor movements (When YOU click around)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (range, oldRange, source) => {
      if (source !== "user") return;
      // 'range' contains the index (position) and length (if text is highlighted)
      socket.emit("send-cursor", range);
    };

    // 'selection-change' fires whenever the user clicks or highlights text
    quill.on("selection-change", handler);

    return () => quill.off("selection-change", handler);
  }, [socket, quill]);

  // Handle INCOMING cursor movements (When OTHERS click around)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const cursors = quill.getModule("cursors");

    const handler = (data) => {
      // data.id is the other user's socket ID, data.range is their position
      // If they don't have a cursor drawn yet, create one for them
      cursors.createCursor(data.id, `User ${data.id.substring(0, 4)}`, "blue");

      // Move their cursor to the new location
      cursors.moveCursor(data.id, data.range);
    };

    socket.on("receive-cursor", handler);

    return () => socket.off("receive-cursor", handler);
  }, [socket, quill]);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Collaborative Editor 📝</h1>
      <p style={{ color: "gray", fontSize: "0.9rem" }}>
        Document ID: {documentId}
      </p>
      <div id="container" ref={wrapperRef} style={{ height: "400px" }}></div>
    </div>
  );
}

export default TextEditor;
