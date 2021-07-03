import { Map } from 'immutable';
import Redux from 'redux';

let initial_state = ({
  active_panel: "data-collection"
});

export default function reducer(state = Map(initial_state), action) {
  switch (action.type) {
    case "SET_STATE":
      return state.merge(action.state);
    case "SET_ACTIVE_PANEL":
      return state.update("active_panel", () => action.panel_name);
  }

  return state;
};