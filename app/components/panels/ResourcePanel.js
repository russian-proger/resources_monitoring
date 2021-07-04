import React from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';
import * as Dog from '@material-ui/data-grid';

import "./ResourcePanel.sass";
import AddIcon from '@material-ui/icons/Add';

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

const useStyles = makeStyles({
  data_grid: {
    // '& .MuiDataGrid-columnsContainer': {
    //   width: 'fit-content'
    // }
  }
})

export default function ResourcePanel(props) {
  const classes = useStyles();
  return (
    <>
      <div className="panel resource-panel">
        <section className="add-resource-block">
          <div className="row">
            <div className="input-wrapper">
              <TextField label="Наименование поставщика" />
            </div>
            <div className="input-wrapper">
              <TextField label="Наименование строительного ресурса" />
            </div>
          </div>
          <div className="row">
            <div className="input-wrapper wide">
              <TextField label="Ссылка на страницу ресурса" />
            </div>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="input-wrapper wide">
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
              >
                Добавить
              </Button>
            </div>
          </div>
        </section>
        <section className="resources-table">
          <Dog.DataGrid
            className={classes.data_grid}
            rows={rows}
            columns={columns}
            scrollbarSize={15}
            disableExtendRowFullWidth={true}
            checkboxSelection
          />
        </section>
      </div>
    </>
  );
}