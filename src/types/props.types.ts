import {
    Instance,
    Options,
    Placement,
    PositioningStrategy,
    VirtualElement,
} from '@popperjs/core';
type PopperOffset = [number | null | undefined, number | null | undefined];

export type PopupProps = {
    trigger?: 'click' | 'hover' | 'focus';
    reference?: Element | VirtualElement | string | null;
    isDynamicReference?: boolean;
    options?: Options;
    modelValue?: boolean;
    placement?: Placement;
    offset?: PopperOffset;
    strategy?: PositioningStrategy;
    onFirstUpdate?: Options['onFirstUpdate'];
    hideOnClickOutside?: boolean;
    refClass?: string;
    popupClass?: string;
    arrow?: boolean;
    arrowClass?: string;
    forceHide?: boolean;
    forceShow?: boolean;
    disabled?: boolean;
    localEventListeners?: boolean;
    isDropdown?: boolean;
    isDropdownChild?: boolean;
    transitionName?: string;
    enterFromClass?: string;
    enterToClass?: string;
    enterActiveClass?: string;
    leaveFromClass?: string;
    leaveToClass?: string;
    leaveActiveClass?: string;
};

export type PopupEmit = {
    (e: 'update:model-value', isPopperOpen: boolean): void;
    (
        e: 'ready',
        popper: Instance,
        popperEl: Element | null,
        refEl: Element | VirtualElement | null
    ): void;
    (e: 'show'): void;
    (e: 'hide'): void;
    (e: 'destroy'): void;
    (
        e: 'create-error',
        popperEl: Element | null,
        refEl: Element | VirtualElement | null
    ): void;
};
