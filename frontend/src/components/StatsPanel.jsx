import { useEffect, useState } from "react";
import { fetchStats, qrCodeUrl } from "../lib/api";
import { CloseIcon, DownloadIcon } from "./icons";

export default function StatsPanel({ shortCode, onClose }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchStats(shortCode)
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div className="stats-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <CloseIcon width={18} height={18} />
        </button>
        <h2>/{shortCode}</h2>
        {error && <p className="error">{error}</p>}

        {!stats && !error && (
          <div className="stats-loading">
            <div className="spinner" />
            <p>Loading stats...</p>
          </div>
        )}

        {stats && (
          <>
            <p className="original-url">{stats.originalUrl}</p>

            <div className="qr-block">
              <img className="qr" src={qrCodeUrl(shortCode)} alt={`QR code for ${shortCode}`} />
              <a
                className="download-link"
                href={qrCodeUrl(shortCode)}
                download={`${shortCode}-qrcode.png`}
              >
                <DownloadIcon width={14} height={14} />
                Download QR
              </a>
            </div>

            <p className="click-total">
              <strong>{stats.totalClicks}</strong> total click{stats.totalClicks === 1 ? "" : "s"}
            </p>

            <h3>Recent activity</h3>
            {stats.recentClicks.length === 0 ? (
              <p className="empty-state small">No clicks yet.</p>
            ) : (
              <ul className="click-list">
                {stats.recentClicks.map((click, i) => (
                  <li key={i}>
                    <span>{click.clicked_at}</span>
                    <span>{click.referrer || "direct"}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
