import { useState } from "react";

export default function TrackingSnippet({ siteId }) {
  const [copied, setCopied] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const trackerBase = apiUrl.replace(/\/api\/?$/, "");

  const snippet = `<script
  src="${trackerBase}/tracker.js"
  data-site-id="${siteId}"
  data-api="${apiUrl}/collect"
  defer
></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted uppercase tracking-wide">Tracking snippet</p>
        <button
          onClick={copy}
          className="text-xs text-pulse hover:underline font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="font-mono text-xs bg-ink border border-line rounded-md p-3.5 overflow-x-auto text-text/90">
        {snippet}
      </pre>
      <p className="text-xs text-muted mt-3">
        Paste this right before the closing <code className="text-text/80">&lt;/head&gt;</code>{" "}
        tag on every page you want to measure.
      </p>
    </div>
  );
}
