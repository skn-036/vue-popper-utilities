# Vue Popper Utilites

vue-popper-utilities is a wrapper around popperjs@core for Vue.js for creating any custom popup, dropdown, multi level dropdown, tooltip etc.

**Key Features**:

-   **Vue 3** compatible!
-   Fully written in Typescript with full types support.
-   Global event bus. Only one event listener no matter how much popups are initiated in a single page. Permormance won't drop if there are many components in a single page.
-   Predefined components like `Dropdown`, `DropdownChild`, `Tooltip` for covering most of the use case.
-   Fully customizable. It is possible to make any kind of custom popup using the package.
-   Keyboard navigation between multiple children dropdowns.

## Getting started

```js
<script setup>
import { Dropdown, DropdownItem, DropdownChild } from 'vue-popper-utilities';
import 'vue-popper-utilities/style.css';
</script>

<template>
    <Dropdown trigger="click" :offset="[0, 8]" placement="right-start">
        <template #reference="{ isOpen }">
            <button class="test-btn" :class="[isOpen ? 'active' : '']">
                Test button
            </button>
        </template>

        <template v-slot="{ isOpen, hide }">
            <div class="dropdown-container">
                <DropdownItem v-for="x in 6" :key="x">
                    {{ `Item ${x}` }}
                </DropdownItem>

                <DropdownChild trigger="hover">
                    <template #reference>
                        <button>Item child 1</button>
                    </template>

                    <div class="dropdown-child-1-container">
                        <DropdownItem v-for="y in 2" :key="y">
                            {{ `Item child ${y}` }}
                        </DropdownItem>
                    </div>
                </DropdownChild>

                <button @click="hide()">Hide manually</button>
            </div>
        </template>
    </Dropdown>
</template>
```

## Installation

```
npm i vue-popper-utilities
yarn add vue-popper-utilities
```

## Usage

### Global registration

```js
import { createApp } from 'vue';
import App from './App.vue';

import {
    Popup,
    Dropdown,
    DropdownChild,
    DropdownItem,
    Tooltip,
} from 'vue-popper-utilities';
import 'vue-popper-utilities/style.css';

const app = createApp(App);
app
    .component('Popup', Popup)
    .component('Dropdown', Dropdown)
    .component('DropdownChild', DropdownChild)
    .component('DropdownItem', DropdownItem)
    .component('Tooltip', Tooltip)
    .mount('#app');
```

### Use directly on the component

```js
<script setup>
import { Popup } from 'vue-popper-utilities';
import 'vue-popper-utilities/style.css';
</script>
```

## Components

### Popup.vue
This is the base implementation of the popper. All other components are the extraction of this component.

#### Normal usage
```js
<Popup>
    <template #reference>
        <button>Popup button</button>
    </template>

    <div>Popup content</div>
</Popup>
```

#### Opening popper dynamically with v-model
```js
<Popup v-model="show" reference="#popup-reference">
    <div>Popup content</div>
</Popup>
```

**Props**:
| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trigger                               | string                                                                                    | `click`                               | trigger of the popup. possible values **click**, **hover**, **focus**.                                                                                                                                                     |
| placement                             | [Placement](https://popper.js.org/docs/v2/constructors/#placement)                        | `bottom-start`                        | Placement of the popup element with respect to reference.                                                                                                                                                                  |
| offset                                | array [number, number] [Popper offset](https://popper.js.org/docs/v2/modifiers/offset/)   | `[0, 4]`                              | Offset of the popper relative to the reference.                                                                                                                                                                            |
| strategy                              | string [Strategy](https://popper.js.org/docs/v2/constructors/#strategy)                   | `absolute`                            | Positioning strategy. possible values **absolute** or **fixed**.                                                                                                                                                           |
| options                               | [Options](https://popper.js.org/docs/v2/constructors/#options)                            | `undefined`                           | Can be used for more fine control over how popup will aprear. Most of the times above props will work fine. This props has high priority over placement, offset and strategy props. setting this will override other values. Values are calculated by deep comparing i.e; if value exists on the options props it will take from options, otherwise if exists on the other props it will take other props, otherwise it will take from default values. |
| on-first-update                       | [Function](https://popper.js.org/docs/v2/constructors/#options)                           | `undefined`                           | Callback function to run after the first update of the popper.js

