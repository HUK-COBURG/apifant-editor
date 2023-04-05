import { truthy, xor, falsy, pattern, defined } from "@stoplight/spectral-functions"; // this has to be installed as well

export default {
    "documentationUrl": "https://confluence.lan.huk-coburg.de/pages/viewpage.action?pageId=14483875",
    "rules": {
        "schema-oas": {
            "given": "$",
            "severity": "error",
            "description": "Api muss entweder im Swagger-, oder im OpenAPI-Format definiert sein. Für ein Beispiel bitte [>>>hier klicken<<<](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=1&lineEnd=1&lineStartColumn=1&lineEndColumn=15&lineStyle=plain&_a=contents)",
            "then": {
                "function": xor,
                "functionOptions": {
                    "properties": [
                        "swagger",
                        "openapi"
                    ]
                }
            }
        },
        "info-contact-email": {
            "description": "Die hinterlegte Emailadresse muss einen internen Briefkasten referenzieren: GgpOrg-<Orga>@mail.intern oder GBK-*@mail.intern. Für ein Beispiel bitte [>>>hier klicken<<<](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=8&lineEnd=8&lineStartColumn=12&lineEndColumn=35&lineStyle=plain&_a=contents)",
            "given": "$.info.contact.email",
            "severity": "error",
            "then": {
                "function": pattern,
                "functionOptions": {
                    "match": "/^([Gg]gp[Oo]rg-[A-Za-z]{2,2}[0-9]{2,2}|[Gg][Bb][Kk]-[A-Za-z0-9-]+|[Gg][Vv][Gg]-[A-Za-z0-9-]+)@(mail\\.intern|huk-coburg\\.de)$/"
                }
            }
        },
        "x-ibm-name": {
            "given": "$.info",
            "severity": "error",
            "then": [
                {
                    "field": "x-ibm-name",
                    "function": truthy
                }
            ]
        },
        "base-path-exist": {
            "description": "Bitte geben sie einen 'basePath' an, der nicht leer ist. Für ein Beispiel bitte [>>>hier klicken<<<](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=10&lineEnd=10&lineStartColumn=1&lineEndColumn=9&lineStyle=plain&_a=contents)",
            "given": "$",
            // "formats": [
            //     "oas2"
            // ],
            "severity": "error",
            "then": [
                {
                    "field": "basePath",
                    "function": truthy
                },
                {
                    "field": "basePath",
                    "function": pattern,
                    "functionOptions": {
                        "match": "^/.+$"
                    }
                }
            ]
        },
        "no-x-fields": {
            "description": "Die Felder 'x-messages' und 'x-validation' führen zu Fehlern und müssen deswegen entfernt werden",
            "given": "$.definitions[*]..",
            "severity": "error",
            "then": [
                {
                    "field": "x-messages",
                    "function": falsy
                },
                {
                    "field": "x-validation",
                    "function": falsy
                }
            ]
        },
        "x-ibm-configuration-assembly": {
            "given": "$.x-ibm-configuration",
            "description": "Der 'assembly'-Abschnitt der Api fehlt, hier unterstützt das Apic Team bei Fragen",
            "severity": "error",
            "then": {
                "field": "assembly",
                "function": truthy
            }
        },
        "x-ibm-configuration-execute": {
            "given": "$.x-ibm-configuration..assembly",
            "description": "Der 'execute'-Abschnitt der Api fehlt unter 'assembly', hier unterstützt das Apic Team bei Fragen",
            "severity": "error",
            "then": {
                "field": "execute",
                "function": truthy
            }
        },
        "x-ibm-configuration-target-url": {
            "description": "Die Zielurl sollte über das Property '[target-url](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=353&lineEnd=353&lineStartColumn=5&lineEndColumn=16&lineStyle=plain&_a=contents)', oder '[datapower-consumer-gateway-url](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=357&lineEnd=357&lineStartColumn=5&lineEndColumn=35&lineStyle=plain&_a=contents)' aufgerufen werden und mit $api.operation.path abschließen. Für ein Beispiel bitte [>>>hier klicken<<<](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=310&lineEnd=310&lineStartColumn=21&lineEndColumn=88&lineStyle=plain&_a=contents)",
            "given": "$.x-ibm-configuration.assembly.execute..invoke",
            "severity": "error",
            "type": "style",
            "then": [
                {
                    "field": "target-url",
                    "function": truthy
                },
                {
                    "field": "target-url",
                    "function": pattern,
                    "functionOptions": {
                        "match": "/^(https:\\/\\/[A-z0-9._$)(-]+(:[0-9]{1,5}){0,1}((\\/[A-z0-9._-]+)*|(\\/\\$\\(api\\.root\\)){0,1})|\\$\\(target-url.*\\))\\$\\(api\\.operation\\.path\\)|request\\.search\\)|\\$\\(datapower-consumer-gateway-url\\)\\$\\(api\\.operation\\.path\\)|request\\.search\\)/"
                    }
                }
            ]
        },
        "x-ibm-configuration-openshift-url": {
            "description": "Openshift LAN DEV ist eine reine Entwicklungsumgbeung und kann deswegen nicht als Ziel verwendet werden",
            "given": "$.x-ibm-configuration.assembly.execute..invoke",
            "severity": "error",
            "type": "style",
            "then": [
                {
                    "field": "target-url",
                    "function": pattern,
                    "functionOptions": {
                        "notMatch": "/apps\\.lan-dev\\.ocp\\.lan\\.huk-coburg\\.de/"
                    }
                }
            ]
        },
        "x-ibm-configuration-properties-target-url": {
            "description": "Die Zielurl im Property 'target-url' muss über https aufgerufen werden",
            "given": "$.x-ibm-configuration.properties.target-url",
            "severity": "error",
            "type": "style",
            "then": [
                {
                    "field": "value",
                    "function": pattern,
                    "functionOptions": {
                        "match": "/^https:\\/\\/[A-z0-9._$)(-]+(:[0-9]{1,5}){0,1}(\\/[A-z0-9._-]+)*/"
                    }
                }
            ]
        },
        "x-ibm-configuration-properties-target-url-openshift": {
            "description": "Openshift LAN DEV ist eine reine Entwicklungsumgbeung und kann deswegen nicht im Property 'target-url' verwendet werden",
            "given": "$.x-ibm-configuration.properties.target-url",
            "severity": "error",
            "type": "style",
            "then": [
                {
                    "field": "value",
                    "function": pattern,
                    "functionOptions": {
                        "notMatch": "/apps\\.lan-dev(-[0-9]+)*\\.ocp\\.lan\\.huk-coburg\\.de/"
                    }
                }
            ]
        },
        "x-ibm-configuration-validate": {
            "description": "x-ibm-configuration validate MUST have a definition defined.",
            "given": "$.x-ibm-configuration.assembly.execute[*].switch..otherwise.[validate]",
            "severity": "error",
            "then": {
                "field": "definition",
                "function": truthy
            }
        },
        "x-ibm-configuration-gateway": {
            "description": "Unter x-ibm-configuration' muss 'gateway: datapower-api-gateway' definiert sein. Für ein Beispiel bitte [>>>hier klicken<<<](https://tfs/web/DefaultCollection/GIT_Projects/_git/apic?path=%2Fdocs%2Fv10%2Fsrc%2Fexamples%2Fv10-api.yaml&version=GBmaster&line=251&lineEnd=251&lineStartColumn=3&lineEndColumn=33&lineStyle=plain&_a=contents)",
            "given": "$.x-ibm-configuration",
            "severity": "error",
            "then": [
                {
                    "field": "gateway",
                    "function": truthy
                },
                {
                    "field": "gateway",
                    "function": pattern,
                    "functionOptions": {
                        "match": "/^datapower-api-gateway$/"
                    }
                }
            ]
        },
    }
}
