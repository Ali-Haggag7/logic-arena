'use client';

import { useMemo, useState } from 'react';
import { TokenCounter } from './TokenCounter';

const CLASSIC_TOKEN_BUDGET = 10;

interface WordLevelEditorProps {
  script: string;
  tokensLeft: number;
  maxTokens?: number;
  onChange: (script: string, tokensLeft: number) => void;
}

export function WordLevelEditor({
  script,
  tokensLeft,
  maxTokens = CLASSIC_TOKEN_BUDGET,
  onChange,
}: WordLevelEditorProps) {
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [draftWord, setDraftWord] = useState('');
  const words = useMemo(
    () => script.split(/\s+/).filter((word) => word.length > 0),
    [script],
  );
  const disabled = tokensLeft === 0;

  const spendToken = (nextWords: string[]): void => {
    onChange(nextWords.join(' '), Math.max(0, tokensLeft - 1));
  };

  const deleteWord = (index: number): void => {
    if (disabled) return;
    spendToken(words.filter((_, wordIndex) => wordIndex !== index));
  };

  const openInsert = (index: number): void => {
    if (disabled) return;
    setInsertIndex(index);
    setDraftWord('');
  };

  const confirmInsert = (): void => {
    const word = draftWord.trim();
    if (insertIndex === null || word.length === 0 || disabled) return;
    const nextWords = [...words];
    nextWords.splice(insertIndex, 0, word);
    setInsertIndex(null);
    setDraftWord('');
    spendToken(nextWords);
  };

  return (
    <div className="flex min-h-0 grow flex-col gap-3">
      <TokenCounter current={tokensLeft} max={maxTokens} />
      <div
        className={`min-h-64 grow rounded-lg border p-3 font-mono text-[13px] leading-7 select-none transition-colors ${
          disabled 
            ? 'border-red-900/40 bg-black/50' 
            : 'border-cyan-900/40 bg-black/50'
        }`}
        onCopy={(event) => event.preventDefault()}
        onCut={(event) => event.preventDefault()}
        onPaste={(event) => event.preventDefault()}
        onMouseDown={(event) => {
          if (event.detail > 1) event.preventDefault();
        }}
      >
        <button
          type="button"
          aria-label="Insert word at start"
          disabled={disabled}
          onClick={() => openInsert(0)}
          className="mx-0.5 inline-flex h-6 w-4 cursor-pointer items-center justify-center rounded disabled:cursor-default transition-colors border border-dashed border-cyan-800/40 hover:border-cyan-400/60 hover:bg-cyan-900/20"
        />
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-flex items-center">
            {insertIndex === index && <InlineWordInput value={draftWord} setValue={setDraftWord} onConfirm={confirmInsert} />}
            <button
              type="button"
              disabled={disabled}
              onClick={() => deleteWord(index)}
              className="mx-0.5 cursor-pointer rounded border border-transparent px-1.5 py-0.5 transition-all disabled:cursor-default disabled:text-cyan-800 text-cyan-300 hover:border-purple-500/50 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:text-purple-400"
            >
              {word}
            </button>
            <button
              type="button"
              aria-label={`Insert word after ${word}`}
              disabled={disabled}
              onClick={() => openInsert(index + 1)}
              className="mx-0.5 inline-flex h-6 w-4 cursor-pointer items-center justify-center rounded disabled:cursor-default transition-colors border border-dashed border-cyan-800/40 hover:border-cyan-400/60 hover:bg-cyan-900/20"
            />
          </span>
        ))}
        {insertIndex === words.length && (
          <InlineWordInput
            value={draftWord}
            setValue={setDraftWord}
            onConfirm={confirmInsert}
          />
        )}
      </div>
    </div>
  );
}

function InlineWordInput({
  value,
  setValue,
  onConfirm,
}: {
  value: string;
  setValue: (value: string) => void;
  onConfirm: () => void;
}) {
  return (
    <input
      aria-label="New word"
      autoFocus
      className="mx-1 h-7 w-24 rounded border border-cyan-500/50 bg-black/60 px-2 text-cyan-300 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] placeholder-cyan-800"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onConfirm();
      }}
    />
  );
}
