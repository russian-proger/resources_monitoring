// Фреймворк React.js
import React from 'react';
import ReactDOM from 'react-dom';

import * as Redux from 'redux';
import reducers from './store/reducers';

// Интерфейс приложения
import AppInterface from './components/AppInterface';

// Движок приложения
import { Core, CoreProvider } from './core/Core';

// Экземпляр класса-одиночки
const app = new Core();
const store = Redux.createStore(reducers);

window.app = app;

// Рендеринг интерфейса
ReactDOM.render((
  <CoreProvider.Provider value={app}>
    <AppInterface />
  </CoreProvider.Provider>
), document.getElementById("root"));

// Запуск приложения
app.init(store);

// Обновление экрана (для разработки)
window.addEventListener("keydown", (ev) => {
  if (ev.key == "F2") {
    window.location.reload();
  }
})