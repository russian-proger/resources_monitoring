import { Map } from 'immutable';
import Redux from 'redux';

let initial_state = ({
  active_panel: "data-collection",
  resources: null
});

export default function reducer(state = Map(initial_state), action) {
  switch (action.type) {
    case "SET_STATE":
      return state.merge(action.state);
    case "SET_ACTIVE_PANEL":
      return state.update("active_panel", () => action.panel_name);
    case "SET_RESOURCES":
      return state.update("resources", () => action.resources);
    case "ADD_RESOURCE":
      return state.update("resources", rs => [action.resource, ...rs]);
    case "DELETE_RESOURCE":
      return state.update("resources", rs => rs.filter(v => action.ids.indexOf(v.id) == -1))
  }

  return state;
};