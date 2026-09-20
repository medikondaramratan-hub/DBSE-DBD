import React from 'react';
import { ShieldCheck, ShieldAlert, Zap } from 'lucide-react';

export default function DifficultyBadge({ difficulty }) {
  const diff = (difficulty || 'MEDIUM').toUpperCase();

  if (diff === 'EASY') {
    return (
      <span className="badge badge-easy">
        <ShieldCheck size={14} />
        <span>EASY</span>
      </span>
    );
  }

  if (diff === 'HARD') {
    return (
      <span className="badge badge-hard">
        <Zap size={14} />
        <span>HARD</span>
      </span>
    );
  }

  return (
    <span className="badge badge-medium">
      <ShieldAlert size={14} />
      <span>MEDIUM</span>
    </span>
  );
}
