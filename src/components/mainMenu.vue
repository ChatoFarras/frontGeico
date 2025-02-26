<template>
    
    <div class="full-cont">

        <!-- Contenido principal -->
        <div class="main-cont">
        <!-- Barra superior -->
        <div class="header">
        <h1 class="text-2xl font-semibold">Capturador Electrónico Geico S.A.S</h1>
        <span v-if="user" class="user-info">👤 {{ user }}</span>
        <button v-if="!user"  @click="login" class="login-button">Login</button>
        </div>

        <!-- Contenido de la página -->
        <div class="content">
        <p class="text-xl mb-6 font-medium text-gray-700">Seleccione una opción:</p>
        </div>


        </div>
        <!-- Barra de control lateral -->
        <aside class="lateral">
        <h2 class="menu">{{ empresa }}</h2>
        <nav class="barra">
            <button @click="goToInvoice"  class="menu-item">📄Crear Factura </button>
            <button @click="goToFacturas" class="menu-item">📜 Ver Factura</button>
            <button @click="goToInformes" class="menu-item">📝 Generar Informe</button>
            <button @click="exit" class="menu-item">❌ Salir</button>
        </nav>
        </aside>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      empresa() {
        return this.$route.query.empresa;
      },
      nit() {
        return this.$route.query.nit;
      }
    },
    methods: {
    goToInvoice() {
      this.$router.push({ path: '/invoice',  query: { empresa: this.empresa } });
    },
    goToFacturas() {
      this.$router.push({ path: '/facturas',  query: { empresa: this.empresa } });
    },
    goToInformes() {
      this.$router.push({ path: '/informes',  query: { empresa: this.empresa } });
    },
    exit() {
      this.$router.push('/');
    },
  },
  };
  </script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7fafc; /* Color de fondo general */
  overflow: hidden; 
}

.full-cont{
  display: flex;
  height: 100vh;
}
.lateral{
  width: 16rem;
  display: flex;
  flex-direction: column;
  position: fixed; /* Fija el menú lateral */
  top:100px;
  bottom: 0; /* Alineación al fondo */
  
}
.menu{
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;

}
.barra{
  display: flex;
  flex-direction: column;
  margin-top: 0.75rem;

}

.main-cont{
  display: flex;
  flex-direction: column;

}

.content {
            margin-left: 250px; /* Espacio para el menú lateral */
            margin-top: 60px; /* Espacio para la barra superior */
            padding: 1rem; /* Espaciado interno */
            height: calc(100vh - 60px); /* Altura del contenido principal */
            overflow-y: auto; /* Permite el desplazamiento vertical si es necesario */
        }


.flex {
  display: flex;
}

.h-screen {
  height: 100vh;
}

.w-64 {
  width: 16rem; /* Ancho de la barra lateral */
}

.bg-gray-900 {
  background-color: #1a202c; /* Color de fondo de la barra lateral */
}

.bg-gray-100 {
  background-color: #f7fafc; /* Color de fondo del contenido principal */
}

.header {
  position: fixed;
  top: 0; /* Posición en la parte superior */
  left: 0; /* Alineación a la izquierda */
  width: 100%; /* Ancho completo */
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  background: linear-gradient(to right, #2b6cb0, #2c5282); /* Gradiente de la barra superior */
  color: white;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.menu-item {
margin-bottom: 8px;
  padding: 0.75rem 1.25rem;
  background-color: #4a5568; /* Color de fondo de los enlaces */
  border-radius: 0.5rem; /* Bordes redondeados */
  transition: background-color 0.3s ease;
  text-decoration: none;
  color: white;
}

.menu-item:hover {
  background-color: #4299e1; /* Color de fondo al pasar el mouse */
}

.user-info {
  color: #edf2f7; /* Color del texto gris claro */
}

.login-button {
  background-color: white;
  color: #2b6cb0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #e2e8f0; /* Color de fondo al pasar el mouse */
}

.text-2xl {
  font-size: 1.5rem; /* Tamaño de fuente */
}

.font-bold {
  font-weight: bold; /* Negrita */
}

.font-semibold {
  font-weight: 600; /* Seminegrita */
}

.text-xl {
  font-size: 1.25rem; /* Tamaño de fuente extra grande */
}

.mb-6 {
  margin-bottom: 1.5rem; /* Margen inferior */
 }

.mb-10 {
  margin-bottom: 2.5rem; /* Margen inferior */
}

.flex-1 {
  flex: 1; /* Flexibilidad del contenido principal */
}

.items-center {
  align-items: center; /* Alineación vertical */
}

.justify-between {
  justify-content: space-between; /* Espaciado entre elementos */
}

.text-lg {
  font-size: 1.125rem; /* Tamaño de fuente grande */
}

@media (max-width: 768px) {
  .w-64 {
    width: 100%; /* Ancho completo en pantallas pequeñas */
  }
}
</style>