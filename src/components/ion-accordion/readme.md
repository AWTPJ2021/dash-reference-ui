# ion-accordion



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                    | Type     | Default |
| ----------- | ------------ | ---------------------------------------------- | -------- | ------- |
| `titleText` | `title-text` | The Title of the accordion. Can be left blank. | `string` | `''`    |


## Dependencies

### Used by

 - [dashjs-api-control](../dashjs-api-control)
 - [dashjs-settings-control](../dashjs-settings-control)
 - [dashjs-statistics](../dashjs-statistics)

### Depends on

- ion-card
- ion-card-header
- ion-button
- ion-icon
- ion-card-content

### Graph
```mermaid
graph TD;
  ion-accordion --> ion-card
  ion-accordion --> ion-card-header
  ion-accordion --> ion-button
  ion-accordion --> ion-icon
  ion-accordion --> ion-card-content
  ion-card --> ion-ripple-effect
  ion-button --> ion-ripple-effect
  dashjs-api-control --> ion-accordion
  dashjs-settings-control --> ion-accordion
  dashjs-statistics --> ion-accordion
  style ion-accordion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
