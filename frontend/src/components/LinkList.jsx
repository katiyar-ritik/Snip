import LinkRow from "./LinkRow";
import { LinkIcon } from "./icons";

export default function LinkList({ links, onSelect, onRemove, onCopy }) {
  if (links.length === 0) {
    return (
      <div className="empty-state">
        <LinkIcon width={28} height={28} />
        <p>No links yet. Shorten your first URL above.</p>
      </div>
    );
  }

  return (
    <ul className="link-list">
      {links.map((link) => (
        <LinkRow
          key={link.shortCode}
          link={link}
          onSelect={onSelect}
          onRemove={onRemove}
          onCopy={onCopy}
        />
      ))}
    </ul>
  );
}
