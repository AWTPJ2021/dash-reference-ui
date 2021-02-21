/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DashFunction, Setting, Tree, Type } from "./types/types";
import { RouterHistory } from "@stencil/router";
export namespace Components {
    interface DashjsApiControl {
        "version": string;
    }
    interface DashjsApiControlElement {
        "name": string;
        "options": string[];
        "param": any;
        "paramDesc": any;
        "type": Type;
    }
    interface DashjsApiControlModal {
        "functionList": DashFunction[];
        "selectedFunctions": Map<string, any>;
    }
    interface DashjsApiLinkSelector {
        "sourceList": any[];
    }
    interface DashjsGenericModal {
        "content": any;
        "textTitle": string;
    }
    interface DashjsHelpButton {
        "helperText": string;
        "titleText": string;
    }
    interface DashjsPlayer {
        "type": string;
        "version": string;
    }
    interface DashjsPopoverSelect {
        "isAPI": boolean;
        "options": string[];
    }
    interface DashjsReferenceUi {
        "selectedType": string;
        "selectedVersion": string;
        "type": string[];
        "url": string;
        "versions": string[];
    }
    interface DashjsSettingsControl {
        "history": RouterHistory;
        "resetSettings": () => Promise<void>;
        "version": string;
    }
    interface DashjsSettingsControlElement {
        "defaultValue": any;
        "name": string;
        "options": string[];
        "type": Type;
    }
    interface DashjsSettingsControlModal {
        "selectedSettings": Map<string, any>;
        "settingsList": Setting[];
        "settingsTree": Tree;
    }
    interface DashjsStatistics {
        "videoInstance": any;
        "video_data": any;
    }
    interface DashjsTree {
        "elements": string[];
        "path": string[];
        "renderFunc": (key) => void;
        "renderFuncSuffix": () => void;
        "renderFuncTitle": (path) => void;
        "root": boolean;
        "tree": Tree;
    }
    interface IonAccordion {
        "titleText": string;
    }
}
declare global {
    interface HTMLDashjsApiControlElement extends Components.DashjsApiControl, HTMLStencilElement {
    }
    var HTMLDashjsApiControlElement: {
        prototype: HTMLDashjsApiControlElement;
        new (): HTMLDashjsApiControlElement;
    };
    interface HTMLDashjsApiControlElementElement extends Components.DashjsApiControlElement, HTMLStencilElement {
    }
    var HTMLDashjsApiControlElementElement: {
        prototype: HTMLDashjsApiControlElementElement;
        new (): HTMLDashjsApiControlElementElement;
    };
    interface HTMLDashjsApiControlModalElement extends Components.DashjsApiControlModal, HTMLStencilElement {
    }
    var HTMLDashjsApiControlModalElement: {
        prototype: HTMLDashjsApiControlModalElement;
        new (): HTMLDashjsApiControlModalElement;
    };
    interface HTMLDashjsApiLinkSelectorElement extends Components.DashjsApiLinkSelector, HTMLStencilElement {
    }
    var HTMLDashjsApiLinkSelectorElement: {
        prototype: HTMLDashjsApiLinkSelectorElement;
        new (): HTMLDashjsApiLinkSelectorElement;
    };
    interface HTMLDashjsGenericModalElement extends Components.DashjsGenericModal, HTMLStencilElement {
    }
    var HTMLDashjsGenericModalElement: {
        prototype: HTMLDashjsGenericModalElement;
        new (): HTMLDashjsGenericModalElement;
    };
    interface HTMLDashjsHelpButtonElement extends Components.DashjsHelpButton, HTMLStencilElement {
    }
    var HTMLDashjsHelpButtonElement: {
        prototype: HTMLDashjsHelpButtonElement;
        new (): HTMLDashjsHelpButtonElement;
    };
    interface HTMLDashjsPlayerElement extends Components.DashjsPlayer, HTMLStencilElement {
    }
    var HTMLDashjsPlayerElement: {
        prototype: HTMLDashjsPlayerElement;
        new (): HTMLDashjsPlayerElement;
    };
    interface HTMLDashjsPopoverSelectElement extends Components.DashjsPopoverSelect, HTMLStencilElement {
    }
    var HTMLDashjsPopoverSelectElement: {
        prototype: HTMLDashjsPopoverSelectElement;
        new (): HTMLDashjsPopoverSelectElement;
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
    interface HTMLDashjsSettingsControlElementElement extends Components.DashjsSettingsControlElement, HTMLStencilElement {
    }
    var HTMLDashjsSettingsControlElementElement: {
        prototype: HTMLDashjsSettingsControlElementElement;
        new (): HTMLDashjsSettingsControlElementElement;
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
    interface HTMLDashjsTreeElement extends Components.DashjsTree, HTMLStencilElement {
    }
    var HTMLDashjsTreeElement: {
        prototype: HTMLDashjsTreeElement;
        new (): HTMLDashjsTreeElement;
    };
    interface HTMLIonAccordionElement extends Components.IonAccordion, HTMLStencilElement {
    }
    var HTMLIonAccordionElement: {
        prototype: HTMLIonAccordionElement;
        new (): HTMLIonAccordionElement;
    };
    interface HTMLElementTagNameMap {
        "dashjs-api-control": HTMLDashjsApiControlElement;
        "dashjs-api-control-element": HTMLDashjsApiControlElementElement;
        "dashjs-api-control-modal": HTMLDashjsApiControlModalElement;
        "dashjs-api-link-selector": HTMLDashjsApiLinkSelectorElement;
        "dashjs-generic-modal": HTMLDashjsGenericModalElement;
        "dashjs-help-button": HTMLDashjsHelpButtonElement;
        "dashjs-player": HTMLDashjsPlayerElement;
        "dashjs-popover-select": HTMLDashjsPopoverSelectElement;
        "dashjs-reference-ui": HTMLDashjsReferenceUiElement;
        "dashjs-settings-control": HTMLDashjsSettingsControlElement;
        "dashjs-settings-control-element": HTMLDashjsSettingsControlElementElement;
        "dashjs-settings-control-modal": HTMLDashjsSettingsControlModalElement;
        "dashjs-statistics": HTMLDashjsStatisticsElement;
        "dashjs-tree": HTMLDashjsTreeElement;
        "ion-accordion": HTMLIonAccordionElement;
    }
}
declare namespace LocalJSX {
    interface DashjsApiControl {
        "onPlayerEvent"?: (event: CustomEvent<String>) => void;
        "version"?: string;
    }
    interface DashjsApiControlElement {
        "name"?: string;
        "onValueChanged"?: (event: CustomEvent<any>) => void;
        "options"?: string[];
        "param"?: any;
        "paramDesc"?: any;
        "type"?: Type;
    }
    interface DashjsApiControlModal {
        "functionList"?: DashFunction[];
        "selectedFunctions"?: Map<string, any>;
    }
    interface DashjsApiLinkSelector {
        "onSetStream"?: (event: CustomEvent<String>) => void;
        "sourceList"?: any[];
    }
    interface DashjsGenericModal {
        "content"?: any;
        "textTitle"?: string;
    }
    interface DashjsHelpButton {
        "helperText"?: string;
        "titleText"?: string;
    }
    interface DashjsPlayer {
        "onPlayerResponse"?: (event: CustomEvent<any>) => void;
        "onStreamMetricsEvent"?: (event: CustomEvent<Object>) => void;
        "type"?: string;
        "version"?: string;
    }
    interface DashjsPopoverSelect {
        "isAPI"?: boolean;
        "options"?: string[];
    }
    interface DashjsReferenceUi {
        "selectedType"?: string;
        "selectedVersion"?: string;
        "type"?: string[];
        "url"?: string;
        "versions"?: string[];
    }
    interface DashjsSettingsControl {
        "history"?: RouterHistory;
        "onSettingsUpdated"?: (event: CustomEvent<Object>) => void;
        "version"?: string;
    }
    interface DashjsSettingsControlElement {
        "defaultValue"?: any;
        "name"?: string;
        "onValueChanged"?: (event: CustomEvent<any>) => void;
        "options"?: string[];
        "type"?: Type;
    }
    interface DashjsSettingsControlModal {
        "selectedSettings"?: Map<string, any>;
        "settingsList"?: Setting[];
        "settingsTree"?: Tree;
    }
    interface DashjsStatistics {
        "videoInstance"?: any;
        "video_data"?: any;
    }
    interface DashjsTree {
        "elements"?: string[];
        "path"?: string[];
        "renderFunc"?: (key) => void;
        "renderFuncSuffix"?: () => void;
        "renderFuncTitle"?: (path) => void;
        "root"?: boolean;
        "tree"?: Tree;
    }
    interface IonAccordion {
        "titleText"?: string;
    }
    interface IntrinsicElements {
        "dashjs-api-control": DashjsApiControl;
        "dashjs-api-control-element": DashjsApiControlElement;
        "dashjs-api-control-modal": DashjsApiControlModal;
        "dashjs-api-link-selector": DashjsApiLinkSelector;
        "dashjs-generic-modal": DashjsGenericModal;
        "dashjs-help-button": DashjsHelpButton;
        "dashjs-player": DashjsPlayer;
        "dashjs-popover-select": DashjsPopoverSelect;
        "dashjs-reference-ui": DashjsReferenceUi;
        "dashjs-settings-control": DashjsSettingsControl;
        "dashjs-settings-control-element": DashjsSettingsControlElement;
        "dashjs-settings-control-modal": DashjsSettingsControlModal;
        "dashjs-statistics": DashjsStatistics;
        "dashjs-tree": DashjsTree;
        "ion-accordion": IonAccordion;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dashjs-api-control": LocalJSX.DashjsApiControl & JSXBase.HTMLAttributes<HTMLDashjsApiControlElement>;
            "dashjs-api-control-element": LocalJSX.DashjsApiControlElement & JSXBase.HTMLAttributes<HTMLDashjsApiControlElementElement>;
            "dashjs-api-control-modal": LocalJSX.DashjsApiControlModal & JSXBase.HTMLAttributes<HTMLDashjsApiControlModalElement>;
            "dashjs-api-link-selector": LocalJSX.DashjsApiLinkSelector & JSXBase.HTMLAttributes<HTMLDashjsApiLinkSelectorElement>;
            "dashjs-generic-modal": LocalJSX.DashjsGenericModal & JSXBase.HTMLAttributes<HTMLDashjsGenericModalElement>;
            "dashjs-help-button": LocalJSX.DashjsHelpButton & JSXBase.HTMLAttributes<HTMLDashjsHelpButtonElement>;
            "dashjs-player": LocalJSX.DashjsPlayer & JSXBase.HTMLAttributes<HTMLDashjsPlayerElement>;
            "dashjs-popover-select": LocalJSX.DashjsPopoverSelect & JSXBase.HTMLAttributes<HTMLDashjsPopoverSelectElement>;
            "dashjs-reference-ui": LocalJSX.DashjsReferenceUi & JSXBase.HTMLAttributes<HTMLDashjsReferenceUiElement>;
            "dashjs-settings-control": LocalJSX.DashjsSettingsControl & JSXBase.HTMLAttributes<HTMLDashjsSettingsControlElement>;
            "dashjs-settings-control-element": LocalJSX.DashjsSettingsControlElement & JSXBase.HTMLAttributes<HTMLDashjsSettingsControlElementElement>;
            "dashjs-settings-control-modal": LocalJSX.DashjsSettingsControlModal & JSXBase.HTMLAttributes<HTMLDashjsSettingsControlModalElement>;
            "dashjs-statistics": LocalJSX.DashjsStatistics & JSXBase.HTMLAttributes<HTMLDashjsStatisticsElement>;
            "dashjs-tree": LocalJSX.DashjsTree & JSXBase.HTMLAttributes<HTMLDashjsTreeElement>;
            "ion-accordion": LocalJSX.IonAccordion & JSXBase.HTMLAttributes<HTMLIonAccordionElement>;
        }
    }
}
