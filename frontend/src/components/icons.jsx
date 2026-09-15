// Small, dependency-free icon set. Each icon is just an inline SVG so we
// don't need to install an icon library for a handful of shapes.

const common = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LinkIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 15L15 9" />
      <path d="M10.5 6.5L12 5a4 4 0 0 1 5.66 5.66l-1.5 1.5" />
      <path d="M13.5 17.5L12 19a4 4 0 0 1-5.66-5.66l1.5-1.5" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ChartIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function DownloadIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
