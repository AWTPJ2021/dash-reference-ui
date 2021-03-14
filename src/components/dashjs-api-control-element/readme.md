# dashjs-api-control-element



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                             | Type     | Default     |
| -------- | --------- | ------------------------------------------------------- | -------- | ----------- |
| `name`   | `name`    | The displayed name of the control element.              | `string` | `undefined` |
| `param`  | `param`   | Contains the required parameters of the control element | `any`    | `undefined` |


## Events

| Event          | Description                    | Type               |
| -------------- | ------------------------------ | ------------------ |
| `callFunction` | Triggers the API call function | `CustomEvent<any>` |


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
