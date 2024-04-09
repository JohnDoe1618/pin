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
    --primary-bg: black;
    --primary-fg: white;
    --font: "Work Sans", sans-serif;
}

#app {
    font-family: var(--font);
}
</style>