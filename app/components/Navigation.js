import React from 'react';

import { CoreProvider } from './../core/Core';
import Actions from './../store/actions';

import "./Navigation.sass";

export default function Navigation() {
  const app = React.useContext(CoreProvider);

  function openPanel(panel_name) {
    return () => {
      app.store.dispatch(Actions.setActivePanel(panel_name));
    }
  }

  const state = app.store.getState();
  const activePanel = state.get("active_panel");

  return (
    <nav className="app-navigation">
      <div onClick={ openPanel("data-collection") } className={"nav-item".concat(activePanel == "data-collection" ? " active" : "")}>
        <div className="nav-icon">
          <img src="/static/icons/search.svg" />
        </div>
        <div className="nav-name">
          <span>Сбор данных</span>
        </div>
      </div>
      <div onClick={ openPanel("monitoring") } className={"nav-item".concat(activePanel == "monitoring" ? " active" : "")}>
        <div className="nav-icon">
          <img src="/static/icons/planet.svg" />
        </div>
        <div className="nav-name">
          <span>Мониторинг ресурсов</span>
        </div>
      </div>
      <div onClick={ openPanel("updates") } className={"nav-item".concat(activePanel == "updates" ? " active" : "")}>
        <div className="nav-icon">
          <img src="/static/icons/check.svg" />
        </div>
        <div className="nav-name">
          <span>Изменённые ресурсы</span>
        </div>
      </div>
    </nav>
  )
}