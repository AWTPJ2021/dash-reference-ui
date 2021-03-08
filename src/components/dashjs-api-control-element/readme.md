# dashjs-api-control-element



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                | Type                                                                                                                                                | Default     |
| ----------- | ------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `name`      | `name`       | The displayed name of the control element. | `string`                                                                                                                                            | `undefined` |
| `options`   | --           |                                            | `string[]`                                                                                                                                          | `undefined` |
| `param`     | `param`      |                                            | `any`                                                                                                                                               | `undefined` |
| `paramDesc` | `param-desc` |                                            | `any`                                                                                                                                               | `undefined` |
| `type`      | `type`       |                                            | `Type.HTML5MediaElement \| Type.MediaType \| Type.boolean \| Type.function \| Type.number \| Type.object \| Type.string \| Type.value \| Type.void` | `undefined` |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `valueChanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [dashjs-api-control](../dashjs-api-control)

### Depends on

- ion-input
- ion-toggle
- ion-select
- ion-select-option
- ion-button
- ion-grid
- ion-row
- ion-col
- ion-item

### Graph
```mermaid
graph TD;
  dashjs-api-control-element --> ion-input
  dashjs-api-control-element --> ion-toggle
  dashjs-api-control-element --> ion-select
  dashjs-api-control-element --> ion-select-option
  dashjs-api-control-element --> ion-button
  dashjs-api-control-element --> ion-grid
  dashjs-api-control-element --> ion-row
  dashjs-api-control-element --> ion-col
  dashjs-api-control-element --> ion-item
  ion-button --> ion-ripple-effect
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  dashjs-api-control --> dashjs-api-control-element
  style dashjs-api-control-element fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
