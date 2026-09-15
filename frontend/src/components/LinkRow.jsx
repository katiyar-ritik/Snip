import { useEffect, useState } from "react";
import { fetchStats, shortLinkUrl } from "../lib/api";
import { CopyIcon, CheckIcon, ChartIcon, TrashIcon } from "./icons";

export default function LinkRow({ link, onSelect, onRemove, onCopy }) {
  const [totalClicks, setTotalClicks] = useState(null);
  const [copied, setCopied] = useState(false);
  const short = shortLinkUrl(link.shortCode);

  useEffect(() => {
    let cancelled = false;
    fetchStats(link.shortCode)
      .then((data) => !cancelled && setTotalClicks(data.totalClicks))
      .catch(() => !cancelled && setTotalClicks(null));
    return () => {
      cancelled = true;
    };
  }, [link.shortCode]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — ignore
    }
  }

  return (
    <li className="link-row">
      <div className="link-info">
        <div className="link-info-top">
          <a href={short} target="_blank" rel="noopener noreferrer" className="short-url">
            {short.replace(/^https?:\/\//, "")}
          </a>
          {totalClicks !== null && (
            <span className="click-badge">
              {totalClicks} click{totalClicks === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <span className="original-url" title={link.originalUrl}>
          {link.originalUrl}
        </span>
      </div>
      <div className="link-actions">
        <button className={copied ? "copied" : ""} onClick={handleCopy} title="Copy short link">
          {copied ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => onSelect(link.shortCode)} title="View stats">
          <ChartIcon width={15} height={15} />
          Stats
        </button>
        <button className="danger" onClick={() => onRemove(link.shortCode)} title="Remove link">
          <TrashIcon width={15} height={15} />
        </button>
      </div>
    </li>
  );
}
