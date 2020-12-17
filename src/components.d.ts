/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DashjsApiControl {
        "json": string;
    }
    interface DashjsPlayer {
        "url": string;
        "streamUrl": string;
    }
    interface DashjsReferenceUi {
        "url": string;
    }
    interface DashjsSettingsControl {
        "resetSettings": () => Promise<void>;
    }
    interface DashjsSettingsControlModal {
        "allSettings": any[];
    }
    interface DashjsStatistics {
        "audio_data": any;
        "isServer": boolean;
        "video_data": any;
    }
}
declare global {
    interface HTMLDashjsApiControlElement extends Components.DashjsApiControl, HTMLStencilElement {
    }
    var HTMLDashjsApiControlElement: {
        prototype: HTMLDashjsApiControlElement;
        new (): HTMLDashjsApiControlElement;
    };
    interface HTMLDashjsPlayerElement extends Components.DashjsPlayer, HTMLStencilElement {
    }
    var HTMLDashjsPlayerElement: {
        prototype: HTMLDashjsPlayerElement;
        new (): HTMLDashjsPlayerElement;
    };
    interface HTMLDashjsReferenceUiElement extends Components.DashjsReferenceUi, HTMLStencilElement {
    }
    var HTMLDashjsReferenceUiElement: {
        prototype: HTMLDashjsReferenceUiElement;
        new (): HTMLDashjsReferenceUiElement;
    };
    interface HTMLDashjsSettingsControlElement extends Components.DashjsSettingsControl, HTMLStencilElement {
    }
    var HTMLDashjsSettingsControlElement: {
        prototype: HTMLDashjsSettingsControlElement;
        new (): HTMLDashjsSettingsControlElement;
    };
    interface HTMLDashjsSettingsControlModalElement extends Components.DashjsSettingsControlModal, HTMLStencilElement {
    }
    var HTMLDashjsSettingsControlModalElement: {
        prototype: HTMLDashjsSettingsControlModalElement;
        new (): HTMLDashjsSettingsControlModalElement;
    };
    interface HTMLDashjsStatisticsElement extends Components.DashjsStatistics, HTMLStencilElement {
    }
    var HTMLDashjsStatisticsElement: {
        prototype: HTMLDashjsStatisticsElement;
        new (): HTMLDashjsStatisticsElement;
    };
    interface HTMLElementTagNameMap {
        "dashjs-api-control": HTMLDashjsApiControlElement;
        "dashjs-player": HTMLDashjsPlayerElement;
        "dashjs-reference-ui": HTMLDashjsReferenceUiElement;
        "dashjs-settings-control": HTMLDashjsSettingsControlElement;
        "dashjs-settings-control-modal": HTMLDashjsSettingsControlModalElement;
        "dashjs-statistics": HTMLDashjsStatisticsElement;
    }
}
declare namespace LocalJSX {
    interface DashjsApiControl {
        "json"?: string;
    }
    interface DashjsPlayer {
        "url"?: string;
        "streamUrl"?: string;
    }
    interface DashjsReferenceUi {
        "url"?: string;
    }
    interface DashjsSettingsControl {
        "onSettingsUpdated"?: (event: CustomEvent<Object>) => void;
    }
    interface DashjsSettingsControlModal {
        "allSettings"?: any[];
    }
    interface DashjsStatistics {
        "audio_data"?: any;
        "isServer"?: boolean;
        "video_data"?: any;
    }
    interface IntrinsicElements {
        "dashjs-api-control": DashjsApiControl;
        "dashjs-player": DashjsPlayer;
        "dashjs-reference-ui": DashjsReferenceUi;
        "dashjs-settings-control": DashjsSettingsControl;
        "dashjs-settings-control-modal": DashjsSettingsControlModal;
        "dashjs-statistics": DashjsStatistics;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dashjs-api-control": LocalJSX.DashjsApiControl & JSXBase.HTMLAttributes<HTMLDashjsApiControlElement>;
            "dashjs-player": LocalJSX.DashjsPlayer & JSXBase.HTMLAttributes<HTMLDashjsPlayerElement>;
            "dashjs-reference-ui": LocalJSX.DashjsReferenceUi & JSXBase.HTMLAttributes<HTMLDashjsReferenceUiElement>;
            "dashjs-settings-control": LocalJSX.DashjsSettingsControl & JSXBase.HTMLAttributes<HTMLDashjsSettingsControlElement>;
            "dashjs-settings-control-modal": LocalJSX.DashjsSettingsControlModal & JSXBase.HTMLAttributes<HTMLDashjsSettingsControlModalElement>;
            "dashjs-statistics": LocalJSX.DashjsStatistics & JSXBase.HTMLAttributes<HTMLDashjsStatisticsElement>;
        }
    }
}
