# dashjs-settings-control



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                         | Type                  | Default     |
| --------- | --------- | --------------------------------------------------- | --------------------- | ----------- |
| `version` | `version` | The version of which the settings should be loaded. | `string \| undefined` | `undefined` |


## Events

| Event             | Description                                | Type                                   |
| ----------------- | ------------------------------------------ | -------------------------------------- |
| `settingsUpdated` | Emitted everytime the Settings are updated | `CustomEvent<MediaPlayerSettingClass>` |


## Methods

### `resetSettings() => Promise<void>`

Resets the internal Settings

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [dashjs-reference-ui](../dashjs-reference-ui)

### Depends on

- ion-row
- ion-col
- ion-button
- ion-icon
- [dashjs-settings-control-element](../dashjs-settings-control-element)
- [dashjs-help-button](../dashjs-help-button)
- [ion-accordion](../ion-accordion)
- ion-toggle
- ion-grid
- [dashjs-tree](../dashjs-tree)
- [dashjs-input-search](../dashjs-input-search)

### Graph
```mermaid
graph TD;
  dashjs-settings-control --> ion-row
  dashjs-settings-control --> ion-col
  dashjs-settings-control --> ion-button
  dashjs-settings-control --> ion-icon
  dashjs-settings-control --> dashjs-settings-control-element
  dashjs-settings-control --> dashjs-help-button
  dashjs-settings-control --> ion-accordion
  dashjs-settings-control --> ion-toggle
  dashjs-settings-control --> ion-grid
  dashjs-settings-control --> dashjs-tree
  dashjs-settings-control --> dashjs-input-search
  ion-button --> ion-ripple-effect
  dashjs-settings-control-element --> ion-select
  dashjs-settings-control-element --> ion-select-option
  dashjs-settings-control-element --> ion-input
  dashjs-settings-control-element --> ion-toggle
  dashjs-settings-control-element --> ion-grid
  dashjs-settings-control-element --> ion-row
  dashjs-settings-control-element --> ion-col
  dashjs-help-button --> ion-button
  dashjs-help-button --> ion-icon
  ion-accordion --> ion-card
  ion-accordion --> ion-card-header
  ion-accordion --> ion-button
  ion-accordion --> ion-icon
  ion-accordion --> ion-card-content
  ion-card --> ion-ripple-effect
  dashjs-tree --> dashjs-tree
  dashjs-tree --> ion-item-divider
  dashjs-input-search --> ion-input
  dashjs-reference-ui --> dashjs-settings-control
  style dashjs-settings-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
