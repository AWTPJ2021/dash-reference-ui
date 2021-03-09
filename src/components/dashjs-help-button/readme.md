# dashjs-help-button



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                                         | Type                  | Default     |
| ------------ | ------------- | --------------------------------------------------- | --------------------- | ----------- |
| `helperText` | `helper-text` | Informational text displayed in the Modal for help. | `string`              | `''`        |
| `titleText`  | `title-text`  | title displayed on top of the Modal.                | `string \| undefined` | `undefined` |


## Dependencies

### Used by

 - [dashjs-api-control](../dashjs-api-control)
 - [dashjs-settings-control](../dashjs-settings-control)

### Depends on

- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  dashjs-help-button --> ion-button
  dashjs-help-button --> ion-icon
  ion-button --> ion-ripple-effect
  dashjs-api-control --> dashjs-help-button
  dashjs-settings-control --> dashjs-help-button
  style dashjs-help-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
