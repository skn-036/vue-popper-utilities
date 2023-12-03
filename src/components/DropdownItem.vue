<script setup lang="ts">
import { ref } from 'vue';
import { v4 } from 'uuid';

const childId = ref(`dropdown-item-${v4()}`);
</script>

<template>
    <div :id="childId" class="skn-popper__dropdown-item">
        <slot></slot>
    </div>
</template>

<style scoped>
.skn-popper__dropdown-item {
    width: 100%;
    padding: 6px 16px;
    cursor: pointer;
}

.skn-popper__dropdown-item:hover {
    background: #fafafa;
}

.skn-popper__dropdown-item.active-item {
    background: #e6e6e6;
}
</style>
