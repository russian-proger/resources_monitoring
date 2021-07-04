const setState = (state) => ({
  type: "SET_STATE",
  state
});

const setActivePanel = (panel_name) => ({
  type: "SET_ACTIVE_PANEL",
  panel_name
});

const setResources = (resources) => ({
  type: "SET_RESOURCES",
  resources
});

const addResource = (resource) => ({
  type: "ADD_RESOURCE",
  resource
});

const deleteResources = (ids) => ({
  type: "DELETE_RESOURCE",
  ids
});

export default {
  setState,
  setActivePanel,
  setResources,
  addResource,
  deleteResources
}