<template>
    <v-navigation-drawer class="nav-draw" color="black" expand-on-hover rail>
        <v-list>
            <v-list density="compact" nav>
                <v-list-item 
                prepend-icon="mdi-pin-outline" 
                title="Pins" 
                value="pins"
                @click="router.push({name: 'pins'})"
                >
                </v-list-item>
                <v-list-item 
                prepend-icon="mdi-cog-outline" 
                title="Settings" 
                value="settings"
                @click="router.push({name: 'settings'})"
                >
                </v-list-item>
            </v-list>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

</script>
<style scoped>
.nav-draw {
    border-right: 2px solid rgb(201, 87, 87);
}
</style>