# dashjs-settings-control-modal



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute | Description | Type                            | Default     |
| ------------------ | --------- | ----------- | ------------------------------- | ----------- |
| `selectedSettings` | --        |             | `Map<string, SettingsMapValue>` | `new Map()` |
| `settingsList`     | --        |             | `Setting[]`                     | `[]`        |
| `settingsTree`     | --        |             | `Tree \| undefined`             | `undefined` |


## Dependencies

### Depends on

- ion-searchbar
- ion-content
- ion-grid
- ion-row
- [dashjs-tree](../dashjs-tree)
- ion-col
- ion-checkbox
- ion-item-divider
- ion-toolbar
- ion-button

### Graph
```mermaid
graph TD;
  dashjs-settings-control-modal --> ion-searchbar
  dashjs-settings-control-modal --> ion-content
  dashjs-settings-control-modal --> ion-grid
  dashjs-settings-control-modal --> ion-row
  dashjs-settings-control-modal --> dashjs-tree
  dashjs-settings-control-modal --> ion-col
  dashjs-settings-control-modal --> ion-checkbox
  dashjs-settings-control-modal --> ion-item-divider
  dashjs-settings-control-modal --> ion-toolbar
  dashjs-settings-control-modal --> ion-button
  ion-searchbar --> ion-icon
  dashjs-tree --> dashjs-tree
  dashjs-tree --> ion-item-divider
  ion-button --> ion-ripple-effect
  style dashjs-settings-control-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
