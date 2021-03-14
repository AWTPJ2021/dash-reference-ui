[Demo](https://awtpj.z16.web.core.windows.net/) | [Previous Version](https://reference.dashif.org/dash.js/v3.1.3/samples/dash-if-reference-player/index.html)

# dashjs-reference-ui

This is a reference implementation of the [dash-js](https://github.com/Dash-Industry-Forum/dash.js/wiki) player, which features all settings, api calls and statistics to try out all functionalities. Its main features are:

- Up to date anytime - all settings and api calls are retrieved from the latest version
- Customizable - only show settings and api calls you currently need
- Memorable - all customizations are saved locally for you convenience
- Knwoledgeable - the Documentation is integrated and just one click away
- Shareable - you can share your current settings by copying the link
- Developer Friendly - the debug build of dashjs or another version are just one click away
- Dark Mode - for the late hours
- Production Ready - use the same player we use in you Vue/React/Angular App

## Development

### Getting Started

To start developing this app, clone this repo to a new directory:

```bash
git clone https://github.com/AWTPJ2021/dash-reference-ui
cd dash-reference-ui

# Install the dependencies
npm install

# Generate the Metadata files for the app
# For more information read the next chapter "Usage and Development"
npm run gen-meta


# Start the app locally in development mode
npm start

# Run Tests or Lint the app
npm run test # or test.watch for continuous testing
npm run lint

# To build the app for production and update the documentation
npm run build

```

> Each Component is documented in its own folder see [`dashjs-player` for example](/src/components/dashjs-player/readme.md).

> Need more help with Stencil? Look [here](https://stenciljs.com/docs).

### Metadata Generation

In order to display all settings and api calls and their documentation we extract information from the dash-js repository. We go through the following steps:

1. [Retrieve the versions and source files](/metadata/get-source-files.ts)
2. For the API Functions information of the `index.d.ts` and `MediaPlayer.js` are used to parse Typescript and JSDoc Comments to Metadata information. ([generateAPIMetadata](/metadata/generateAPIMetaData.ts))
3. The Settings are generated from `index.d.ts` and `settings.js` source files of the dash.js Player. It extracts the Interfaces from the index file and annotates them with JSDoc explanations. ([generateSettingsMetadata](/metadata/generateSettingsMetaData.ts))
4. [The generated files are merged with the overwrite files](/metadata/merge-files.ts)

All those steps are bundled in the [generate-metadata](/generate-metadata.ts) script.

### Usage and Development

In general you can just run `npm run gen-meta` to generate the Metadata files for the latest version.

- To generate the files for all versions you have to set the environment variable `ONLY_FIRST=0`.
- For caching purposes the file `DELETEMETORELOAD` is created in this directory. Remove it in order to get the newest files from GitHub.
- If you are running into throtteling issues with GitHub create a Token and make it available as environment variable `GITHUB_TOKEN=<Your Token>`

#### Change or Overwrite Metadata files

The files Metadata files are generated to do the main work of extracting all possibilities from the DashJS Source and to auto generate a up to date version on publish. However auto generation leads to two main problems:

1. Quality issues (like Options shown as numbers instead of pretty text)
2. Unusable Components (e.g. some functions require complex objects which can't be supplied via the UI)

Thats why they can be overwritten. In order to do so simply create or update a file in the [`/metadata/overwrites`](/metadata/overwrites) folder with the schema `<version>/[settingsMetaData|mediaPlayerFunctionsMetaData].json` (e.g. `v3.2.0/settingsMetaData.json` to overwrite settings of the dashjs version 3.2.0).

The Schema of the JSON follows the same schema as those the [generated files](/metadata/build) or the [Typescript defintions](/src/types/types.ts).

> Note that the `id` is required to map the attributes to the according field.

### Using a component

There are three strategies we recommend for using web components built with Stencil.

The first step for all three of these strategies is to [publish to NPM](https://docs.npmjs.com/getting-started/publishing-npm-packages).

#### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/my-component@0.0.1/dist/mycomponent.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

#### Node Modules

- Run `npm install my-component --save`
- Put a script tag similar to this `<script src='node_modules/my-component/dist/mycomponent.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

#### In a stencil-starter app

- Run `npm install my-component --save`
- Add an import to the npm packages `import my-component;`
- Then you can use the element anywhere in your template, JSX, html etc

## Used Frameworks

We use [Stencil](https://stenciljs.com/docs) - a compiler for building fast web apps using Web Components, with the following main components:

- [Ionic](https://ionicframework.com/docs/api/)
- chart.js
