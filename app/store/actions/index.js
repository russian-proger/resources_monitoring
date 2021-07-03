const setState = (state) => ({
  type: "SET_STATE",
  state
});

const setActivePanel = (panel_name) => ({
  type: "SET_ACTIVE_PANEL",
  panel_name
})

export default {
  setState,
  setActivePanel
}