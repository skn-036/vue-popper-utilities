<script setup lang="ts">
import { computed, ref } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

import { PopupProps, PopupEmit } from '../types/props.types';

type Props = PopupProps & {
    hideOnItemClick?: boolean;
    hideParentOnItemClick?: boolean;
    keyboardNavigation?: boolean;
    dropdownClass?: string;
    childArrow?: boolean;
};
type Emit = PopupEmit & {};

const props = withDefaults(defineProps<Props>(), {
    trigger: () => 'hover',
    reference: null,
    isDynamicReference: () => false,
    placement: () => 'right-start',
    offset: () => [0, 0],
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
    childArrow: () => true,
});

const emit = defineEmits<Emit>();

const dropdownComponent = ref<InstanceType<typeof Dropdown> | null>(null);

const showPopper = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:model-value', val),
});

defineExpose({
    isPopperOpen: dropdownComponent.value?.isPopperOpen,
    show: dropdownComponent.value?.show,
    hide: dropdownComponent.value?.hide,
    el: dropdownComponent.value?.el,
});
</script>

<template>
    <Dropdown
        v-model="showPopper"
        ref="dropdownComponent"
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
        :is-dropdown-child="true"
        :hide-on-item-click="hideOnItemClick"
        :hide-parent-on-item-click="hideParentOnItemClick"
        :keyboard-navigation="keyboardNavigation"
        :dropdown-class="dropdownClass"
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
            <DropdownItem class="skn-popper__dropdown-child-item">
                <slot name="reference" :is-open="isOpen"></slot>
                <slot v-if="childArrow" name="child-arrow" :is-open="isOpen">
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="css-i6dzq1"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </slot>
            </DropdownItem>
        </template>

        <template #default="{ show, hide, isOpen }">
            <slot :show="show" :hide="hide" :is-open="isOpen"></slot>
        </template>
    </Dropdown>
</template>

<style scoped>
.skn-popper__dropdown-child-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
