// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateJsonSpec` is dispatched.

import * as spectralCore from "@stoplight/spectral-core"
import * as Parsers from "@stoplight/spectral-parsers"; // make sure to install the package if you intend to use default parsers!
import debounce from "lodash/debounce"
import ruleset from "./ruleset"

const { Spectral, Document } = spectralCore;

export const updateJsonSpec = (ori, { specActions }) => (...args) => {
    ori(...args)

    const [spec] = args
    specActions.validateSpec(spec)
}

// The bounce seems to be important
const bounceErrors = debounce((errors, f) => {
    f(errors)
}, 500)

const SOURCE = "spectral"

//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => (arg) => {

    // Need to do this or errors will just add up
    arg.errActions.clear({
        source: SOURCE
    })

    const severityToLevel = {
        0: "error",
        1: "warning",
        2: "info",
        3: "info",
        4: "info",
    }

    const yaml = new Document(arg.specSelectors.specStr(), Parsers.Yaml, "/ignoreme")

    const spectral = new Spectral();
    spectral.setRuleset({

        // this will be our ruleset
        rules: ruleset.rules

    });

    // NOTE: This assumes that the REST API is available under the same host
    // TODO: This might need to use a different ruleset depending on input
    spectral.run(yaml)
        .then(response => {
            const errors = response.map((entry) => {
                return {
                    level: severityToLevel[entry.severity],
                    message: entry.message,
                    path: entry.path.join("."),
                    line: entry.range.start.line + 1,
                    source: SOURCE
                }
            })
            console.log("errors", errors);
            if (errors.length > 0) {
                // for some reason this works better than newSpecErrBatch
                bounceErrors(errors, arg.errActions.newThrownErrBatch)

            }
        }
        ).catch((error) => {
            console.error("Error:", error)
        })
}

export default function() {
    return {
        statePlugins: {
            spec: {
                actions: {
                    validateSpec,
                }
            }
        }
    }
}
