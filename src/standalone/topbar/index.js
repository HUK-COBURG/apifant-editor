import Topbar from "./components/Topbar"
import AboutMenu from "./components/AboutMenu"

export default function() {
  return {
    statePlugins: {
      topbar: {
        actions: {
          showModal(name) {
            return {
              type: "TOPBAR_SHOW_MODAL",
              target: name
            }
          },
          hideModal(name) {
            return {
              type: "TOPBAR_HIDE_MODAL",
              target: name
            }
          },
          switchSpectralVersion(version) {
            return {
              type: "SWITCH_SPECTRAL_VERSION",
              version
            }
          },
          switchSpectralEnvironment(environment) {
            return {
              type: "SWITCH_SPECTRAL_ENVIRONMENT",
              environment
            }
          },
          setErrorsOnly(errorsOnly) {
            return {
              type: "SET_ERRORS_ONLY",
              errorsOnly
            }
          },
          setSpinnerEnabled(spinnerEnabled) {
            return {
              type: "SET_SPINNER_ENABLED",
              spinnerEnabled
            }
          }
        },
        reducers: {
          TOPBAR_SHOW_MODAL: (state, action) => state.setIn(["shownModals", action.target], true),
          TOPBAR_HIDE_MODAL: (state, action) => state.setIn(["shownModals", action.target], false),
          SWITCH_SPECTRAL_VERSION: (state, action) => state.setIn(["spectralVersion"], action.version),
          SWITCH_SPECTRAL_ENVIRONMENT: (state, action) => state.setIn(["spectralEnvironment"], action.environment),
          SET_ERRORS_ONLY:(state) => state.setIn(["errorsOnly"],!state.getIn(["errorsOnly"],true)),
          SET_SPINNER_ENABLED:(state) => state.setIn(["spinnerEnabled"],!state.getIn(["spinnerEnabled"],false))
        },
        selectors: {
          showModal: (state, name) => state.getIn(["shownModals", name], false),
          spectralVersion: (state) =>state.getIn(["spectralVersion"], "v10"),
          spectralEnvironment: (state) =>state.getIn(["spectralEnvironment"], "DE"),
          spinnerEnabled: (state) => state.getIn(["spinnerEnabled"],false),
          errorsOnly: (state) => state.getIn(["errorsOnly"],true)

        }
      }
    },
    components: {
      Topbar,
      TopbarAboutMenu: AboutMenu,
    }
  }
}
