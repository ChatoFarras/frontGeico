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
      <h2 class="menu">Empresas</h2>
      <nav class="barra">
      
        <button  v-for="empresa in empresas" :key="empresa.nit" class="menu-item" @click="irAHojaInicio(empresa)">
          {{ empresa.empresa }}
        </button>
      
      </nav>
    </aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: "Usuario",// Aquí puedes cambiarlo por un sistema de autenticación real
      empresas: []
    };
  },
  async mounted() {
    await this.obtenerEmpresas();  // Llama a la función para obtener las empresas al montar el componente
  },
  methods: {
    login() {
      // Lógica de autenticación aquí
      alert("Función de login aún no implementada");
    },
    async obtenerEmpresas() {
        const response = await fetch('http://127.0.0.1:8000/empresas');
        this.empresas = await response.json();
        console.log('Empresas después de la carga:', this.empresas);
    },
    irAHojaInicio(empresa) {
        this.$router.push({ path: '/menu', query: { empresa: empresa.empresa, nit: empresa.nit } });
    }
  }
    
};
</script>

<style scoped>
.full-cont {
  display: flex;
  height: 100vh;
}

.menu {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.barra {
  display: flex;
  flex-direction: column;
  margin-top: 0.75rem;
}

.main-cont {
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