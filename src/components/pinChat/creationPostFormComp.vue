<template>
    <v-dialog 
    class="dialog-comp"
    :model-value="props.isShow"
    >
        <!-- ФОРМА СОЗДАНИЯ ПОСТА -->
        <v-card class="creation-from-post">
            <!-- Секция заголовка -->
            <section class="creation-form-post__section title">
                <v-card-title class="creation-form-post__title">Creating a post</v-card-title>
                <!-- Заголовок статьи -->
                <v-text-field
                variant="filled"
                density="comfortable"
                label="Title"
                hide-details
                ></v-text-field>
            </section>

            <!-- Секция для добавления тегов поиска -->
            <section class="creation-form-post__section tags">
                <v-card-title class="content__title">Tags to search</v-card-title>

                <!-- Контейнер отрисовки тегов поиска -->
                <div class="tag-list-wrapper">
                    <v-card-subtitle v-show="!tags.length">
                        Здесь будут отображаться теги
                    </v-card-subtitle>
                    <v-chip
                    class="tag"
                    v-for="tag in tags" 
                    closable
                    @click:close="handlerCloseTag(tag)"
                    :key="tag">
                        {{ tag }}
                    </v-chip>
                </div>

                <!-- Добавить слово -->
                <v-text-field
                variant="filled"
                density="compact"
                placeholder="Tags"
                :error="isErrorTag"
                :error-messages="errorTagName"
                >
                    <template v-slot:append-inner>
                        <v-btn 
                        icon="mdi-send"
                        variant="flat"
                        style="background: rgba(0,0,0,0);"
                        @click="handlerAppendTag"
                        ></v-btn>
                    </template>
                </v-text-field>
            </section>

           <!-- Секция Для добавления файлов -->
           <section class="creation-form-post__section file">
                <v-card-title class="content__title">Files</v-card-title>
                <v-file-input 
                label="Files"
                variant="filled"
                density="comfortable"
                clearable 
                chips
                multiple
                hide-details
                ></v-file-input>
            </section>

            <!-- Секция контента -->
            <section 
            class="creation-form-post__section content"
            >
                <v-card-title class="content__title">Text Content</v-card-title>
                <!-- Контент -->
                <v-textarea
                class="content-input"
                variant="filled"
                density="comfortable"
                label="Text content"
                hide-details
                auto-grow
                ></v-textarea>
            </section>

            <!-- Секция кнопок взаимодействия -->
            <section class="creation-form-post__section actions">
                <v-btn
                class="btn-confirm"
                block
                variant="flat"
                >Confirm</v-btn>
            </section>

        </v-card>
    </v-dialog>
</template>

<script setup>
import useMainStore from '@/store/mainStore';
import { ref, defineProps } from 'vue';

const mainStore = useMainStore();
mainStore

const props = defineProps({
    isShow: {
        type: Boolean,
        required: true,
    }
});

const tagValue = ref('');
const tags = ref(['one', 'two']);
const isErrorTag = ref(false);
const errorTagName = ref('');

// =====================================  METHODS  ==================================

function declareErrorTag(msg, duration) {
    try {
        isErrorTag.value = true;
        errorTagName.value = msg;
        setTimeout(() => {
            isErrorTag.value = false;
            errorTagName.value = '';
        }, duration);
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: declareErrorTag  => ${err}`);
    }
}

function handlerCloseTag(tag) {
    try {
        tags.value = tags.value.filter((element) => element !== tag);
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: handlerCloseTag  => ${err}`);
    }
}

function handlerAppendTag() {
    try {
        if(tagValue.value) {
            tags.value.push(tagValue.value);
            
        } else {
            declareErrorTag('Specify the tag name', 3000);
        }
    } catch (err) {
        throw new Error(`components/pinChat/creationPostFormComp: handlerAppendTag  => ${err}`);
    }
}

</script>

<style scoped>
.dialog-comp {
    z-index: 99999999 !important;
}
.creation-from-post {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-around;
    width: 50%;
    height: 80vh;
    margin: auto;
}
.creation-form-post__section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    padding: 1rem 2rem;
    /* border-top: var(--section-border); */
    /* border-bottom: var(--section-border); */
}
.content {
    max-height: 45%;
    overflow: auto;

}
.content__title {
    font-size: 1.1rem;
    align-self: center;
}
.creation-form-post__title {
    align-self: center;
    font-size: 1.5rem;
    font-weight: bolder;
}
.tag-list-wrapper {
    display: flex;
    align-items: center;
    border-top: var(--section-border);
    border-bottom: var(--section-border);
    padding: 0.3rem;
    min-height: 50px;
    margin-bottom: 0.4rem;

}
.tag {
    margin-left: 0.3rem;
    margin-top: 0.1rem;
}
.content-input {
}
.btn-confirm {
    background-color: var(--btn-bg);
    color: var(--btn-fg);
}
</style>