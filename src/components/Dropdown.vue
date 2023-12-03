<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import Popup from './Popup.vue';

import { hasEventOccuredInChildTree } from '../utils/useUtils';

import { v4 } from 'uuid';

import { PopupProps, PopupEmit } from '../types/props.types';

type Props = PopupProps & {
    hideOnItemClick?: boolean;
    hideParentOnItemClick?: boolean;
    keyboardNavigation?: boolean;
    dropdownClass?: string;
};
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
    hideOnItemClick: () => true,
    hideParentOnItemClick: () => true,
    keyboardNavigation: () => true,
    dropdownClass: () => 'skn-popper__dropdown-wrapper',
});

const emit = defineEmits<Emit>();

const popupComponent = ref<InstanceType<typeof Popup> | null>(null);

const showPopper = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:model-value', val),
});

const isDropdownItemClicked = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return false;

    if (
        target.classList.contains('skn-popper__dropdown-item') &&
        !target.classList.contains('skn-popper__dropdown-child-item')
    )
        return true;

    const targetParent = target.closest('.skn-popper__dropdown-item');
    if (!targetParent) return false;

    if (targetParent.classList.contains('skn-popper__dropdown-child-item'))
        return false;

    return true;
};

const onChildClick = (event: MouseEvent, hide: () => Promise<void>) => {
    const el = event.target as HTMLElement;
    if (!el) return;

    if (props.hideOnItemClick) {
        const isItemClicked = isDropdownItemClicked(event);
        if (isItemClicked) hide();
    }
    if (!props.hideParentOnItemClick && event.type === 'click') {
        const isEventOnChild = hasEventOccuredInChildTree(
            event,
            dropdownId.value
        );
        if (isEventOnChild) {
            const closestItemWithChildren = el.closest(
                '.skn-popper__dropdown-child-item'
            );
            if (!closestItemWithChildren) event.stopPropagation();
        }
    }
};

// keyboard scrolling
const dropdownId = ref(
    `dropdown-${props.isDropdownChild ? 'child-' : ''}${v4()}`
);
const activeItem = ref<Element | null>(null);

const enableKeys = (event: KeyboardEvent) => {
    if (
        !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Enter'].includes(
            event.key
        )
    )
        return;
    event.preventDefault();

    const el = document.querySelector(
        `#${dropdownId.value}`
    ) as HTMLElement | null;
    if (!el) return;

    const openedChildren = el.querySelector('.skn-popper__popup-open');
    if (openedChildren) return;

    if (event.key === 'Enter') {
        const item = activeItem.value as HTMLElement | null;
        if (!item) return;

        if (item.classList.contains('skn-popper__dropdown-item'))
            (activeItem.value as HTMLElement).click();

        if (item.classList.contains('skn-popper')) {
            const reference = item.querySelector('.skn-popper__reference');
            if (reference) (reference as HTMLElement).click();
        }

        return;
    }

    if (event.key === 'ArrowRight') {
        const item = activeItem.value as HTMLElement | null;
        if (!item) return;

        if (item.classList.contains('skn-popper')) {
            const reference = item.querySelector('.skn-popper__reference');
            if (reference) (reference as HTMLElement).click();

            const mouseoverEvent = new MouseEvent('mouseover', {
                view: window,
                bubbles: true,
            });
            (item as HTMLElement).dispatchEvent(mouseoverEvent);

            return;
        }
    }

    if (event.key === 'ArrowLeft') {
        const root = popupComponent.value?.el as HTMLElement;
        if (!root) return;
        if (!root.classList.contains('dropdown-child-popper')) return;

        const reference = root.querySelector('.skn-popper__reference');
        if (reference) (reference as HTMLElement).click();

        const mouseoutEvent = new MouseEvent('mouseout', {
            view: window,
            bubbles: true,
        });
        root.dispatchEvent(mouseoutEvent);

        return;
    }

    const items: HTMLElement[] = [].filter.call(
        el.children[0].children,
        (item: HTMLElement) =>
            item.classList.contains('skn-popper__dropdown-item') ||
            item.classList.contains('skn-popper')
    );

    if (!items.length) activeItem.value = null;
    else {
        if (activeItem.value?.id) {
            const index = [].findIndex.call(
                items,
                (item: HTMLElement) => item?.id === activeItem.value?.id
            );
            if (index < 0) {
                if (event.key === 'ArrowDown') activeItem.value = items[0];
                if (event.key === 'ArrowUp')
                    activeItem.value = items[items.length - 1];
            } else {
                if (event.key === 'ArrowDown') {
                    if (index < items.length - 1)
                        activeItem.value = items[index + 1];
                    else activeItem.value = items[0];
                }
                if (event.key === 'ArrowUp') {
                    if (index === 0) activeItem.value = items[items.length - 1];
                    else activeItem.value = items[index - 1];
                }
            }
        } else {
            if (event.key === 'ArrowDown') activeItem.value = items[0];
            if (event.key === 'ArrowUp')
                activeItem.value = items[items.length - 1];
        }
    }

    [].forEach.call(items, (item: HTMLElement) => {
        item.classList.remove('active-item');
        if (activeItem.value?.id && activeItem.value.id === item?.id)
            item.classList.add('active-item');
    });
};

