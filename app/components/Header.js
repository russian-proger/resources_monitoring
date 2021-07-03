import React from 'react';

import "./Header.sass";

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo"><img src="/static/images/7.spirit.13.png" /></div>
      <div className="team-name">
        <span>7.spirit.13</span>
      </div>
      <div className="app-title">
        <span>Мониторинг строительных ресурсов</span>
      </div>
    </header>
  );
}