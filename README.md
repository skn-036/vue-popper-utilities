# Vue Popper Utilites

vue-popper-utilities is a wrapper around popperjs@core for Vue.js for creating any custom popup, dropdown, multi level dropdown with nested child dropdowns, tooltip etc.

**Key Features**:

-   **Vue 3** compatible!
-   Fully written in Typescript with full types support.
-   Global event bus. Only one event listener no matter how much popups are initiated in a single page. Permormance won't drop if there are many components in a single page.
-   Predefined components like `Dropdown`, `DropdownChild`, `Tooltip` for covering most of the use case.
-   Fully customizable. It is possible to make any kind of custom popup using the package.
-   Keyboard navigation between multiple children dropdowns.
-   transition and animation capability using vue default **Transition** component.

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
        </template>
    </Dropdown>
</template>
```

## Installation

```
npm i vue-popper-utilities
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

### Use directly inside a component

```js
<script setup>
import { Popup } from 'vue-popper-utilities';
import 'vue-popper-utilities/style.css';
</script>
```


## Popup.vue
This is the base component of the popper. All other components are the extraction of this component.

### Normal usage
```js
<Popup>
    <template #reference>
        <button>Popup button</button>
    </template>

    <div>Popup content</div>
</Popup>
```

### Opening popper dynamically with v-model
```js
<Popup v-model="show" reference="#popup-reference">
    <div>Popup content</div>
</Popup>
```

### Props

| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trigger                               | String                                                                                    | `click`                               | trigger of the popup. possible values are **click**, **hover**, **focus**.                                                                                                                                                     |
| placement                             | [Placement](https://popper.js.org/docs/v2/constructors/#placement)                        | `bottom-start`                        | Placement of the popup element with respect to reference.                                                                                                                                                                  |
| offset                                | Array [number, number] [Popper offset](https://popper.js.org/docs/v2/modifiers/offset/)   | `[0, 4]`                              | Offset of the popper relative to the reference.                                                                                                                                                                            |
| strategy                              | String [Strategy](https://popper.js.org/docs/v2/constructors/#strategy)                   | `absolute`                            | Positioning strategy. possible values are **absolute** or **fixed**.                                                                                                                                                           |
| options                               | [Options](https://popper.js.org/docs/v2/constructors/#options)                            | `undefined`                           | Can be used for having more fine control over, how the popup will aprear. Most of the times above props will work fine. This props has high priority over **placement**, **offset** and **strategy** props. setting this will override other values. Values are calculated by deep comparing i.e; if value exists on the **options** prop it will take from **options** prop. Otherwise if value exists on the other props, it will take other props. Otherwise it will take from default values. |
| on-first-update                       | [Function](https://popper.js.org/docs/v2/constructors/#options)                           | `undefined`                           | Callback function to run after the first update of the popper.js.
| model-value                           | Boolean                                                                                   | `undefined`                           | Can be used to control popup dynamically from a variable. **IMPORTANT**: reference props must be required with this prop to work. |
| reference                             | Element or String or null                                                                 | `null`                                | if popup is controlled by v-model, reference element is the target element where to glue in the popup. It's value can be any HTML element or any valid css selector. **IMPORTANT**: must be required with v-model. |
| is-dynamic-reference                  | Boolean                                                                                   | `false`                               | Sometimes the reference element can be conditionally added or removed from the DOM. while using with **v-model**, It may not exist on the DOM during the initialization of the popper. In that case, popup will not show. To rectify this scenerio, settings this prop to `true` will destroy old popper, related event listeners. Then it will reinitialize new popper again on every open request. |
| hide-on-click-outside                 | Boolean                                                                                   | `true`                                | Will hide the popup on clicking outside of the popup content. |
| arrow                                 | Boolean                                                                                   | `false`                               | whether to show arrow on the popup. |
| arrow-class                           | String                                                                                    | `undefined`                           | css class of the arrow element. |
| ref-class                             | String                                                                                    | `undefined`                           | css class of the reference element. |
| popup-class                           | String                                                                                    | `undefined`                           | css class of the popup element. |
| disabled                              | Boolean                                                                                   | `false`                               | disable the component. |
| local-event-listener                  | Boolean                                                                                   | `false`                               | This package implements global event bus to listen on the events to optimize the performance. One event listener on the body element listen to all the event interactions. if any parent element uses ```event.stopPropagation()```, it will not work with global event bus. So it is highly recommend not to use ```event.stopPropagation()``` on any parent element. If in case, it is absolutely needed to use stop propagation, this prop should set to `true`. In that case, event listeners will be registered locally. For every component, it will register two event listeners. |
| force-show                            | Boolean                                                                                   | `false`                               | set it to true to show the popup. **Note:** Need to reset before using again. |
| force-hide                            | Boolean                                                                                   | `false`                               | set it to true to hide the popup. **Note:** Need to reset before using again. |
| transition-name                       | String                                                                                    | `undefined`                           | transition name of the popup element. It uses vue.js `Transition` component. for details [see here.](https://vuejs.org/guide/built-ins/transition) |
| enter-from-class                      | String                                                                                    | `undefined`                           | enter-from-class of vue `Transition`. |
| enter-to-class                        | String                                                                                    | `undefined`                           | enter-to-class of vue `Transition`. |
| enter-active-class                    | String                                                                                    | `undefined`                           | enter-active-class of vue `Transition`. |
| leave-from-class                      | String                                                                                    | `undefined`                           | leave-from-class of vue `Transition`. |
| leave-to-class                        | String                                                                                    | `undefined`                           | leave-to-class of vue `Transition`. |
| leave-active-class                    | String                                                                                    | `undefined`                           | leave-active-class of vue `Transition`. |

### Events

**`ready`**
<br />emitted when popper instance is created. event data are popper instance, popup element and reference element.
```js
emit('ready', popper.value, popper_el.value, ref_el.value);

// typescript definition
(e: 'ready', popper: Instance, popperEl: Element | null, refEl: Element | VirtualElement | null ): void;
```

**`update:model-value`**
<br />emitted if v-model is set.
```js
emit('update:model-value', isPopperOpen.value);

// typescript definition
(e: 'update:model-value', isPopperOpen: boolean): void;
```

**`show`**
<br />emitted when popup is shown.
```js
emit('show');

// typescript definition
(e: 'show'): void;
```

**`hide`**
<br />emitted when popup is hidden.
```js
emit('hide');

// typescript definition
(e: 'hide'): void;
```

**`destroy`**
<br />emitted when popper instance is destroyed.
```js
emit('destroy');

// typescript definition
(e: 'destroy'): void;
```

**`create-error`**
<br />emitted when popper is falied to initialize.
```js
emit('create-error', popper_el.value, ref_el.value);

// typescript definition
( e: 'create-error', popperEl: Element | null, refEl: Element | VirtualElement | null ): void;
```

### Slots
**`reference`**
<br />reference element is rendered in this slot

**Slot props:**
-   `isOpen {boolean}` whether the popup is open

```js
<template #reference="{ isOpen }">
    <button class="test-btn" :class="[isOpen ? 'active' : '']">
        Test button
    </button>
</template>
```

**`default`**
<br />popup element is rendered in this slot

**Slot props:**
-   `isOpen {boolean}` whether the popup is open
-   `show {function}` show the popup
-   `hide {function}` hide the popup

```js
<template #default="{ isOpen, show, hide }">
    <button class="show-btn" :class="[isOpen ? 'active' : '']" @click="show">
        Show
    </button>

    <button class="hide-btn" @click="hide">
        Hide
    </button>
</template>
```

### Expose
Popup.vue exposes following properties:
-   `isPopperOpen ${boolean}` whether the popup open
-   `show {function}` show the popup
-   `hide {function}` hide the popup
-   `el {HTMLElement}` root element of the popper

```js
<script setup>
import { ref, onMounted } from 'vue';
const popperUtilities = ref(null);

onMounted(() => {
    console.log(popperUtilities.value?.isPopperOpen.value); // boolean
    console.log(popperUtilities.value?.el.value); // HTML element
    console.log(popperUtilities.value?.show); // Function
    console.log(popperUtilities.value?.hide); // Function
});
</script>

<template>
    <Popup ref="popperUtilities">
        <template #reference>Ref el</template>
        <div>Popup content</div>
    </Popup>
</template>

```

## Dropdown.vue
This is the base Dropdown component. Technically any custom dropdown element can be rendered inside the popup, but it is recommended to use only `DropdownItem.vue`, `DropdowChildren.vue` as top level children for keyboard navigation. Any custom dropdown item will be skipped by keyboard navigation. If you want to render anything other than the dropdown, try `Popup.vue` instead. If you want to customize the wrapper container of the dropdown popup, use `dropdown-class` prop.

```js
<script setup>
import { Dropdown, DropdownItem, DropdownChild } from 'vue-popper-utilities';
import 'vue-popper-utilities/style.css';

const onItemClick = (x) => {
    console.log(`Dropdown item ${x} has been clicked`)
}
</script>

<template>
    <Dropdown trigger="click" :offset="[0, 8]" placement="right-start">
        <template #reference="{ isOpen }">
            <button class="test-btn" :class="[isOpen ? 'active' : '']">
                Test button
            </button>
        </template>

        <template v-slot="{ isOpen, hide }">
            <DropdownItem v-for="x in 6" :key="x" @click="onItemClick(x)">
                {{ `Item ${x}` }}
            </DropdownItem>

            <DropdownChild trigger="hover" :offset="[0, 0]" :hide-parent-on-item-click="false">
                <template #reference>
                    <button>Item child 1</button>
                </template>

                <div class="dropdown-child-1-container">
                    <DropdownItem v-for="y in 2" :key="y">
                        {{ `Item child ${y}` }}
                    </DropdownItem>
                </div>
            </DropdownChild>

            // this button will be skipped by keyboard navigation.
            // As this top level child is not either of DropdownItem or DropdownChild component
            <button @click="hide()">Hide manually</button>
        </template>
    </Dropdown>
</template>
```

### Props
Same as props of `Popup.vue`

**Additional Props:**
| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hide-on-item-click                    | Boolean                                                                                   | `true`                                | whether to hide the dropdown on any item click.                                                                                                                                                                          |
| hide-parent-on-item-click             | Boolean                                                                                   | `true`                                | This prop is only applicable for dropdown children. if set to false, all parent dropdowns will not be hidden after close.                                                                                                     |
| keyboard-navigation                   | Boolean                                                                                   | `true`                                | enable keyboard navigation.                                                                                                                                                                                                |
| dropdown-class                        | String                                                                                    | `undefined`                           | css classes to be appened on the dropdown container.                                                                                                                                                                      |

### Events
Same as events of `Popup.vue`

### Slots
Same as slots of `Popup.vue`

### Expose
Same as expose of `Popup.vue`

## DropdownChild.vue
This is the base DropdownChild component. Technically any custom dropdown element can be rendered inside the popup, but it is recommended to use only `DropdownItem.vue`, `DropdowChildren.vue` as top level children for keyboard navigation. Any custom dropdown item will be skipped by keyboard navigation. If you want to render anything other than the dropdown, try `Popup.vue` instead. If you want to customize the wrapper container of the dropdown popup, use `dropdown-class` prop.

### Props
Same as events of `Dropdown.vue`

**Additional Props:**

| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| child-arrow                           | Boolean                                                                                   | `true`                                | whether to show a arrow at the end for the dropdown child item.                                                                                                                                                                         |

### Events
Same as events of `Dropdown.vue`

### Slots
Same as slots of `Dropdown.vue`

**Additional Slots:**

**`child-arrow`**
<br />arrow at end of dropdown children. any custom icon or element can be rendered here. If not used and `child-arrow` prop is set to **true**, then default arrow will be rendered.

**Slot props:**
-   `isOpen {boolean}` whether the popup is open

### Expose
Same as expose of `Dropdown.vue`

## DropdownItem.vue
This component has no api

## Tooltip.vue
This component will render a tooltip on the target element. by default, trigger for this component is **hover** and placement is **bottom**. But can be customized throught props.
```js
<Tooltip
    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis veritatis autem deserunt"
>
    <template #reference>
        <button class="tooltip-btn" >
            {{ `Tootlip button` }}
        </button>
    </template>
</Tooltip>
```

### Props
Same as props of `Popup.vue`

**Additional Props:**
| Name                                  | Type                                                                                      | Default                               | Description                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text                                  | String                                                                                    | `undefined`                           | Text content of the tooltip. if custom tooltip content is required, use **default** slot instead. |

### Events
Same as events of `Popup.vue`

### Slots
Same as slots of `Popup.vue`

### Expose
Same as expose of `Popup.vue`

## Styling
This package comes with minimal css implementation to make it unstyled as much possible. Using props like `ref-class`, `popup-class`, `dropdown-class` etc, it is possible to style as per your own theme.

Default styling can be changed through customizing the css variables. Default css variables are as listed.
```css
--skn-popper-active-item-bg: #e6e6e6;
--skn-popper-active-item-hover: #fafafa;
--skn-popper-z-index: 1133;
--skn-popper-arrow-width: 12px;
--skn-popper-arrow-height: 12px;
--skn-popper-arrow-transform-plus: 6px;
--skn-popper-arrow-transform-minus: -6px;

--skn-popper-tooltip-bg: #121212;
--skn-popper-tooltip-color: #ffffff;
--skn-popper-tooltip-padding: 16px;
--skn-popper-tooltip-max-width: 320px;

--skn-popper-dropdown-container-border: 1px solid #e6e6e6;
--skn-popper-dropdown-container-box-shadow: 0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12),
    0px 5px 5px -3px rgba(0, 0, 0, 0.2);
```

we can also customize through css styling.
```css
<style scoped>
:deep(.skn-popper .skn-popper__reference) {
    /* add custom styling here */
}
</style>
```
## Bugs and new feature
Please feel free add issues with any bugs or any feature request.

## License
This is open source project under MIT license.

