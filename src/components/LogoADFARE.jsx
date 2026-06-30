import React from 'react';

export default function LogoADFARE({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className} 
      style={{ width: '100%', height: '100%', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Flame Gradients */}
        <linearGradient id="flame-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d92228" />    {/* Intense Red */}
          <stop offset="40%" stopColor="#f25f22" />   {/* Orange */}
          <stop offset="100%" stopColor="#fca71b" />  {/* Yellow/Gold */}
        </linearGradient>
      </defs>

      {/* Flame (Chama do Espírito) */}
      <g transform="translate(0, -10)">
        {/* Left flame tongue */}
        <path 
          d="M 238,260 
             C 215,225 180,180 205,120 
             C 220,90 242,70 248,45 
             C 230,85 240,115 255,145 
             C 275,185 270,225 238,260 Z" 
          fill="url(#flame-grad)" 
        />
        
        {/* Center flame tongue (Main) */}
        <path 
          d="M 250,265 
             C 210,210 200,140 245,65 
             C 250,55 255,40 250,20 
             C 260,60 275,85 295,115 
             C 330,170 310,225 250,265 Z" 
          fill="url(#flame-grad)" 
        />
        
        {/* Right flame tongue */}
        <path 
          d="M 262,260 
             C 285,225 320,185 305,125 
             C 295,100 280,85 278,60 
             C 295,95 285,125 272,150 
             C 255,185 250,225 262,260 Z" 
          fill="url(#flame-grad)" 
        />
      </g>

      {/* Styled Open Bible (Bíblia Estilizada ADFARE) */}
      <g fill="#212529" transform="translate(0, 0)">
        {/* Left Side Pages - Top Leaf */}
        <path d="M 243,303 C 205,290 185,263 170,250 C 172,256 185,283 223,298 Z" />
        
        {/* Left Side Pages - Middle Leaf */}
        <path d="M 245,310 C 190,290 160,255 140,240 C 145,250 172,283 227,305 Z" />
        
        {/* Left Side Pages - Bottom Leaf */}
        <path d="M 247,317 C 175,290 135,245 110,225 C 115,235 152,280 230,312 Z" />

        {/* Right Side Pages - Top Leaf */}
        <path d="M 257,303 C 295,290 315,263 330,250 C 328,256 315,283 277,298 Z" />
        
        {/* Right Side Pages - Middle Leaf */}
        <path d="M 255,310 C 310,290 340,255 360,240 C 355,250 328,283 273,305 Z" />
        
        {/* Right Side Pages - Bottom Leaf */}
        <path d="M 253,317 C 325,290 365,245 390,225 C 385,235 348,280 270,312 Z" />
        
        {/* Support Base Lines - Left Wing */}
        <path d="M 240,323 C 180,285 130,265 95,258 L 105,270 C 140,277 185,295 240,323 Z" />
        
        {/* Support Base Lines - Right Wing */}
        <path d="M 260,323 C 320,285 370,265 405,258 L 395,270 C 360,277 315,295 260,323 Z" />
        
        {/* Divider bookmarks in middle bottom */}
        <path d="M 247,325 C 248,328 249,332 250,336 C 251,332 252,328 253,325 Z" />
      </g>

      {/* Typography: "ADFARE" */}
      <text 
        x="250" 
        y="420" 
        fill="#212529" 
        fontSize="65" 
        fontFamily="'Outfit', 'Impact', 'Arial Black', sans-serif" 
        fontWeight="800" 
        textAnchor="middle"
        letterSpacing="6"
      >
        ADFARE
      </text>
    </svg>
  );
}
