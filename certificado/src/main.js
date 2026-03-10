import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el enrutador configurado
import './styles/main.scss'; // Importa los estilos globales

const app = createApp(App);
app.use(router); // Registra el enrutador en la aplicación
app.mount('#app');
