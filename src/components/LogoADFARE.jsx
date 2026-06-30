import React from 'react';

export default function LogoADFARE({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      style={{ width: '100%', height: '100%', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue Circular Background */}
      <circle cx="100" cy="100" r="96" fill="#005fa4" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff" strokeWidth="2.5" />
      
      {/* Flame (Fogo do Espírito Santo) */}
      <g transform="translate(100, 85) scale(0.95)">
        {/* Outer Red Flame */}
        <path 
          d="M 0,-45 C 18,-20 30,-5 20,20 C 10,40 -10,40 -20,20 C -30,-5 -18,-20 0,-45 Z" 
          fill="#e63946" 
        />
        {/* Middle Orange/Yellow Flame */}
        <path 
          d="M 0,-30 C 12,-12 20,-2 13,15 C 7,28 -7,28 -13,15 C -20,-2 -12,-12 0,-30 Z" 
          fill="#f9a825" 
        />
        {/* Inner Yellow Flame */}
        <path 
          d="M 0,-15 C 8,-3 12,3 8,12 C 4,20 -4,20 -8,12 C -12,3 -8,-3 0,-15 Z" 
          fill="#fff176" 
        />
      </g>
      
      {/* Open Bible Pages (Livro/Bíblia Sagrada) */}
      <g transform="translate(100, 115) scale(1.1)">
        {/* Pages Shadow/Base */}
        <path d="M-35,8 Q-18,2 0,8 Q18,2 35,8 L35,22 Q18,16 0,22 Q-18,16 -35,22 Z" fill="#0c4a6e" />
        {/* White Left Page */}
        <path d="M-32,5 Q-16,0 0,6 L0,18 Q-16,12 -32,17 Z" fill="#ffffff" />
        {/* White Right Page */}
        <path d="M32,5 Q16,0 0,6 L0,18 Q16,12 32,17 Z" fill="#ffffff" />
        {/* Center Divider/Bookmark */}
        <line x1="0" y1="6" x2="0" y2="19" stroke="#e63946" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      
      {/* Text "ADFARE" */}
      <text 
        x="100" 
        y="165" 
        fill="#ffffff" 
        fontSize="24" 
        fontFamily="'Arial Black', Impact, sans-serif" 
        fontWeight="900" 
        textAnchor="middle"
        letterSpacing="2"
      >
        ADFARE
      </text>
    </svg>
  );
}
