# dashjs-tree



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute | Description | Type                    | Default     |
| ------------------ | --------- | ----------- | ----------------------- | ----------- |
| `elements`         | --        |             | `string[]`              | `undefined` |
| `path`             | --        |             | `string[]`              | `[]`        |
| `renderFunc`       | --        |             | `(key: string) => void` | `undefined` |
| `renderFuncSuffix` | --        |             | `() => void`            | `undefined` |
| `renderFuncTitle`  | --        |             | `(path: any) => void`   | `undefined` |
| `root`             | `root`    |             | `boolean`               | `false`     |
| `tree`             | --        |             | `Tree`                  | `undefined` |


## Dependencies

### Used by

 - [dashjs-settings-control](../dashjs-settings-control)
 - [dashjs-settings-control-modal](../dashjs-settings-control-modal)
 - [dashjs-tree](.)

### Depends on

- [dashjs-tree](.)
- ion-item-divider

### Graph
```mermaid
graph TD;
  dashjs-tree --> dashjs-tree
  dashjs-settings-control --> dashjs-tree
  dashjs-settings-control-modal --> dashjs-tree
  style dashjs-tree fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
