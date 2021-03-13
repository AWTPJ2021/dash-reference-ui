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
npm run gen-meta

# Start the app locally in development mode
npm start

# Run Tests or Lint the app
npm run test # or test.watch for continuous testing
npm run lint

# To build the app for production and update the documentation
npm run build

```
> Need more help with Stencil, look [here](https://stenciljs.com/docs).

### Metadate Generation


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
