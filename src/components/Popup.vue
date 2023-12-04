<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import {
    createPopper,
    Options,
    Instance,
    VirtualElement,
    Modifier,
} from '@popperjs/core';
import {
    filterArrayUniqueByKey,
    deepCompare,
    hasEventOccuredInChildTree,
} from '../utils/useUtils';
import { addClickListener, removeClickListener } from '../utils/eventBusClick';
import {
    addMouseoverListener,
    removeMouseoverListener,
} from '../utils/eventBusMouseover';
import {
    addMouseoutListener,
    removeMouseoutListener,
} from '../utils/eventBusMouseout';
import {
    addFocusinListener,
    removeFocusinListener,
} from '../utils/eventBusFocusin';
import {
    addFocusoutListener,
    removeFocusoutListener,
} from '../utils/eventBusFocusout';

import { PopupProps, PopupEmit } from '../types/props.types';

type Props = PopupProps & {};
type Emit = PopupEmit & {};

const props = withDefaults(defineProps<Props>(), {
    trigger: () => 'click',
    reference: null,
    isDynamicReference: () => false,
    placement: () => 'bottom-start',
    offset: () => [0, 4],
    strategy: () => 'absolute',
    hideOnClickOutside: () => true,
    refClass: () => '',
    popupClass: () => '',
    arrow: () => false,
    arrowClass: () => '',
    forceHide: () => false,
    forceShow: () => false,
    disabled: () => false,
    localEventListeners: () => false,
    isDropdown: () => false,
    isDropdownChild: () => false,
    sameWidthAsReference: () => false,
});

const emit = defineEmits<Emit>();

const componentId = ref(`component-${v4()}`);
const refId = ref(`ref-${v4()}`);
const popperId = ref(`popper-${v4()}`);

const eventId = ref(`click-${v4()}`);
const bodyClickEventId = ref(`body-click-${v4()}`);

const isDynamic = computed(() => Boolean(props.reference));
const isPopperOpen = ref(isDynamic.value ? props.modelValue : false);

const root_el = ref<Element | null>(null);
const ref_el = ref<Element | VirtualElement | null>(null);
const popper_el = ref<Element | null>(null);
const popper = ref<Instance | null>(null);

const setIsPopperOpen = async (val: boolean) => {
    if (!popper.value || props.disabled || val === isPopperOpen.value) return;

    if (popper_el.value)
        val
            ? popper_el.value.setAttribute('data-show', '')
            : popper_el.value.removeAttribute('data-show');

    isPopperOpen.value = val;

    val ? emit('show') : emit('hide');
    if (isDynamic.value) emit('update:model-value', val);

    popper.value.update();

    if (props.hideOnClickOutside && ['click'].includes(props.trigger)) {
        setTimeout(() => {
            val ? addBodyClickEventListener() : removeBodyClickEventListener();
        }, 50);
    }
};

const initiatePopperIfNotSet = () => {
    if (popper.value) {
        popper.value?.destroy();
    }
    ref_el.value = resolveReferenceElement();
    popper_el.value = resolvePopperElement();

    if (!ref_el.value || !popper_el.value) {
        emit('create-error', popper_el.value, ref_el.value);
        return;
    }

    popper.value = initialize();
    emit('ready', popper.value, popper_el.value, ref_el.value);
};
const initiatePopperIfNotSetAndToggle = (val: boolean) => {
    if (!popper.value || (isDynamic.value && props.isDynamicReference)) {
        initiatePopperIfNotSet();
    }
    setIsPopperOpen(val);
};

const defaultOptions = computed<Options>(() => {
    const options: Options = {
        placement: 'bottom-start',
        strategy: 'absolute',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 4],
                },
            },
        ],
        onFirstUpdate: undefined,
    };

    if (props.sameWidthAsReference) {
        const sameWidthModifier: Partial<Modifier<any, any>> = {
            name: 'sameWidth',
            enabled: true,
            fn: ({ state }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            phase: 'beforeWrite',
            requires: ['computeStyles'],
        };
        options.modifiers.push(sameWidthModifier);
    }

    return options;
});

const optionsFromProps = computed<Options>(() => {
    return {
        placement: props.placement,
        strategy: props.strategy,
        onFirstUpdate: props.onFirstUpdate,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: props.offset,
                },
            },
        ],
    };
});

