<script setup lang="ts">
import { Dropdown, DropdownItem, DropdownChild } from './components';
</script>

<template>
    <div class="p-20">
        <div class="w-max">
            <Dropdown :same-width-as-reference="true">
                <template #reference="{ isOpen }">
                    <button
                        class="px-4 py-2 rounded bg-rose-600 text-white flex flex-start justify-between gap-4"
                    >
                        <div>Mutli level dropdown with child</div>
                        <div
                            class="transition duration-300"
                            :class="[isOpen ? 'rotate-180' : '']"
                        >
                            &#x25BC;
                        </div>
                    </button>
                </template>

                <DropdownItem v-for="a in 3" :key="a">
                    {{ `Dropdown ${a}` }}
                </DropdownItem>

                <DropdownChild trigger="click" :offset="[0, 4]">
                    <template #reference>
                        <div>Dropdown children 1</div>
                    </template>

                    <DropdownItem v-for="x in 3" :key="x" class="!pr-20">
                        {{ `Dropdown child item ${x}` }}
                    </DropdownItem>

                    <DropdownChild
                        trigger="click"
                        placement="right-end"
                        :offset="[0, 4]"
                        popup-class="w-[240px]"
                    >
                        <template #reference> Children of Children </template>

                        <DropdownItem>Child Item 1</DropdownItem>

                        <DropdownChild
                            trigger="click"
                            placement="right-start"
                            :offset="[0, 4]"
                        >
                            <template #reference>
                                <div>Show login form</div>
                            </template>

                            <div class="p-4 w-[320px] flex flex-col gap-4">
                                <div class="flex flex-col gap-1">
                                    <label class="font-bold">Email</label>
                                    <input
                                        class="w-full p-2 rounded outline-none ring-2 ring-gray-400 focus:ring-rose-500"
                                    />
                                </div>

                                <div class="flex flex-col gap-1">
                                    <label class="font-bold">Password</label>
                                    <input
                                        class="w-full p-2 rounded outline-none ring-2 ring-gray-400 focus:ring-rose-500"
                                    />
                                </div>

                                <button
                                    class="w-full bg-rose-500 text-white rounded py-2"
                                >
                                    Submit
                                </button>
                            </div>
                        </DropdownChild>

                        <DropdownItem>Child Item 3</DropdownItem>
                    </DropdownChild>

                    <DropdownItem>Dropdown child item 4</DropdownItem>
                </DropdownChild>
            </Dropdown>
        </div>
    </div>
</template>