const enableKeyboardEventListeners = () => {
    window.addEventListener('keydown', enableKeys, false);
};
const disableKeyboardEventListeners = () => {
    window.removeEventListener('keydown', enableKeys, false);
};

watch(
    () => popupComponent.value?.isPopperOpen,
    (isOpen) => {
        if (!props.keyboardNavigation) return;
        isOpen
            ? enableKeyboardEventListeners()
            : disableKeyboardEventListeners();
    }
);

onBeforeUnmount(() => {
    if (!props.keyboardNavigation) return;
    disableKeyboardEventListeners();
});

defineExpose({
    isPopperOpen: popupComponent.value?.isPopperOpen,
    show: popupComponent.value?.show,
    hide: popupComponent.value?.hide,
    el: popupComponent.value?.el,
});
</script>

<template>
    <Popup
        v-model="showPopper"
        ref="popupComponent"
        :trigger="trigger"
        :reference="reference"
        :is-dynamic-reference="isDynamicReference"
        :options="options"
        :placement="placement"
        :offset="offset"
        :strategy="strategy"
        :on-first-update="onFirstUpdate"
        :hide-on-click-outside="hideOnClickOutside"
        :refClass="refClass"
        :popupClass="popupClass"
        :arrow="arrow"
        :arrow-class="arrowClass"
        :force-show="forceShow"
        :force-hide="forceHide"
        :disabled="disabled"
        :local-event-listeners="localEventListeners"
        :is-dropdown="true"
        :is-dropdown-child="isDropdownChild"
        :transition-name="transitionName"
        :enter-from-class="enterFromClass"
        :enter-to-class="enterToClass"
        :enter-active-class="enterActiveClass"
        :leave-from-class="leaveFromClass"
        :leave-to-class="leaveToClass"
        :leave-active-class="leaveActiveClass"
        @ready="
            (popper, popperEl, refEl) => emit('ready', popper, popperEl, refEl)
        "
        @destroy="emit('destroy')"
        @show="emit('show')"
        @hide="emit('hide')"
        @create-error="
            (popperEl, refEl) => emit('create-error', popperEl, refEl)
        "
    >
        <template #reference="{ isOpen }">
            <slot name="reference" :is-open="isOpen"></slot>
        </template>

        <template #default="{ show, hide, isOpen }">
            <div
                :id="dropdownId"
                :class="[dropdownClass]"
                @click="onChildClick($event, hide)"
            >
                <slot :show="show" :hide="hide" :is-open="isOpen"></slot>
            </div>
        </template>
    </Popup>
</template>

<style scoped>
.skn-popper__dropdown-wrapper {
    border: var(--skn-popper-dropdown-container-border);
    box-shadow: var(--skn-popper-dropdown-container-box-shadow);
}
</style>