const popperOptions = computed(() => {
    const modifiersFromOptionProp = props.options?.modifiers?.length
        ? props.options?.modifiers
        : [];

    let modifiers = [
        ...modifiersFromOptionProp,
        ...(optionsFromProps.value?.modifiers || []),
        ...(defaultOptions.value?.modifiers || []),
    ];
    modifiers = filterArrayUniqueByKey(modifiers, 'name');

    return {
        ...deepCompare(
            props.options ? props.options : {},
            deepCompare(optionsFromProps.value, defaultOptions.value)
        ),
        modifiers,
    };
});

const resolveReferenceElement = () => {
    if (isDynamic.value) {
        if (typeof props.reference === 'string')
            return document.querySelector(props.reference);

        return props.reference;
    }

    return document.querySelector(`#${refId.value}`);
};

const resolvePopperElement = () => {
    return document.querySelector(`#${popperId.value}`);
};

const initialize = () => {
    return createPopper(
        ref_el.value as Element | VirtualElement,
        popper_el.value as HTMLElement,
        popperOptions.value
    );
};

onMounted(async () => {
    ref_el.value = resolveReferenceElement();
    popper_el.value = resolvePopperElement();

    if (!ref_el.value || !popper_el.value) {
        emit('create-error', popper_el.value, ref_el.value);
        return;
    }

    popper.value = initialize();
    if (!popper.value) return;

    emit('ready', popper.value, popper_el.value, ref_el.value);

    if (!isDynamic.value) addEventListeners();
    setTimeout(() => {
        if (popper.value) popper.value.forceUpdate();
    }, 200);
});

onBeforeUnmount(() => {
    if (popper.value && !isDynamic.value) {
        removeEventListeners();
        removeBodyClickEventListener();
    }
    destroy();
    popper.value = null;
    emit('destroy');
});

const destroy = () => {
    if (popper.value) popper.value.destroy();
};

const hasEventOccuredOnComponent = (event: MouseEvent | FocusEvent) => {
    return hasEventOccuredInChildTree(event, componentId.value);
};

const hasEventOccuredOnRef = (event: MouseEvent | FocusEvent) => {
    return hasEventOccuredInChildTree(event, refId.value);
};

const hasEventOccuredOnPopper = (event: MouseEvent | FocusEvent) => {
    return hasEventOccuredInChildTree(event, popperId.value);
};

const addClickEventListener = (event: MouseEvent) => {
    const isRef = hasEventOccuredOnRef(event);
    if (!isRef) return;

    initiatePopperIfNotSetAndToggle(!isPopperOpen.value);
};

const handleBodyClick = (event: MouseEvent) => {
    if (!isPopperOpen.value || !props.hideOnClickOutside || !event.target)
        return;

    const isPopper = hasEventOccuredOnPopper(event);
    if (isPopper) return;

    initiatePopperIfNotSetAndToggle(false);
};

const hoverEventListener = (event: MouseEvent, popperOpen: boolean) => {
    const isRoot = hasEventOccuredOnComponent(event);
    if (!isRoot) return;

    initiatePopperIfNotSetAndToggle(popperOpen);
};

const focusEventListener = (event: FocusEvent, popperOpen: boolean) => {
    const isRef = hasEventOccuredOnRef(event);
    if (!isRef) return;

    initiatePopperIfNotSetAndToggle(popperOpen);
};

