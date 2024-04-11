<template>
    <v-dialog 
    class="dialog-comp"
    :model-value="props.isShow"
    >
        <v-card class="creation-from-post">
            Hello
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    isShow: {
        type: Boolean,
        required: true,
    }
});

</script>

<style scoped>
.dialog-comp {
    z-index: 99999999 !important;
}
</style>