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

    /* Pin Chat input */
    --chat-input-btn-bg: black;
    --chat-input-btn-fg: white;

    /* Scroll */
    --scroll-bg: black;
    --scroll-fg: white;

    /* Message */
    --message-fg: white;
    --message-bg: black;
    --message-hover: rgba(128, 128, 128, 0.1);
    --font-size: 0.8rem;
    --post-border: 1px solid rgba(255, 255, 255, 0.393);

    /* Notifications */
    --succ-bg: black;
    --succ-fg: greenyellow;
    --err-bg: black;
    --err-fg: rgb(245, 87, 87);

    /* creation post section */
    --section-border: 1px solid rgba(128, 128, 128, 0.448);

    /* Buttons */
    --btn-fg: white;
    --btn-bg: black;
}

#app {
    font-family: var(--font);
}
/* По умолчанию скроллбар в приложении отключен */
::-webkit-scrollbar {
    width: 6px;
    /* ширина скроллбара */
}

::-webkit-scrollbar-thumb {
    background-color: var(--scroll-bg);
    border-radius: 20px;
}

::-webkit-scrollbar-track {
    background-color: var(--scroll-fg);
}
</style>