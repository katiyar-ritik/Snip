import { useState } from "react";
import { createLink } from "../lib/api";
import { LinkIcon } from "./icons";

export default function LinkForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const link = await createLink(url.trim(), alias.trim());
      onCreated(link);
      setUrl("");
      setAlias("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="link-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="url">Long URL</label>
        <div className="input-with-icon">
          <LinkIcon width={16} height={16} className="input-icon" />
          <input
            id="url"
            type="text"
            placeholder="https://example.com/some/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="field field-alias">
        <label htmlFor="alias">Custom alias (optional)</label>
        <input
          id="alias"
          type="text"
          placeholder="my-link"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          pattern="[a-zA-Z0-9_-]{3,32}"
          title="3-32 letters, numbers, hyphens, or underscores"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Shortening..." : "Shorten"}
      </button>
      {error && <p className="error form-error">{error}</p>}
    </form>
  );
}
