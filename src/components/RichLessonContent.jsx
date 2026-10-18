import React from 'react';
import MathText from './MathText';
import { BookOpen, Sparkles, Hash } from 'lucide-react';

export default function RichLessonContent({ content }) {
  if (!content) return null;

  // Split lines
  const lines = content.split('\n');
  const blocks = [];
  let currentTable = null;
  let currentList = null;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim();
      if (text) {
        blocks.push({ type: 'paragraph', text });
      }
      currentParagraph = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      blocks.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
      currentTable = null;
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: 'list', items: currentList.items, ordered: currentList.ordered });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushParagraph();
      flushTable();
      flushList();
      continue;
    }

    // Markdown Table Detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushParagraph();
      flushList();

      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map(c => c.trim());

      // If it's a separator line like | :--- | :--- |
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Headings: ### Title or ## Title
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      const level = trimmed.startsWith('## ') ? 2 : 3;
      const title = trimmed.replace(/^#+\s*/, '');
      blocks.push({ type: 'heading', level, title });
      continue;
    }

    // List items: - item or 1. item
    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const text = unorderedMatch ? unorderedMatch[1] : orderedMatch[2];
      const ordered = !!orderedMatch;

      if (!currentList || currentList.ordered !== ordered) {
        flushList();
        currentList = { ordered, items: [text] };
      } else {
        currentList.items.push(text);
      }
      continue;
    } else {
      flushList();
    }

    // Display math: $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
      flushParagraph();
      blocks.push({ type: 'math', formula: trimmed });
      continue;
    }

    // Regular text line
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushTable();
  flushList();

  return (
    <div className="space-y-4 text-slate-800 dark:text-gray-200 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          return (
            <div
              key={idx}
              className="mt-6 mb-3 p-2.5 rounded-lg border-l-4 border-red-500 bg-red-50/60 dark:bg-red-950/20 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2"
            >
              <Hash className="w-4 h-4 text-red-500 shrink-0" />
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                <MathText>{block.title}</MathText>
              </h4>
            </div>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#1a1a22] border-b border-slate-200 dark:border-[#27272f]">
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="p-3 font-bold text-slate-900 dark:text-white">
                        <MathText>{renderInlineFormatting(h)}</MathText>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-slate-100 dark:border-[#202028] even:bg-slate-50/70 dark:even:bg-[#15151b] hover:bg-red-50/30 dark:hover:bg-[#1c1c24] transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-700 dark:text-gray-300">
                          <MathText>{renderInlineFormatting(cell)}</MathText>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="my-3 space-y-2 pl-1 font-sans text-sm sm:text-base">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-red-200 dark:border-red-900">
                    {block.ordered ? iIdx + 1 : '•'}
                  </span>
                  <span className="flex-1 text-slate-800 dark:text-gray-200">
                    <MathText>{renderInlineFormatting(item)}</MathText>
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'math') {
          return (
            <div key={idx} className="my-3">
              <MathText>{block.formula}</MathText>
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-gray-200">
            <MathText>{renderInlineFormatting(block.text)}</MathText>
          </p>
        );
      })}
    </div>
  );
}

// Helper to handle bold formatting **text** inside text
function renderInlineFormatting(text) {
  if (!text || typeof text !== 'string') return text;
  return text;
}
