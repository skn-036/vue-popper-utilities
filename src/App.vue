<script setup lang="ts">
import Dropdown from './components/Dropdown.vue';
import DropdownItem from './components/DropdownItem.vue';
import DropdownChild from './components/DropdownChild.vue';
import Tooltip from './components/Tooltip.vue';
</script>

<template>
    <div class="font-bold text-red-700 p-20 flex flex-column gap-36">
        <div class="flex flex-row flex-wrap gap-8">
            <template v-for="x in 20" key="x">
                <Tooltip
                    :text="`Tooltip content for the test button of which is a button of ${x}`"
                >
                    <template #reference
                        ><button
                            class="px-4 py-2 rounded bg-green-600 text-white"
                        >
                            {{ `Tootlip ${x}` }}
                        </button></template
                    >
                </Tooltip>
            </template>
        </div>
        <Dropdown>
            <template #reference>
                <button class="px-4 py-2 rounded bg-green-600 text-white">
                    Test button
                </button>
            </template>

            <div class="bg-white rounded min-w-[280px] py-1">
                <DropdownItem v-for="x in 6" :key="x">
                    {{ `Item ${x}` }}
                </DropdownItem>

                <DropdownChild trigger="click">
                    <template #reference>
                        <div>Item child 1</div>
                    </template>

                    <div class="bg-white rounded min-w-[280px] py-1">
                        <DropdownItem v-for="y in 2" :key="y">
                            {{ `Item child ${y}` }}
                        </DropdownItem>

                        <DropdownChild>
                            <template #reference>
                                <div>Item child 2</div>
                            </template>

                            <div class="bg-white rounded min-w-[280px] py-1">
                                <DropdownItem v-for="y in 2" :key="y">
                                    {{ `Item child ${y}` }}
                                </DropdownItem>
                            </div>
                        </DropdownChild>

                        <DropdownItem v-for="y in 2" :key="y">
                            {{ `Item child ${y}` }}
                        </DropdownItem>
                    </div>
                </DropdownChild>

                <DropdownItem v-for="x in 2" :key="x">
                    {{ `Item ${x}` }}
                </DropdownItem>
            </div>
        </Dropdown>

        <!-- <Dropdown trigger="click" :offset="[0, 8]" placement="right-start">
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
        </Dropdown> -->
        <!-- <div v-for="x in 100" :key="x">
            <Popup
                ref="test"
                placement="bottom-end"
                arrow
                arrow-class="!bg-gray-900"
                enter-active-class="duration-500 transition-all"
                leave-active-class="duration-500 transition-all"
                enter-from-class="opacity-0 scale-0"
                leave-to-class="opacity-0 scale-0"
            >
                <template #reference>
                    <button
                        :id="`btn-${x}`"
                        class="px-4 py-2 rounded bg-green-600 text-white"
                    >
                        {{ `Button ${x}` }}
                    </button>
                </template>

                <template v-slot="{ hide }">
                    <div class="bg-gray-900 text-white p-4 max-w-[320px]">
                        {{ `Popup content ${x}` }}
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Ad odio reiciendis animi deleniti excepturi,
                        tempora corporis maiores nesciunt porro inventore harum
                        ab amet obcaecati soluta iusto assumenda dicta labore
                        modi. Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Ad odio reiciendis animi deleniti
                        excepturi, tempora corporis maiores nesciunt porro
                        inventore harum ab amet obcaecati soluta iusto assumenda
                        dicta labore modi.
                        <button
                            class="bg-white text-green-600 px-2 px-1"
                            @click="hide"
                        >
                            Hide
                        </button>
                    </div>
                </template>
            </Popup>
        </div>
        <button @click="a = !a">xv</button> -->
        <!-- <Popup ref="popup1" trigger="click" placement="right-start">
            <div
                class="px-4 py-2 bg-emerald-600 text-white flex items-center justify-center w-max"
            >
                Hello
            </div>

            <template #popper="{ hide }">
                <div class="bg-gray-900 text-white p-4 max-w-[320px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatum eaque blanditiis veritatis harum adipisci quasi
                    quas sint quae, eveniet molestias beatae iure sed rerum
                    obcaecati excepturi minus laboriosam animi. Temporibus.
                    <button @click="hide">hide</button>
                </div>
            </template>
        </Popup>

        <Popup trigger="focus" placement="right-start">
            <input placeholder="hello" />

            <template #popper>
                <div class="bg-gray-900 text-white p-4 max-w-[320px]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatum eaque blanditiis veritatis harum adipisci quasi
                    quas sint quae, eveniet molestias beatae iure sed rerum
                    obcaecati excepturi minus laboriosam animi. Temporibus.
                </div>
            </template>
        </Popup>

        <Popup>
            <template #popper>
                <div class="bg-gray-900 text-white p-4">I am still here</div>
            </template>
        </Popup>

        <button @click="bc">Another one</button> -->
    </div>
</template>
