import React from 'react';
import { CoreProvider } from '../core/Core';

var count = 0;
export default function AppInterface(_props) {
  // Таким образом получаем ядро приложения во всех компонентах
  const app = React.useContext(CoreProvider);

  const [state, setState] = React.useState({
    activePanel: "main", // Текущая панель
    activeProps: {},     // Свойства, передаваемые этому панелю
    activeView: "main",  // Текущее окно
    history: ["main"],   // История панелей для iosSwipeBack
    props: {},           // История свойств
    popout: null         // Для модальных окон
  });
  
  function openPopout() {

  }

  function closePopout() {

  }
  
  function openPanel() {

  }

  function closePanel() {
    
  }

  function switchPanel() {
    
  }


  React.useLayoutEffect(() => {
    app.Event.addEventListener("closepopout", closePopout);
    app.Event.addEventListener("openpopout", openPopout);
    return () => {
      app.Event.removeEventListener("closepopout", closePopout);
      app.Event.removeEventListener("openpopout", openPopout);
    }
  }, [state.activePanel, state.popout]);

  // Добавляем слушатели к событиям
  React.useLayoutEffect(() => {
    app.Event.addEventListener("openpanel" , openPanel);
    app.Event.addEventListener("closepanel", closePanel);
    app.Event.addEventListener("switchpanel", switchPanel);
    return () => {
      app.Event.removeEventListener("openpanel",  openPanel);
      app.Event.removeEventListener("closepanel", closePanel);
      app.Event.removeEventListener("switchpanel", switchPanel);
    }
  }, [state]);

  return (
    <></>
  );
}