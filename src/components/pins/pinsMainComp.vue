<template>
    <div class="pins-main">
        <div v-show="!pins.length" class="pins-main__header">
            <h1 class="header-title">No Pins</h1>
        </div>
        <div class="pin-container" v-for="item in pins" :key="item">
            Item number #{{ item }}
        </div>

        <!-- + -->
        <v-btn class="btn-create" color="var(--primary-bg)" icon="mdi-plus"></v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// =======================================  DATA  =================================
const pins = ref([
    // 'hello',
    // 'example1',
    // 'example2'
]);


// =======================================  METHODS  =================================

</script>

<style scoped>
.pins-main {
    position: relative;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    font-family: var(--font);
}

.pins-main__header {
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    height: 100%;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;

}
.header-title {
    font-family: var(--font);
    font-weight: 400;
}
.pin-container {
    width: 100%;
    height: 100px;
    border: 1px solid black;
}
.btn-create {
    color: rgb(69, 172, 69);
    position: absolute;
    left: 3%;
    bottom: 0%;
}
</style>