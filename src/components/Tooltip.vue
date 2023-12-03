<script setup lang="ts">
import { computed, ref } from 'vue';
import Popup from './Popup.vue';

import { PopupProps, PopupEmit } from '../types/props.types';

type Props = PopupProps & {
    text?: string;
};
type Emit = PopupEmit & {};

const props = withDefaults(defineProps<Props>(), {
    trigger: () => 'hover',
    reference: null,
    isDynamicReference: () => false,
    placement: () => 'bottom',
    offset: () => [0, 10],
    strategy: () => 'absolute',
    hideOnClickOutside: () => true,
    refClass: () => '',
    popupClass: () => '',
    arrow: () => true,
    arrowClass: () => 'skn-popper_arrow',
    forceHide: () => false,
    forceShow: () => false,
    disabled: () => false,
    localEventListeners: () => false,
    isDropdown: () => false,
    isDropdownChild: () => false,
    default: () => '',
});

const emit = defineEmits<Emit>();

const popupComponent = ref<InstanceType<typeof Popup> | null>(null);

const showPopper = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:model-value', val),
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
            <slot :show="show" :hide="hide" :is-open="isOpen">
                <div v-if="text" class="skn-popper_tooltip">{{ text }}</div>
            </slot>
        </template>
    </Popup>
</template>

<style scoped>
.skn-popper_tooltip {
    background: #121212;
    color: #fff;
    padding: 16px;
    max-width: 320px;
}
:deep(.skn-popper_arrow) {
    background: #121212;
}
</style>
