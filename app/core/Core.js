import React from 'react';

import * as Redux from 'redux';

import { Map } from 'immutable';

import Event from './Event';
import FileSystem from './FileSystem';
import StringSystem from './String';
import Network from './Network';


export function Core() {
  /** @type {Redux.Store<Map>} */
  this.store = null;

  this.init = function init(store) {
    this.store = store;

    setInterval(() => this.Network.online(), 60 * 1000);
  };

  // Событийный элемент
  this.Event = new Event(this);

  // Система загрузки и кэширования файлов
  this.File = new FileSystem(this);

  // Дополнительные возможности для работы со строками
  this.String = new StringSystem(this);

  // Объект для взаимодействия с сервером
  this.Network = new Network(this);
}

export const CoreProvider = React.createContext(new Core());