import { memo, useMemo } from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
}

function HighlightTextComponent({ text, query }: HighlightTextProps) {
  const parts = useMemo(() => {
    if (!query.trim()) return [{ text, highlighted: false }];

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const segments = text.split(regex);

    return segments
    .map((seg, i) => ({
        text: seg,
        highlighted: i % 2 === 1,
      }))  
      .filter((seg) => seg.text !== '');
      
  }, [text, query]);

  return (
    <>
      {parts.map((part, index) =>
        part.highlighted ? (
          <mark
            key={index}
            className="bg-yellow-200 text-inherit rounded-sm px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}

export const HighlightText = memo(HighlightTextComponent);