const addEventListeners = () => {
    if (!ref_el.value || isDynamic.value) return;

    if (props.trigger === 'click') {
        if (props.localEventListeners) {
            (ref_el.value as Element).addEventListener(
                'click',
                () => initiatePopperIfNotSetAndToggle(!isPopperOpen.value),
                false
            );
        } else {
            addClickListener({
                id: eventId.value,
                componentId: componentId.value,
                callback: (event: MouseEvent) => addClickEventListener(event),
            });
        }
    } else if (props.trigger === 'hover') {
        if (props.localEventListeners) {
            (root_el.value as Element).addEventListener(
                'mouseover',
                () => initiatePopperIfNotSetAndToggle(true),
                false
            );
            (root_el.value as Element).addEventListener(
                'mouseout',
                () => initiatePopperIfNotSetAndToggle(false),
                false
            );
        } else {
            addMouseoverListener({
                id: eventId.value,
                componentId: componentId.value,
                callback: (event: MouseEvent) =>
                    hoverEventListener(event, true),
            });
            addMouseoutListener({
                id: eventId.value,
                componentId: componentId.value,
                callback: (event: MouseEvent) =>
                    hoverEventListener(event, false),
            });
        }
    } else if (props.trigger === 'focus') {
        if (props.localEventListeners) {
            (ref_el.value as Element).addEventListener(
                'focusin',
                () => initiatePopperIfNotSetAndToggle(true),
                false
            );
            (ref_el.value as Element).addEventListener(
                'focusout',
                () => initiatePopperIfNotSetAndToggle(false),
                false
            );
        } else {
            addFocusinListener({
                id: eventId.value,
                componentId: componentId.value,
                callback: (event: FocusEvent) =>
                    focusEventListener(event, true),
            });
            addFocusoutListener({
                id: eventId.value,
                componentId: componentId.value,
                callback: (event: FocusEvent) =>
                    focusEventListener(event, false),
            });
        }
    }
};

const removeEventListeners = () => {
    if (!ref_el.value || isDynamic.value) return;

    if (props.trigger === 'click') {
        if (props.localEventListeners) {
            (ref_el.value as Element).removeEventListener(
                'mouseover',
                () => initiatePopperIfNotSetAndToggle(!isPopperOpen.value),
                false
            );
        } else {
            removeClickListener({
                id: eventId.value,
                componentId: componentId.value,
            });
        }
    } else if (props.trigger === 'hover') {
        if (props.localEventListeners) {
            (ref_el.value as Element).removeEventListener(
                'mouseover',
                () => initiatePopperIfNotSetAndToggle(true),
                false
            );
            (ref_el.value as Element).removeEventListener(
                'mouseout',
                () => initiatePopperIfNotSetAndToggle(false),
                false
            );
        } else {
            removeMouseoverListener({
                id: eventId.value,
                componentId: componentId.value,
            });
            removeMouseoutListener({
                id: eventId.value,
                componentId: componentId.value,
            });
        }
    } else if (props.trigger === 'focus') {
        if (props.localEventListeners) {
            (ref_el.value as Element).removeEventListener(
                'focusin',
                () => initiatePopperIfNotSetAndToggle(true),
                false
            );
            (ref_el.value as Element).removeEventListener(
                'focusout',
                () => initiatePopperIfNotSetAndToggle(false),
                false
            );
        } else {
            removeFocusinListener({
                id: eventId.value,
                componentId: componentId.value,
            });
            removeFocusoutListener({
                id: eventId.value,
                componentId: componentId.value,
            });
        }
    }
};

const addBodyClickEventListener = () => {
    if (props.localEventListeners) {
        document.body.addEventListener('click', handleBodyClick, false);
    } else {
        addClickListener({
            id: bodyClickEventId.value,
            componentId: componentId.value,
            callback: (event: MouseEvent) => handleBodyClick(event),
        });
    }
};
const removeBodyClickEventListener = () => {
    if (props.localEventListeners) {
        document.body.removeEventListener('click', handleBodyClick, false);
    } else {
        removeClickListener({
            id: bodyClickEventId.value,
            componentId: componentId.value,
        });
    }
};

watch(
    () => props.modelValue,
    () => {
        if (!isDynamic.value) return;
        initiatePopperIfNotSetAndToggle(props.modelValue);
    }
);

watch(
    () => props.forceShow,
    () => {
        if (props.forceShow) initiatePopperIfNotSetAndToggle(true);
    }
);
watch(
    () => props.forceHide,
    () => {
        if (props.forceHide) initiatePopperIfNotSetAndToggle(true);
    }
);

watch(
    () => cloneDeep(popperOptions.value),
    () => {
        if (popper.value) popper.value?.setOptions({ ...popperOptions.value });
    }
);

watch(
    () => props.trigger,
    () => {
        if (isDynamic.value) return;
        removeEventListeners();
        removeBodyClickEventListener();
        setTimeout(() => {
            addEventListeners();
        }, 100);
    }
);

watch(
    () => props.hideOnClickOutside,
    () => {
        if (!isPopperOpen.value) return;
        if (props.hideOnClickOutside) {
            addBodyClickEventListener();
        } else {
            removeBodyClickEventListener();
        }
    }
);

