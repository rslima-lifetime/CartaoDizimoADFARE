import React from 'react';
import logoUrl from '../assets/logo_adfare.png';

export default function LogoADFARE({ className = '', style = {} }) {
  return (
    <img 
      src={logoUrl} 
      alt="Logo ADFARE" 
      className={className} 
      style={{ width: '100%', height: '100%', objectFit: 'contain', ...style }}
    />
  );
}
