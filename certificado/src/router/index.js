import { createRouter, createWebHistory } from 'vue-router'

// Importación dinámica de todos los archivos .vue en la carpeta views
const viewModules = import.meta.glob('../views/**/*.vue')

const routes = Object.keys(viewModules).map((path) => {
    // Extrae el nombre del archivo sin la extensión ni la ruta
    const name = path.split('/').pop().replace('.vue', '')

    // Crea una ruta para cada vista detectada
    return {
        path: name === 'HomeView' ? '/' : `/${name}`,
        name,
        component: viewModules[path]
    }
})

// Redirección opcional: si no hay un HomeView, redirige la raíz a LoginSupervisor
if (!routes.some(r => r.path === '/')) {
    routes.push({
        path: '/',
        redirect: '/LoginSupervisor'
    })
}

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
