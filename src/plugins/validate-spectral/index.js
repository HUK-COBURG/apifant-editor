// Base validate plugin that provides a placeholder `validateSpec` that fires
// after `updateJsonSpec` is dispatched.

import { Document } from "@stoplight/spectral-core"
import { initSpectral } from "./spectral-loader"
import { Yaml } from "@stoplight/spectral-parsers"
import debounce from "lodash/debounce"

export const updateJsonSpec = (ori, { specActions }) => (...args) => {
    ori(...args)

    const [spec] = args
    specActions.validateSpec(spec)
}

const bounceErrors = debounce((errors, f) => {
    f(errors)
}, 500)

const severityToLevel = {
    0: "error",
    1: "warning",
    2: "info",
    3: "info",
    4: "info",
}
const SOURCE = "spectral"
//eslint-disable-next-line no-unused-vars
export const validateSpec = (jsSpec) => async (arg) => {
    arg.errActions.clear({
        source: SOURCE
    })
    const ruleSet = arg.topbarSelectors.spectralVersion()

    try {
        const start = performance.now();
        const spectral = await initSpectral(ruleSet);
        const document = new Document(arg.specSelectors.specStr(), Yaml, "openapi.yaml");
        const result = await spectral.run(document);
        if (result && result.length > 0) {
            const errors = result.map(({ severity, message, path, range: { start: { line } } }) => ({
                level: severityToLevel[severity],
                message,
                path: path.join("."),
                line: line + 1,
                source: SOURCE
            }))
            bounceErrors(errors, arg.errActions.newThrownErrBatch)
        }
        const end = performance.now();
        console.log(`Spectral validation took ${end - start} ms`);
    } catch (e) {
        console.error(e);
    }
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
