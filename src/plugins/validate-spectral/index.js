// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateJsonSpec` is dispatched.

import * as spectralCore from "@stoplight/spectral-core"
import * as Parsers from "@stoplight/spectral-parsers"; // make sure to install the package if you intend to use default parsers!

import { truthy } from "@stoplight/spectral-functions"; // this has to be installed as well

const { Spectral, Document } = spectralCore;

export const updateJsonSpec = (ori, { specActions }) => (...args) => {
    ori(...args)

    const [spec] = args
    specActions.validateSpec(spec)
}


//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => (arg) => {
    const severityToLevel = {
        0: "error",
        1: "warning",
        2: "info",
        3: "info",
        4: "info",
    }
    console.log('core', spectralCore)

    const yaml = new Document(arg.specSelectors.specStr(), Parsers.Yaml, "/ignoreme")

    const spectral = new Spectral();
    spectral.setRuleset({

        // this will be our ruleset

        rules: {

            "no-empty-description": {

                given: "$..description",

                message: "Description must not be empty",

                then: {

                    function: truthy,

                },

            },

        },

    });

    // NOTE: This assumes that the REST API is available under the same host
    // TODO: This might need to use a different ruleset depending on input
    spectral.run(yaml)
        .then(response => {
            console.log(response);
            const errors = response.map((entry) => {
                return {
                    level: 0,//severityToLevel[entry.severity],
                    message: entry.message,
                    path: entry.path,
                    line: entry.range.start.line + 1
                }
            })
            console.log("errors", errors);
            if (errors.length > 0) {
                console.log('ich geh hier rein')
                arg.errActions.newSpecErrBatch(errors)
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
                },
                wrapActions: {
                    updateJsonSpec
                }
            }
        }
    }
}
