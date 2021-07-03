import React from 'react';
import { CoreProvider } from '../core/Core';

import Header from './Header';
import Navigation from './Navigation';

import "./AppInterface.sass";

var count = 0;
export default function AppInterface(_props) {
  // Таким образом получаем ядро приложения во всех компонентах
  const app = React.useContext(CoreProvider);
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);

  function openPopout() {

  }

  function closePopout() {

  }

  const state = app.store.getState();
  const activePanel = state.get("active_panel");
  const activePopout = state.get("active_popout");

  React.useLayoutEffect(() => {
    app.Event.addEventListener("closepopout", closePopout);
    app.Event.addEventListener("openpopout", openPopout);
    return () => {
      app.Event.removeEventListener("closepopout", closePopout);
      app.Event.removeEventListener("openpopout", openPopout);
    }
  }, [activePanel, activePopout]);

  React.useEffect(() => {
    return app.store.subscribe(v => {
      let newPanel = app.store.getState().get("active_panel");
      if (newPanel != activePanel) forceUpdate();
    });
  });

  return (
    <>
      <Header />
      <main className="app-main">
        <Navigation />
        <div className="panel">
          {activePanel}
        </div>
      </main>
    </>
  );
}