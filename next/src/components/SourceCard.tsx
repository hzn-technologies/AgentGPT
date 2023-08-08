import clsx from 'clsx';
import React from 'react';
import { FaGlobe } from 'react-icons/fa';

interface SourceCardProps {
  title: string;
  link: string;
  position: number;
}

const SourceCard = ({ title, link, position }:SourceCardProps) => {
  return (
    <div className="flex items-center p-2 border max-w-fit bg-gray-400 border-gray-400 rounded-md mt-2 ">
      <FaGlobe className="w-6 h-6 text-gray-600 mr-2" />
      <div className="flex-grow">
        <p className="font-bold text-white">{title}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm hover:underline"
        >
          {link}
        </a>
      </div>
      <span className="text-xs px-4 font-bold">{position}</span>
    </div>
  );
}

export default SourceCard;
