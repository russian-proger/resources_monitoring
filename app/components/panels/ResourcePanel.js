import React from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';
import * as Dog from '@material-ui/data-grid';

import "./ResourcePanel.sass";
import AddIcon from '@material-ui/icons/Add';

/** @type {Dog.GridColumns} */
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'Наименование ресурса',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Наименование поставщика',
    width: 450,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Дата обновления',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Статус',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160
  }
];

const rows = [

];

const useStyles = makeStyles({
  data_grid: {

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