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

***`Props`***:

| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trigger                               | String                                                                                    | `click`                               | trigger of the popup. possible values **click**, **hover**, **focus**.                                                                                                                                                     |
| placement                             | [Placement](https://popper.js.org/docs/v2/constructors/#placement)                        | `bottom-start`                        | Placement of the popup element with respect to reference.                                                                                                                                                                  |
| offset                                | Array [number, number] [Popper offset](https://popper.js.org/docs/v2/modifiers/offset/)   | `[0, 4]`                              | Offset of the popper relative to the reference.                                                                                                                                                                            |
| strategy                              | String [Strategy](https://popper.js.org/docs/v2/constructors/#strategy)                   | `absolute`                            | Positioning strategy. possible values **absolute** or **fixed**.                                                                                                                                                           |
| options                               | [Options](https://popper.js.org/docs/v2/constructors/#options)                            | `undefined`                           | Can be used for more fine control over how popup will aprear. Most of the times above props will work fine. This props has high priority over placement, offset and strategy props. setting this will override other values. Values are calculated by deep comparing i.e; if value exists on the options props it will take from options, otherwise if exists on the other props it will take other props, otherwise it will take from default values. |
| on-first-update                       | [Function](https://popper.js.org/docs/v2/constructors/#options)                           | `undefined`                           | Callback function to run after the first update of the popper.js.
| model-value                           | Boolean                                                                                   | `undefined`                           | Can be used to control popup dynamically from a variable. **IMPORTANT**: reference props must be required with this prop to work. |
| reference                             | Element or String or null                                                                 | `null`                                | if popup is controlled by v-model, reference element is the target element where to glue in the popup. It's value can be any HTML element or any valid css selector. **IMPORTANT**: must be required with v-model |
| is-dynamic-reference                  | Boolean                                                                                   | `false`                               | Sometimes the reference element can be conditionally added or removed from the DOM. while using with v-model, It may not exist on the DOM during the initialization of the popper. In that case, popup will not show. To rectify this scenerio, settings this prop to `true` will destroy old popper, related event listeners and initialize new popper again on every open request. |
| hide-on-click-outside                 | Boolean                                                                                   | `true`                                | Will hide the popup on the click on the body the popup content itself. |
| arrow                                 | Boolean                                                                                   | `false`                               | whether to show arrow on the popup. |
| arrow-class                           | String                                                                                    | `undefined`                           | css class of the arrow element. |
| ref-class                             | String                                                                                    | `undefined`                           | css class of the reference element. |
| popup-class                           | String                                                                                    | `undefined`                           | css class of the popup element. |
| disabled                              | Boolean                                                                                   | `false`                               | disable the component. |
| local-event-listener                  | Boolean                                                                                   | `false`                               | This package implements global event bus to listen on the events to optimize the performance. One event listener on the body element listen to all of the event interactions. if any parent of the reference element uses ```event.stopPropagation()```, it will not work. So it is highly recommend not to stop propagation on any parent element. If in case, it is absolutely needed to use stop propagation on any parent element, this prop should set to `true`. In that case, event listeners will be registered locally. For every component, it will register two event listeners. |
| force-show                            | Boolean                                                                                   | `false`                               | set it to true to show the popup, if the popup is not open. |
| force-hide                            | Boolean                                                                                   | `false`                               | set it to true to hide the popup, if the popup is open |
| transition-name                       | String                                                                                    | `undefined`                           | transition name of the popup element. It uses vue.js `Transition` component. for details [see here.](https://vuejs.org/guide/built-ins/transition) |
| enter-from-class                      | String                                                                                    | `undefined`                           | enter-from-class of vue `Transition`. |
| enter-to-class                        | String                                                                                    | `undefined`                           | enter-to-class of vue `Transition`. |
| enter-active-class                    | String                                                                                    | `undefined`                           | enter-active-class of vue `Transition`. |
| leave-from-class                      | String                                                                                    | `undefined`                           | leave-from-class of vue `Transition`. |
| leave-to-class                        | String                                                                                    | `undefined`                           | leave-to-class of vue `Transition`. |
| leave-active-class                    | String                                                                                    | `undefined`                           | leave-active-class of vue `Transition`. |

***`Events`***:

**ready**
emitted when popper instance is created. event data are popper instance, popup element and reference element.
```js
emit('ready', popper.value, popper_el.value, ref_el.value);

// typescript definition
(e: 'ready', popper: Instance, popperEl: Element | null, refEl: Element | VirtualElement | null ): void;
```

**update:model-value**
emitted if v-model is set.
```js
emit('update:model-value', isPopperOpen.value);

// typescript definition
(e: 'update:model-value', isPopperOpen: boolean): void;
```

**show**
emitted when popup is shown.
```js
emit('show');

// typescript definition
(e: 'show'): void;
```

**hide**
emitted when popup is hidden.
```js
emit('hide');

// typescript definition
(e: 'hide'): void;
```

**destroy** 
emitted when popper instance is destroyed.
```js
emit('destroy');

// typescript definition
(e: 'destroy'): void;
```

**create-error**
emitted when popper is falied to initialize.
```js
emit('create-error', popper_el.value, ref_el.value);

// typescript definition
( e: 'create-error', popperEl: Element | null, refEl: Element | VirtualElement | null ): void;
```

***`Slots`***:


