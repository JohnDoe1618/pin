import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { createPinia } from 'pinia';

// notifications
import notifications from './components/notifications';

const pinia = createPinia();

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Импорт иконок
import * as icons from '@mdi/js';
import { ru } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        locale: 'ru',
        messages: {
            ru
        }
    },
    icons: {
        defaultSet: 'mdi',
        aliases: {
            // Регистрация псевдонимов
            ...aliases,
            account: icons.mdiYoutube,
            medication: icons.mdiMedication,
        },
        sets: {
            mdi,
        },
    },
})

const app = createApp(App);

// Регистрация уведомлений
notifications.forEach((note) => {
    app.component(note.compName, note);
});

app
    .use(router)
    .use(vuetify)
    .use(pinia)
    .mount('#app')
