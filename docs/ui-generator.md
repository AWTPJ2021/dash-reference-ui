# Generation of the UI Description

Run `npm run gen-meta` to generate the current files.

## Sources

### API Functions

The API Functions are generated from one source file of the dash.js Player:

1. `MediaPlayer.js`
2. `index.d.ts`

It parses the JSDoc Comments and extracts all functions with the metadata information.

### Settings

The Settings are generated from two source files of the dash.js Player:

1. `index.d.ts`
2. `settings.js`

It extracts the Interfaces from the index file and annotates them with JSDoc explanations.

## Overwrites

The files are generated to do the main work of extracting all possibilities from the DashJS Source and to auto generate a up to date version on publish. However auto generation leads to two main problems:

1. Quality issues (like Options shown as numbers instead of pretty text)
2. Unusable Components (e.g. some functions require complex objects which can't be supplied via the UI)

Thats why they can be overwritten. In order to do so simply create or update a file in the `/metadata/overwrites` folder with the schema `<version>/[settingsMetaData|mediaPlayerFunctionsMetaData].json` (e.g. `v3.2.0/settingsMetaData.json` to overwrite settings of the dashjs version 3.2.0).

The Schema of the JSON follows the same schema as those of the [Sources](#Sources). The `id` is required to map the attributes to the according field.
