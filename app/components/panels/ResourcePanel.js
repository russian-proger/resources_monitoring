import React from 'react';
import { IconButton, TextField, Button, makeStyles, CircularProgress } from '@material-ui/core';
import * as Dog from '@material-ui/data-grid';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { CoreProvider } from './../../core/Core';
import Actions from '../../store/actions';

import "./ResourcePanel.sass";


/** @type {Dog.GridColumns} */
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'resource_name',
    headerName: 'Наименование ресурса',
    width: 260,
    editable: true,
  },
  {
    field: 'provider_name',
    headerName: 'Наименование поставщика',
    width: 300,
    editable: true,
  },
  {
    field: 'created_date',
    headerName: 'Дата обновления',
    width: 200,
    editable: false,
  },
  {
    field: 'link',
    headerName: 'Ссылка на ресурс',
    editable: false,
    width: 350
  },
  {
    field: 'code',
    headerName: 'Код ресурса',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200
  }
];

export default function ResourcePanel(props) {
  const app = React.useContext(CoreProvider);
  const [_count, forceUpdate] = React.useReducer(x => x + 1, 0);

  const inputProviderRef = React.useRef(null);
  const inputResourceRef = React.useRef(null);
  const inputLinkRef = React.useRef(null);
  const [uploadingResource, setUploadingResource] = React.useState()
  const [selectedIDs, setSelectedIDs] = React.useState([]);

  function onClick() {
    const provider_name = inputProviderRef.current.value;
    const resource_name = inputResourceRef.current.value;
    const resource_link = inputLinkRef.current.value;

    setUploadingResource(true);
    app.Network.uploadResource({ provider_name, resource_name, resource_link }).then((response) => {
      setTimeout(() => {
        setUploadingResource(false);
        app.store.dispatch(Actions.addResource(response.result));
      }, 1000);
    })
  }

  function udpateResources() {
    app.Network.getResources().then(response => {
      app.store.dispatch(Actions.setResources(response.result));
    })
  }

  function deleteResources() {
    setSelectedIDs([]);
    app.Network.deleteResources(selectedIDs).then(response => {
      app.store.dispatch(Actions.deleteResources(selectedIDs));
    })
  }

  React.useEffect(() => {
    udpateResources();
  }, []);

  React.useEffect(() => {
    let state = app.store.getState();
    let _resources = state.get("resources");
    return app.store.subscribe(() => {
      let state = app.store.getState();
      let resources = state.get("resources");
      if (resources != _resources) {
        forceUpdate();
      }
    })
  });

  function onRowSelect(ev) {
    if (ev.isSelected) {
      setSelectedIDs([...selectedIDs, ev.data.id]);
    } else {
      let index = selectedIDs.indexOf(ev.data.id);
      setSelectedIDs(selectedIDs.slice(0, index).concat(selectedIDs.slice(index + 1)));
    }
    console.log(ev);
  }

  const state = app.store.getState();
  const resources = state.get("resources");

  return (
    <>
      <div className="panel resource-panel">
        <section className="add-resource-block">
          <div className="row">
            <div className="input-wrapper">
              <TextField inputRef={inputProviderRef} label="Наименование поставщика" />
            </div>
            <div className="input-wrapper">
              <TextField inputRef={inputResourceRef} label="Наименование строительного ресурса" />
            </div>
          </div>
          <div className="row">
            <div className="input-wrapper wide">
              <TextField inputRef={inputLinkRef} label="Ссылка на страницу ресурса" />
            </div>
          </div>
          <div className="row"></div>
          <div className="row">
            <div className="input-wrapper wide">
              <Button
                onClick={ onClick }
                variant="contained"
                color="primary"
                size="large"
                startIcon={uploadingResource ? null : <AddIcon />}
                disabled={uploadingResource}
              >
                {uploadingResource ? <CircularProgress size={26} /> : "Добавить"}
              </Button>
            </div>
          </div>
        </section>
        <section className="resources-table">
          {resources != null && 
            <div className="buttons-row">
              <IconButton onClick={deleteResources} disabled={selectedIDs.length == 0}><DeleteIcon /></IconButton>
            </div>
          }
          <div className="table">
            {resources != null && 
              <Dog.DataGrid
                rows={resources}
                columns={columns}
                scrollbarSize={15}
                disableExtendRowFullWidth={true}
                checkboxSelection
                disableSelectionOnClick
                onRowSelected={onRowSelect}
              ></Dog.DataGrid>
            }
            {resources == null && <CircularProgress />}
          </div>
        </section>
      </div>
    </>
  );
}