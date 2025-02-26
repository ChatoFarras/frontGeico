import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import InvoiceForm from "../components/InvoiceForm.vue";
import FacturasList from "../components/facturasList.vue";
import Informe from "../components/informes.vue";
import Menu from "../components/mainMenu.vue";
import edit from "../components/facturasEdit.vue";


const routes = [
  { path: "/", component: Home },
  { path: "/invoice", component: InvoiceForm },
  { path: "/facturas", component: FacturasList, props: true },
  { path: "/informes", component: Informe },
  { path: "/menu", component: Menu},
  { path: "/edit", component: edit, name: 'edit', props: true},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
