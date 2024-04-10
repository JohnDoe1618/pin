<template>
    <div class="pins-main">

        <!-- Уведомление ошибки -->
        <error-note-comp 
        :error-msg="errorMsg"
        ></error-note-comp>

        <!-- Уведомление успеха -->
        <success-note-comp
        @complete="handlerSuccessAnimation"
        ></success-note-comp>

        <!-- Если нет пинов -->
        <div v-show="!mainStore.pins.length" class="pins-main__header">
            <h1 class="header-title">No Pins</h1>
        </div>

        <v-dialog
        v-model="isShowCreationForm"
        >
            <creationPinFormComp 
            @error="(content) => handlerErrorMsg(content)"
            @success="handlerSuccessMsg"
            @close="handlerCloseForm"
            />
        </v-dialog>

        <!-- Отрисовка пинов -->
        <pinItemComp 
        v-for="item in mainStore.pins"
        @click="router.push({ name: 'pins-chat', params: { id: item?.id } })"
        :item-data="item"
        :key="item" 
        />

        <!-- + -->
        <v-btn 
        class="btn-create" 
        color="var(--primary-bg)" 
        icon="mdi-plus"
        @click="openCreationForm"
        ></v-btn>
    </div>
</template>

<script setup>
import pinItemComp from './pinItemComp.vue';
import creationPinFormComp from './creationPinFormComp.vue';
import useMainStore from '@/store/mainStore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mainStore = useMainStore();

// =======================================  DATA  =================================
// const isLoadingData = ref(false);
const isShowCreationForm = ref(false);
const errorMsg = ref('');


// =======================================  METHODS  =================================
// Обработчик открытия формы для создания нового пина
function openCreationForm() {
    try {
        isShowCreationForm.value = true;
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: openCreationForm => ${err}`);
    }
}

// Выполняется когда завершается анимация уведомления успеха 
function handlerSuccessAnimation() {
    try {
        if(isShowCreationForm.value === true) {
            // isShowCreationForm.value = false;
        }
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: handlerSuccessAnimation => ${err}`);
    }
}

function handlerCloseForm() {
    try {
        isShowCreationForm.value = false;
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: handlerCloseForm => ${err}`);
    }
}

// Обработчик появления уведомления об успехе
function handlerSuccessMsg() {
    try {
        mainStore.activateSuccessNote(1500);
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: handlerSuccessMsg => ${err}`);
    }
}

// Обработчик появления уведомления об ошибке
function handlerErrorMsg(content) {
    try {
        mainStore.activateErrorNote(2500);
        errorMsg.value = content;
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: handlerErrorMsg => ${err}`);
    }
}

// =======================================  LIFECYCLE HOOKS  =================================
onMounted(() => {
    try {
        document.addEventListener('keydown', (event) => {
            // Открыть окно создание нового пина по нажатию на C
            if(event.key.toLocaleLowerCase() === 'c' || event.key.toLocaleLowerCase() === 'с') {
                isShowCreationForm.value = true;
            }
        })
    } catch (err) {
        throw new Error(`components/pins/pinsMainComp.vue: onMounted => ${err}`);
    }
})

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
    padding: 2rem;
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

}
.header-title {
    font-family: var(--font);
    font-weight: 400;
}

.btn-create {
    color: rgb(69, 172, 69);
    position: absolute;
    left: 3%;
    bottom: 0%;
}
</style>