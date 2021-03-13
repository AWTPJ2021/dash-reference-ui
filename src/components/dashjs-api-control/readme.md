# dashjs-api-control



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                       | Type     | Default                 |
| --------- | --------- | ------------------------------------------------- | -------- | ----------------------- |
| `version` | `version` | The version of which the dashjs should be loaded. | `string` | `DASHJS_PLAYER_VERSION` |


## Events

| Event         | Description                  | Type               |
| ------------- | ---------------------------- | ------------------ |
| `playerEvent` | Emits an event to the player | `CustomEvent<any>` |


## Dependencies

### Used by

 - [dashjs-reference-ui](../dashjs-reference-ui)

### Depends on

- ion-title
- ion-buttons
- ion-button
- [ion-accordion](../ion-accordion)
- ion-toggle
- ion-grid
- ion-row
- ion-col
- ion-icon
- ion-item
- ion-input
- ion-list
- [dashjs-api-control-element](../dashjs-api-control-element)
- [dashjs-help-button](../dashjs-help-button)
- [dashjs-input-search](../dashjs-input-search)

### Graph
```mermaid
graph TD;
  dashjs-api-control --> ion-title
  dashjs-api-control --> ion-buttons
  dashjs-api-control --> ion-button
  dashjs-api-control --> ion-accordion
  dashjs-api-control --> ion-toggle
  dashjs-api-control --> ion-grid
  dashjs-api-control --> ion-row
  dashjs-api-control --> ion-col
  dashjs-api-control --> ion-icon
  dashjs-api-control --> ion-item
  dashjs-api-control --> ion-input
  dashjs-api-control --> ion-list
  dashjs-api-control --> dashjs-api-control-element
  dashjs-api-control --> dashjs-help-button
  dashjs-api-control --> dashjs-input-search
  ion-button --> ion-ripple-effect
  ion-accordion --> ion-card
  ion-accordion --> ion-card-header
  ion-accordion --> ion-button
  ion-accordion --> ion-icon
  ion-accordion --> ion-card-content
  ion-card --> ion-ripple-effect
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  dashjs-api-control-element --> ion-input
  dashjs-api-control-element --> ion-toggle
  dashjs-api-control-element --> ion-select
  dashjs-api-control-element --> ion-select-option
  dashjs-api-control-element --> ion-button
  dashjs-api-control-element --> ion-grid
  dashjs-api-control-element --> ion-row
  dashjs-api-control-element --> ion-col
  dashjs-api-control-element --> ion-item
  dashjs-help-button --> ion-button
  dashjs-help-button --> ion-icon
  dashjs-input-search --> ion-input
  dashjs-reference-ui --> dashjs-api-control
  style dashjs-api-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
