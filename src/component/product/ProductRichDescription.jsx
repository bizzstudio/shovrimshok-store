// src/component/product/ProductRichDescription.jsx
// Renders enriched product data from extraData (descriptionHtml, sellingPoints,
// delivery, warranty, upgrades, videos). Each section renders only when data exists.
//
// Sanitization: html-react-parser replace() blocks script/iframe/form/object/embed
// and strips on* event attributes + javascript: hrefs — no external package required.
// Videos are never taken from descriptionHtml; only from extraData.videos (safe embed).

import parse, { domToReact } from 'html-react-parser';

// ---------------------------------------------------------------------------
// Sanitizer (used for all HTML fields)
// ---------------------------------------------------------------------------

const BLOCKED_TAGS = new Set([
  'script', 'iframe', 'frame', 'frameset',
  'form',   'object', 'embed', 'applet',
  'noscript', 'base', 'link', 'meta', 'style',
]);

function buildSanitizeOptions() {
  const options = {
    replace(domNode) {
      if (domNode.type !== 'tag') return;

      const tag = domNode.name?.toLowerCase() ?? '';

      // Remove dangerous tags entirely (content lost intentionally)
      if (BLOCKED_TAGS.has(tag)) return <></>;

      // Handle <img>: keep only safe attributes + enforce max-width
      if (tag === 'img') {
        const { src, alt } = domNode.attribs ?? {};
        if (src && /^\s*javascript:/i.test(src)) return <></>;
        return (
          <img
            src={src || ''}
            alt={alt || ''}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.375rem', margin: '0.5rem 0' }}
          />
        );
      }

      const attribs = domNode.attribs ?? {};
      let stripped = false;
      const clean = {};

      for (const [k, v] of Object.entries(attribs)) {
        const lk = k.toLowerCase();
        // Strip all event handlers
        if (lk.startsWith('on')) { stripped = true; continue; }
        // Strip javascript: URLs
        if (['href', 'src', 'action', 'formaction'].includes(lk) &&
            /^\s*javascript:/i.test(v)) { stripped = true; continue; }
        clean[k] = v;
      }

      // If nothing was stripped, let html-react-parser handle it natively
      if (!stripped) return;

      // Rebuild element with cleaned attributes; recurse into children
      const Tag = tag;
      return <Tag {...clean}>{domToReact(domNode.children, options)}</Tag>;
    },
  };
  return options;
}

// ---------------------------------------------------------------------------
// YouTube ID extraction — safe, no regex injection
// ---------------------------------------------------------------------------

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="border-t border-gray-100 pt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Flexible field renderer: string (HTML/plain) or array
// ---------------------------------------------------------------------------

function renderField(value, opts) {
  if (!value) return null;

  if (typeof value === 'string' && value.trim()) {
    return (
      <div className="rich-content text-sm text-gray-700 leading-7">
        {parse(value.trim(), opts)}
      </div>
    );
  }

  if (Array.isArray(value) && value.length > 0) {
    // Option-group structure: [{topic, required, options: [{title, price_modifier, ...}]}]
    const isOptionGroups = value.some(
      (item) => item && typeof item === 'object' && Array.isArray(item.options)
    );

    if (isOptionGroups) {
      return (
        <div className="flex flex-col gap-4">
          {value.map((group, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
              {group.topic && (
                <p className="text-sm font-semibold text-gray-700 mb-2">{group.topic}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {(group.options ?? []).map((opt, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-700"
                  >
                    <span>{opt.title ?? opt.name ?? opt.code}</span>
                    {opt.price_modifier > 0 && (
                      <span className="text-customRed font-semibold text-xs">+{opt.price_modifier}₪</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="list-disc space-y-1 pe-5">
        {value.map((item, i) => {
          const text =
            typeof item === 'string'
              ? item
              : item?.text || item?.title || item?.name || String(item);
          return (
            <li key={i} className="text-sm text-gray-700">
              {text}
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ProductRichDescription = ({ product }) => {
  const ed = product?.extraData;
  if (!ed) return null;

  const opts = buildSanitizeOptions();

  const descHtml     = typeof ed.descriptionHtml === 'string' ? ed.descriptionHtml.trim() : '';
  const delivery     = ed.delivery     ?? null;
  const warranty     = ed.warranty     ?? null;
  const sellingPts   = ed.sellingPoints ?? null;
  const upgrades     = ed.upgrades     ?? null;
  const videos       = Array.isArray(ed.videos) ? ed.videos.filter(Boolean) : [];

  const spContent  = renderField(sellingPts, opts);
  const upContent  = renderField(upgrades, opts);
  const delContent = renderField(delivery, opts);
  const warContent = renderField(warranty, opts);

  const hasAny = descHtml || spContent || delContent || warContent || upContent || videos.length;
  if (!hasAny) return null;

  return (
    <div className="mt-10 space-y-6" dir="rtl">
      {descHtml && (
        <Section title="תיאור המוצר">
          <div className="rich-content text-sm text-gray-700 leading-7">
            {parse(descHtml, opts)}
          </div>
        </Section>
      )}

      {spContent && (
        <Section title="יתרונות המוצר">
          {spContent}
        </Section>
      )}

      {delContent && (
        <Section title="משלוח ואספקה">
          {delContent}
        </Section>
      )}

      {warContent && (
        <Section title="אחריות">
          {warContent}
        </Section>
      )}

      {upContent && (
        <Section title="אפשרויות מוצר">
          {upContent}
        </Section>
      )}

      {videos.length > 0 && (
        <Section title="סרטונים">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((url, i) => {
              const id = extractYouTubeId(url);
              if (!id) return null;
              return (
                <div
                  key={i}
                  className="relative w-full rounded-lg overflow-hidden"
                  style={{ paddingBottom: '56.25%' }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={`סרטון מוצר ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Scoped styles for html-react-parser rendered content */}
      <style jsx>{`
        .rich-content h1,
        .rich-content h2 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #1f2937;
          margin: 1rem 0 0.4rem;
        }
        .rich-content h3,
        .rich-content h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
          margin: 0.75rem 0 0.35rem;
        }
        .rich-content p {
          margin: 0 0 0.65rem;
        }
        .rich-content ul,
        .rich-content ol {
          margin: 0.4rem 0 0.65rem;
          padding-right: 1.25rem;
        }
        .rich-content li {
          margin-bottom: 0.3rem;
        }
        .rich-content strong,
        .rich-content b {
          font-weight: 600;
        }
        .rich-content a {
          color: #dc2626;
          text-decoration: underline;
        }
        .rich-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.875rem;
        }
        .rich-content th,
        .rich-content td {
          border: 1px solid #e5e7eb;
          padding: 0.45rem 0.65rem;
          text-align: right;
        }
        .rich-content th {
          background: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ProductRichDescription;
