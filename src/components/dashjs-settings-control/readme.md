# dashjs-settings-control



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type            | Default     |
| --------- | --------- | ----------- | --------------- | ----------- |
| `history` | --        |             | `RouterHistory` | `undefined` |


## Events

| Event             | Description | Type                  |
| ----------------- | ----------- | --------------------- |
| `settingsUpdated` |             | `CustomEvent<Object>` |


## Methods

### `resetSettings() => Promise<void>`

Test

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [dashjs-reference-ui](../dashjs-reference-ui)

### Depends on

- ion-card
- ion-card-header
- ion-card-title
- ion-button
- ion-icon
- ion-card-content
- ion-grid
- ion-row
- ion-chip
- ion-label
- ion-input
- ion-list
- [dashjs-settings-control-element](../dashjs-settings-control-element)

### Graph
```mermaid
graph TD;
  dashjs-settings-control --> ion-card
  dashjs-settings-control --> ion-card-header
  dashjs-settings-control --> ion-card-title
  dashjs-settings-control --> ion-button
  dashjs-settings-control --> ion-icon
  dashjs-settings-control --> ion-card-content
  dashjs-settings-control --> ion-grid
  dashjs-settings-control --> ion-row
  dashjs-settings-control --> ion-chip
  dashjs-settings-control --> ion-label
  dashjs-settings-control --> ion-input
  dashjs-settings-control --> ion-list
  dashjs-settings-control --> dashjs-settings-control-element
  ion-card --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  ion-chip --> ion-ripple-effect
  dashjs-settings-control-element --> ion-item
  dashjs-settings-control-element --> ion-label
  dashjs-settings-control-element --> ion-select
  dashjs-settings-control-element --> ion-select-option
  dashjs-settings-control-element --> ion-input
  dashjs-settings-control-element --> ion-toggle
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  dashjs-reference-ui --> dashjs-settings-control
  style dashjs-settings-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
