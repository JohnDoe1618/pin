<template>
    <v-layout class="rounded rounded-md">
        <appBarComp />
        <navigationDrawerComp />
        <mainComp />
    </v-layout>
</template>

<script setup>
import navigationDrawerComp from '@/components/navigationDrawer/navigationDrawerComp.vue';
import appBarComp from '@/components/appBar/appBarComp.vue';
import mainComp from '@/components/main/mainComp.vue';

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* COLOR */
    --primary-bg: black;
    --primary-fg: white;
    --font: "Work Sans", sans-serif;
    /* Pin Item */
    --pin-title-fg: rgb(105, 105, 105);
    --pin-title-bg: black;
    --pin-border: 1px dashed rgba(128, 128, 128, 0.724);

    /* Pin Chat */
    --pin-chat-title-fg: white;
    --pin-chat-title-bg: black;
}

#app {
    font-family: var(--font);
}
</style>