const show = async () => {
    initiatePopperIfNotSetAndToggle(true);
};

const hide = async () => {
    initiatePopperIfNotSetAndToggle(false);
};

defineExpose({
    isPopperOpen,
    show,
    hide,
    el: root_el,
});
</script>

<template>
    <div
        :id="componentId"
        ref="root_el"
        class="skn-popper"
        :class="[
            isDropdown ? 'dropdown-popper' : '',
            isDropdownChild ? 'dropdown-child-popper' : '',
        ]"
    >
        <div
            v-if="!reference"
            :id="refId"
            class="skn-popper__reference"
            :class="[refClass]"
            aria-describedby="tooltip"
        >
            <slot name="reference" :is-open="isPopperOpen"></slot>
        </div>

        <Transition
            :name="transitionName"
            :enter-from-class="enterFromClass"
            :enter-to-class="enterToClass"
            :enter-active-class="enterActiveClass"
            :leave-from-class="leaveFromClass"
            :leave-to-class="leaveToClass"
            :leave-active-class="leaveActiveClass"
        >
            <div
                v-show="isPopperOpen"
                :id="popperId"
                class="skn-popper__content"
                :class="[
                    popupClass,
                    isDropdown ? 'skn-popper__dropdown' : '',
                    isDropdownChild ? 'skn-popper__dropdown-child' : '',
                    isPopperOpen ? 'skn-popper__popup-open' : '',
                ]"
                role="tooltip"
            >
                <div v-if="arrow" data-popper-arrow class="skn-popper__arrow">
                    <div class="arrow" :class="[arrowClass]"></div>
                </div>
                <slot :show="show" :hide="hide" :is-open="isPopperOpen"></slot>
            </div>
        </Transition>
    </div>
</template>

<style>
:root {
    --skn-popper-active-item-bg: #e6e6e6;
    --skn-popper-active-item-hover: #fafafa;
    --skn-popper-z-index: 1133;
    --skn-popper-arrow-width: 12px;
    --skn-popper-arrow-height: 12px;
    --skn-popper-arrow-transform-plus: 6px;
    --skn-popper-arrow-transform-minus: -6px;

    --skn-popper-tooltip-bg: #121212;
    --skn-popper-tooltip-color: #fff;
    --skn-popper-tooltip-padding: 16px;
    --skn-popper-tooltip-max-width: 320px;

    --skn-popper-dropdown-container-background: #ffffff;
    --skn-popper-dropdown-container-border: 1px solid #e6e6e6;
    --skn-popper-dropdown-container-box-shadow: 0px 8px 10px 1px
            rgba(0, 0, 0, 0.14),
        0px 3px 14px 2px rgba(0, 0, 0, 0.12),
        0px 5px 5px -3px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped>
.active-item > .skn-popper__reference {
    background: var(--skn-popper-active-item-bg);
}
.skn-popper__arrow {
    height: 0;
}
.skn-popper__arrow .arrow {
    width: var(--skn-popper-arrow-width);
    height: var(--skn-popper-arrow-height);
}
.skn-popper__content {
    /* width: fit-content; */
    z-index: var(--skn-popper-z-index);
}

.skn-popper__content[data-popper-placement^='right'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='right-start'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-minus))
        translateY(var(--skn-popper-arrow-transform-plus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='right-end'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-minus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

/* bottom */
.skn-popper__content[data-popper-placement^='bottom'] .arrow {
    transform: translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='bottom-start'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-plus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='bottom-end'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-minus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

/* left */
.skn-popper__content[data-popper-placement^='left'] .skn-popper__arrow {
    right: 0;
}
.skn-popper__content[data-popper-placement^='left'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-plus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='left-start'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-plus))
        translateY(var(--skn-popper-arrow-transform-plus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='left-end'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-plus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

/* top */
.skn-popper__content[data-popper-placement^='top'] .skn-popper__arrow {
    bottom: 0;
}
.skn-popper__content[data-popper-placement^='top'] .arrow {
    transform: translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='top-start'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-plus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}

.skn-popper__content[data-popper-placement^='top-end'] .arrow {
    transform: translateX(var(--skn-popper-arrow-transform-minus))
        translateY(var(--skn-popper-arrow-transform-minus)) rotate(45deg);
}
</style>
