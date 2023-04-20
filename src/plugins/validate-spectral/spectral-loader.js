
import { Spectral } from "@stoplight/spectral-core"
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler/with-loader";

const fs = {
    promises: {
        async readFile(filePath) {
            throw new Error("FS doesn't make sense over web, trying to load", filePath);
        }
    }
}

const store = {
    v5: {
        spectral: new Spectral(),
        initialized: false,
        entrypoint: "apic.yml"
    },
    v10: {
        spectral: new Spectral(),
        initialized: false,
        entrypoint: "apic-v10.yml"
    }
}

export async function initSpectral(version) {

    if (typeof version === "undefined" || version === null) {
        version = "v5";
    }
    console.log("Loading spectral with preset", version);

    const base = store[version];

    if (base.initialized) {
        console.log("Already initialized");
        return base.spectral;
    }
    console.log("Initializing spectral");

    let host = SPECTRAL_HOST;

    if (host === null || host === "") {
        console.log("SPECTRAL_HOST isn't set, assuming production environment");
        host = window.location.href + "valigator";
    }

    base.spectral.setRuleset(await bundleAndLoadRuleset(host + "/" + base.entrypoint, { fs, fetch }));
    base.initialized = true;
    return base.spectral;
}
