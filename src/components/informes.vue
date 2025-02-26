<template>
  <div class="background">
    <div class="container">
      <h1>Generar Informe para {{ this.optionData }}</h1>
      <form @submit.prevent="generarInforme" class="form">
        <div class="form-group">
          <label for="mes">Selecciona el Mes:</label>
          <select v-model="mes" id="mes" required>
            <option value="" disabled>Selecciona un mes</option>
            <option v-for="(mes, index) in meses" :key="index" :value="index + 1">
              {{ mes }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="año">Selecciona el Año:</label>
          <input v-model="año" id="año" type="number" min="2000" max="2100" required />
        </div>
        <!--<div class="form-group">
          <label for="tipoInforme">Tipo de Informe:</label>
          <select v-model="tipoInforme" id="tipoInforme" required>
            <option value="" disabled>Selecciona un tipo de informe</option>
            <option value="ejecutivo">Informe Ejecutivo</option>
            <option value="contable">Informe Contable</option>
          </select>
        </div>-->
        <button type="submit" class="btn-primary">Generar Informe</button>
      </form>
      <div class="footer">
        <button @click="regresar" class="btn-secondary">Regresar</button>
        <button @click="irAInicio" class="btn-secondary">Inicio</button>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      mes: '',
      error: null,
      año: new Date().getFullYear(), // Año actual por defecto
      meses: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    };
  },
  computed: {
    optionData() {
      return this.$route.query.empresa;
    },
  },
  methods: {
    async generarInforme() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/generar-informe/${this.optionData}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mes: this.mes,
            año: this.año
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `informe_${this.optionData}_${this.mes}_${this.año}.xlsx`; // Nombre del archivo
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          const errorData = await response.json()
          console.error('Error en la petición:', errorData.detail)
          alert(errorData.detail);
        }
      } catch (error) {
        console.error('Error al generar el informe:', error);
        alert(this.error);
      }
    },
    regresar() {
      this.$router.go(-1);
    },
    irAInicio() {
      this.$router.push({ path: '/menu',  query: { empresa:this.optionData } });
    }
  }
};
  </script>
  
  <style scoped>
/* Variables CSS */
:root {
  --primary-color: #007bff;
  --secondary-color: #0056b3;
  --background-color: #e8e8e8;
  --font-color: #343a40;
  --font-family: 'Arial, sans-serif';
}


/* Estilos generales */

.background {
  background-image: url('../../fondo.jpg'); /* Ruta a tu imagen */
  background-size: cover; /* Cubre todo el fondo */
  background-position: center; /* Centra la imagen */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  height: 100vh; /* Asegura que el div ocupe toda la altura de la ventana */
  display: flex; /* Para centrar el contenido */
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
}
.container {
  font-family: var(--font-family);
  max-width: 600px;
  margin: 60px auto;
  padding: 30px;
  background-color: #f0f0f0;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  color: #000000 ;
  position: relative;
  overflow: hidden;
}



h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 30px;
}

/* Estilos para el formulario */
.form {
  display: flex;
  flex-direction: column;
  padding-right: 50px;
 
}

.form-group {
  margin-bottom: 30px;

  position: relative;
  
}

label {
  margin-bottom: 10px;
  
  font-weight: bold;
  color: var(--font-color);
}

select, input {
  width: 100%;
  padding: 15px;
  border: 2px solid var(--secondary-color);
  border-radius: 10px;
  font-size: 16px;
  color: var(--font-color);
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:focus, input:focus {
  border-color: #007bff;;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  outline: none;
}

/* Estilos para los botones */
.btn-primary, .btn-secondary {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: #007bff;;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.btn-secondary {
  background-color: #0056b3;
  color: white;
  margin-right: 10px;
}

.btn-secondary:hover {
  background-color: #004080;
  transform: scale(1.05);
}

/* Estilo para la barra inferior */
.footer {
  position: fixed;
  top: 100; /* Posición en la parte superior */
  left: 0; /* Alineación a la izquierda */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  background-color: #004080;
}
</style>