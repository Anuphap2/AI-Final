import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Helper to render inline math segments ($...$)
function renderInlineMath(text) {
  if (typeof text !== 'string') return text;
  if (!text.includes('$')) return text;

  const parts = text.split(/(\$[^$\n]+?\$)/g);
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      const formula = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
        });
        return (
          <span
            key={index}
            className="inline-block px-1 py-0.5 mx-0.5 rounded bg-slate-100/80 dark:bg-slate-800/60 text-slate-950 dark:text-slate-100 font-semibold align-baseline text-[1.05em]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (e) {
        return (
          <code key={index} className="text-red-500 font-mono text-xs px-1 rounded bg-red-50 dark:bg-red-950 border border-red-200">
            {part}
          </code>
        );
      }
    }
    return part;
  });
}

// Helper to render text with bold formatting (**text**) and nested inline math
function renderTextWithBoldAndMath(str) {
  if (typeof str !== 'string') return str;
  if (!str.includes('**')) return renderInlineMath(str);

  const boldParts = str.split(/(\*\*[\s\S]*?\*\*)/g);
  return boldParts.map((bp, bIdx) => {
    if (!bp) return null;
    if (bp.startsWith('**') && bp.endsWith('**') && bp.length >= 4) {
      const innerText = bp.slice(2, -2);
      return (
        <strong key={bIdx} className="font-bold text-slate-950 dark:text-white">
          {renderInlineMath(innerText)}
        </strong>
      );
    }
    return <span key={bIdx}>{renderInlineMath(bp)}</span>;
  });
}

export default function MathText({ children, className = '' }) {
  if (typeof children !== 'string') return children;

  // Split text by $$...$$ (display block) first
  const displayRegex = /(\$\$[\s\S]*?\$\$)/g;
  const parts = children.split(displayRegex);

  return (
    <span className={`katex-wrapper ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
          const formula = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="my-3 block overflow-x-auto p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-[#27272f] bg-slate-50/90 dark:bg-[#16161c] text-slate-900 dark:text-white text-center shadow-xs text-base sm:text-lg"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return (
              <code key={index} className="text-red-500 font-mono text-xs px-2 py-1 bg-red-50 dark:bg-red-950 rounded border border-red-200 block my-1">
                {part}
              </code>
            );
          }
        }

        return <span key={index}>{renderTextWithBoldAndMath(part)}</span>;
      })}
    </span>
  );
}
