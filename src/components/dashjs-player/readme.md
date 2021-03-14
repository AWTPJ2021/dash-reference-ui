# dashjs-player



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description                                                 | Type                      | Default                 |
| ---------- | --------- | ----------------------------------------------------------- | ------------------------- | ----------------------- |
| `settings` | --        | The Settings of dashjs that should be used. e.g. v3.2.0     | `MediaPlayerSettingClass` | `{}`                    |
| `type`     | `type`    | The Type of dashjs that should be loaded. e.g. debug or min | `string`                  | `DASHJS_PLAYER_TYPE`    |
| `version`  | `version` | The Version of dashjs that should be loaded. e.g. v3.2.0    | `string`                  | `DASHJS_PLAYER_VERSION` |


## Events

| Event            | Description                                            | Type                   |
| ---------------- | ------------------------------------------------------ | ---------------------- |
| `metricsEvent`   | Stream metrics: dashMetrcis & dashAdapter calculations | `CustomEvent<Metrics>` |
| `playerResponse` | Player response: player api calls repsonse             | `CustomEvent<any>`     |


## Methods

### `showPiP() => Promise<void>`

Request Video to be played in Picture in Picture Mode

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [dashjs-reference-ui](../dashjs-reference-ui)

### Graph
```mermaid
graph TD;
  dashjs-reference-ui --> dashjs-player
  style dashjs-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
