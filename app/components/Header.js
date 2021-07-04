import React from 'react';

import "./Header.sass";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-title">
        <span>Мониторинг строительных ресурсов</span>
      </div>
      <div className="team-name">
        <span>Team:  7.spirit.13</span>
      </div>
      <div className="logo"><img src="/static/images/7.spirit.13.svg" /></div>
    </header>
  );
}