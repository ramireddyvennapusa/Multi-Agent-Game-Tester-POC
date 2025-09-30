
import React from 'react';
import { BotIcon } from './icons/BotIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-sky-500/30 pb-4">
      <div className="flex items-center justify-center gap-4">
        <BotIcon className="w-10 h-10 text-sky-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
          Multi-Agent Game Tester
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400 max-w-3xl mx-auto">
        An AI-powered framework to automate web-based game testing using a team of specialized agents.
      </p>
    </header>
  );
};
