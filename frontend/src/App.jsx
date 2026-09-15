import { useRef, useState } from "react";
import LinkForm from "./components/LinkForm";
import LinkList from "./components/LinkList";
import StatsPanel from "./components/StatsPanel";
import Toast from "./components/Toast";
import { loadLinks, saveLink, removeLink } from "./lib/storage";

export default function App() {
  const [links, setLinks] = useState(loadLinks);
  const [activeCode, setActiveCode] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  function showToast(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  }

  function handleCreated(link) {
    setLinks(saveLink(link));
    showToast("Short link created");
  }

  function handleRemove(shortCode) {
    setLinks(removeLink(shortCode));
  }

  function handleCopy() {
    showToast("Copied to clipboard");
  }

  return (
    <div className="app">
      <header>
        <h1>Snip</h1>
        <p className="tagline">A fast, no-account URL shortener.</p>
      </header>

      <main>
        <LinkForm onCreated={handleCreated} />
        <LinkList
          links={links}
          onSelect={setActiveCode}
          onRemove={handleRemove}
          onCopy={handleCopy}
        />
      </main>

      {activeCode && <StatsPanel shortCode={activeCode} onClose={() => setActiveCode(null)} />}
      <Toast message={toast} />
    </div>
  );
}
