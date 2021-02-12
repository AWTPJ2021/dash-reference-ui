# dashjs-settings-control-element



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                                                      | Default     |
| -------------- | --------------- | ----------- | ------------------------------------------------------------------------- | ----------- |
| `defaultValue` | `default-value` |             | `any`                                                                     | `undefined` |
| `name`         | `name`          |             | `string`                                                                  | `undefined` |
| `options`      | --              |             | `string[]`                                                                | `undefined` |
| `type`         | `type`          |             | `Type.boolean \| Type.group \| Type.number \| Type.object \| Type.string` | `undefined` |


## Events

| Event          | Description | Type               |
| -------------- | ----------- | ------------------ |
| `valueChanged` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [dashjs-settings-control](../dashjs-settings-control)

### Depends on

- ion-item
- ion-label
- ion-select
- ion-select-option
- ion-input
- ion-toggle

### Graph
```mermaid
graph TD;
  dashjs-settings-control-element --> ion-item
  dashjs-settings-control-element --> ion-label
  dashjs-settings-control-element --> ion-select
  dashjs-settings-control-element --> ion-select-option
  dashjs-settings-control-element --> ion-input
  dashjs-settings-control-element --> ion-toggle
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  dashjs-settings-control --> dashjs-settings-control-element
  style dashjs-settings-control-element fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
