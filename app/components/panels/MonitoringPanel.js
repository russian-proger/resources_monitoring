import React from 'react';

import * as Dog from '@material-ui/data-grid';

import {
  Box,
  Button,
  Grid,
  TextField,
  Paper
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import "./MonitoringPanel.sass";

/** @type {Dog.GridColumns} */
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'resource',
    headerName: 'Наименование ресурса',
    width: 260,
    editable: true,
  },
  {
    field: 'provider',
    headerName: 'Наименование поставщика',
    width: 300,
    editable: true,
  },
  {
    field: 'date',
    headerName: 'Дата обновления',
    width: 200,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Статус',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 130
  }
];

const rows = [
  { id: "123", resource: "123", provider: "123", date: "123", status: "123" }
];

export default function ResourcePanel(props) {
  return (
    <>
      <div className="panel monitoring-panel">
        <Paper className="search">
          <div className="search-query">
            <TextField label="Поиск" />
          </div>
        </Paper>
        <Paper className="monitoring-table">
          <Dog.DataGrid
            rows={rows}
            columns={columns}
            scrollbarSize={15}
            disableExtendRowFullWidth={true}
            checkboxSelection
            disableSelectionOnClick
          />
        </Paper>
      </div>
    </>
  );
}