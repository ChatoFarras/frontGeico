<template>

  <div class="full-cont">
  
  <!-- Contenido principal -->
    <div class="main-cont">
    <!-- Barra superior -->
    <div class="header">
      <h1 class="text-2xl">Capturador Electronico Geico </h1>
        <span v-if="user" class="user-info">👤 {{ user }}</span>
        <button v-if="!user"  @click="login" class="login-button">Login</button>
    </div>
  
  <!-- Contenido de la página -->
  <div class="content">
    <div class="invoice-form">
      <h1 class="text-2xl font-bold mb-4">Formulario de Factura</h1>
  
      <!-- Mensaje De Enviado con exito-->
      <div v-if="formSubmitted">
      <h2>✅ Información cargada con éxito</h2>
      <button @click="resetForm">Nueva factura</button>
      </div>
  
  
      <form @submit.prevent="handleSubmit">
      <div v-if="!formSubmitted">
  
  
        
        <h2 class="text-xl font-bold mb-2">Datos del Cliente</h2>
        <div class="mb-4">
          <label for="nit" class="block font-semibold">NIT</label>
          <input type="text" id="nit" v-model="formData.nit" @blur="fetchClientData" class="border rounded px-2 py-1 w-full" required />
        </div>
  
        <!-- Mostrar la razón social si el cliente existe -->
          <div v-if="clientDataFound" class="mb-4">
            <p class="font-semibold text-green-600">Cliente existente: {{formData.razonSocial }}</p>
          </div>
          <div v-if="clientDataFound" class="mb-4">
            <p class="font-semibold text-green-600">Correo: {{formData.correo }}</p>
          </div>
          <div v-if="clientDataFound" class="mb-4">
            <p class="font-semibold text-green-600">Teléfono: {{formData.telefono }}</p>
          </div>
          <div v-if="clientDataFound" class="mb-4">
            <p class="font-semibold text-green-600">Dirección: {{formData.direccion }}</p>
          </div>
          <div v-if="clientDataFound" class="mb-4">
            <p class="font-semibold text-green-600">Ciudad: {{formData.ciudad }}</p>
          </div>
        <!-- Sección de Datos del Cliente -->  
         <div v-if="!clientDataFound" class="mb-4">
          <label for="razonSocial" class="block font-semibold">Razón Social</label>
          <input type="text" id="razonSocial" v-model="formData.razonSocial" class="border rounded px-2 py-1 w-full" required />
        </div>
        <div v-if="!clientDataFound" class="mb-4">
          <label for="correo" class="block font-semibold">Correo</label>
          <input type="email" id="correo" v-model="formData.correo" class="border rounded px-2 py-1 w-full"  />
        </div>
        <div v-if="!clientDataFound" class="mb-4">
          <label for="telefono" class="block font-semibold">Teléfono</label>
          <input type="text" id="telefono" v-model="formData.telefono" class="border rounded px-2 py-1 w-full" />
        </div>
        <div v-if="!clientDataFound" class="mb-4">
          <label for="direccion" class="block font-semibold">Dirección</label>
          <input type="text" id="direccion" v-model="formData.direccion" class="border rounded px-2 py-1 w-full" required />
        </div>
        <div v-if="!clientDataFound" class="mb-4">
          <label for="ciudad" class="block font-semibold">Ciudad</label>
          <input type="text" id="ciudad" v-model="formData.ciudad" class="border rounded px-2 py-1 w-full" required style="text-transform: uppercase;"/>
        </div>
      <!-- Sección de Información de la Factura -->
        <h2 class="text-xl font-bold mb-2">Información de la Factura</h2>
        <div class="mb-4">
          <label for="fecha" class="block font-semibold">Fecha</label>
          <input type="date" id="fecha" 
          :min="minDate" 
          :max="maxDate"
           
          v-model="formData.fecha" class="border rounded px-2 py-1 w-full" required />
        </div>
        <div class="mb-4">
          <label for="detalle" class="block font-semibold">Detalle</label>
          <textarea id="detalle" v-model="formData.detalle" class="border rounded px-2 py-1 w-full" required></textarea>
        </div>
        <div class="mb-4">
          <label for="numeroFactura" class="block font-semibold">Número de Factura</label>
          <input type="text" id="numeroFactura" v-model="formData.numeroFactura" class="border rounded px-2 py-1 w-full" required />
        </div>
  
        <!-- Sección de Valores -->
        <h2 class="text-xl font-bold mb-2">Valores</h2>
        <div class="mb-4">
          <label for="valorAntesIva" class="block font-semibold">SUBTOTAL</label>
          <input  type="number" id="valorAntesIva" v-model="formData.valorAntesIva" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" required step="0.01" />
        </div>
        <div class="mb-4">
          <label for="descuento" class="block font-semibold">Descuento</label>
          <input type="number" id="descuento" v-model="formData.descuento" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01" />
        </div>
        <div class="mb-4">
          <label for="otrosValores" class="block font-semibold">Otros Valores (Propinas, etc)</label>
          <input  type="number" id="otrosValores" v-model="formData.otrosValores" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" required step="0.01" />
        </div>
  
        <div class="iva-container">
    <div class="iva-card" v-for="(iva, index) in ivaEntries" :key="index">
      <div class="iva-card-header">
        <h3 class="iva-title">IVA {{ index + 1 }}</h3>
        <div class="iva-actions">
          <button @click="addIvaEntry" type="button" class="iva-button iva-button-add">
            <span class="button-icon">+</span>
          </button>
          <button v-if="index !== 0" @click="removeIvaEntry(index)" type="button" class="iva-button iva-button-remove">
            <span class="button-icon">−</span>
          </button>
        </div>
      </div>
      
      <div class="iva-card-content">
        <div class="iva-form-group">
          <label class="iva-label">Tasa IVA:</label>
          <select 
            v-model="iva.taxRate" 
            @change="updateIvaCalculation(index)" 
            :disabled="formData.flag" 
            class="iva-select"
          >
            <option value="19">19%</option>
            <option value="5">5%</option>
          </select>
        </div>
  
        <!-- Selección Base o Valor -->
        <div class="iva-form-group toggle-group" v-if="iva.taxRate">
          <div class="toggle-container">
            <input
              type="checkbox"
              :id="'toggle-' + index"
              class="toggle-input"
              v-model="iva.type"
              :disabled="formData.flag"
              @change="updateIvaCalculation(index)"
            />
            <label :for="'toggle-' + index" class="toggle-label">
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <span class="toggle-text">{{ iva.type ? 'Valor' : 'Base' }}</span>
          </div>
        </div>
  
        <!-- Base IVA -->
        <div class="iva-form-group" v-if="iva.taxRate">
          <label :for="'base-iva-' + index" class="iva-label">
            Base IVA ({{iva.taxRate}}%):
          </label>
          <div class="iva-input-wrapper">
            <input
              :id="'base-iva-' + index"
              type="number"
              class="iva-input"
              v-model="iva.base"
              step="0.01"
              :disabled="iva.type || formData.flag"
              @input="updateIvaCalculation(index)"
            />
            
          </div>
        </div>
  
        <!-- Input para Opción Valor -->
        <div class="iva-form-group" v-if="iva.taxRate">
          <label :for="'valor-iva-' + index" class="iva-label">
            Valor IVA:
          </label>
          <div class="iva-input-wrapper">
            <input
              :id="'valor-iva-' + index"
              type="number"
              class="iva-input"
              v-model="iva.valor"
              step="0.01"
              :disabled="!iva.type || formData.flag"
              @input="updateIvaCalculation(index)"
            />
            
          </div>
        </div>
      </div>
    </div>
  </div>    
  
  
  <!-- Sección de Otros Impuestos -->
  <h2 class="text-xl font-bold mb-2">Otros Impuestos</h2>
        <div class="mb-4">
          <label for="valorBaseOtrosImpuestos" class="block font-semibold">Valor Base Otros Impuestos</label>
          <input type="number" id="valorBaseOtrosImpuestos" v-model="formData.valorBaseOtrosImpuestos" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01" />
        </div>
        <div class="mb-4">
          <label for="valorOtrosImpuestos" class="block font-semibold">Valor Otros Impuestos</label>
          <input type="number" id="valorOtrosImpuestos" v-model="formData.valorOtrosImpuestos" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01" />
        </div>
  
       
    <!-- Sección de Retenciones -->
    <h2 class="text-xl font-bold mb-2">Retenciones</h2>
        <div class="mb-4">
          <label for="retefuente" class="block font-semibold">Retefuente</label>
          <input type="number" id="retefuente" v-model="formData.retefuente" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01" />
        </div>
        <div class="mb-4">
          <label for="reteICA" class="block font-semibold">ReteICA</label>
          <input type="number"  id="reteICA" v-model="formData.reteICA" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01"/>
        </div>
        <div class="mb-4">
          <label for="reteIVA" class="block font-semibold">ReteIVA</label>
          <input type="number" id="reteIVA" v-model="formData.reteIVA" :disabled="formData.flag" class="border rounded px-2 py-1 w-full" step="0.01" />
        </div>
  
        <!-- Checkbox de Flag -->
        <div class="mb-4">
          <label>
            <input type="checkbox" v-model="formData.flag" /> Marcar para revision
          </label>
        </div>
  
        <div class="mb-4">
          <h2>Total: {{ formatCurrency(total) }}</h2>
        </div>
  
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        
      </div>
      </form>
    </div>
    <!-- Toggle button -->
    <div class="toggle-floating-panel" @click="togglePanel">⋮</div>
    <div class="floating-div" :class="{ 'minimized': isMinimized }"
    @click="expandIfMinimized">
      <div class="mb-4">
          <h3>Nit: {{ formData.nit }}</h3>
      </div>
      <div class="mb-4">
          <h3>Factura Número: {{ formData.numeroFactura}}</h3>
      </div>
      <div class="mb-4">
          <h4>Subtotal: {{ formatCurrency(formData.valorAntesIva) }}</h4>
      </div>
      
      <div class="mb-4">
          <h4>Total Base 19%: {{ formatCurrency(totalBase19) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Total Base 5%: {{ formatCurrency(totalBase5) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Total IVA 19%: {{ formatCurrency(totalIva19) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Total IVA 5%: {{ formatCurrency(totalIva5) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Total IVA: {{ formatCurrency(totalIva) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Otros Impuestos: {{ formatCurrency(formData.valorOtrosImpuestos) }}</h4>
      </div>
      <div class="mb-4">
          <h4>Retefuente: {{ formatCurrency(formData.retefuente) }}</h4>
      </div>
      <div class="mb-4">
          <h4>ReteIVA: {{ formatCurrency(formData.reteIVA) }}</h4>
      </div>
      <div class="mb-4">
          <h4>ReteICA: {{ formatCurrency(formData.reteICA) }}</h4>
      </div>
      <div class="mb-4">
          <h2>Total: {{ formatCurrency(total) }}</h2>
        </div>
  </div>
  </div>
  
  
  </div>
  <!-- Barra de control lateral -->
  <aside class="lateral">
    <h2 class="menu">{{ optionData}}</h2>
    <nav class="barra">
    <button @click="goToHome" class="menu-item">📄 Inicio</button>
    <button @click="goToFacturas" class="menu-item">📜 Ver Factura</button>
    <button @click="goToInformes"class="menu-item">📝 Generar Informe</button>
  </nav>
  </aside>
  </div>
  
  
  
  
  
    
  
  </template>
  
  <script>
  import axios from 'axios'; 
  
  
  export default {
    name: 'FloatingPanel',
    data() {
      return {
        
        formData: {
          nit: "",
          razonSocial: "",
          correo: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          fecha: "",
          detalle: "",
          numeroFactura: "",
          valorAntesIva: 0,
          otrosValores:0,
          baseIva19: 0,
          baseIva5: 0,
          valorIva19: 0,
          valorIva5: 0,
          valorIva: 0,
          valorBaseOtrosImpuestos: 0,
          valorOtrosImpuestos: 0,
          retefuente: 0,
          reteICA: 0,
          reteIVA: 0,
          descuento: 0,
          flag: false,
        },
        clientDataFound: false,
        formSubmitted: false,
        isMinimized: false,
        minDate: '',
        maxDate: '',
        dateError: '',
        ivaEntries: [
          { taxRate: "19", type: false, base: 0, valor: 0 }
        ]
      };
    },
    created() {
        // Configurar las fechas mínimas y máximas
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const lastYear = currentYear - 3;
        
        // Formato YYYY-MM-DD para los atributos min y max
        this.minDate = `${lastYear}-01-01`;
        this.maxDate = `${currentYear}-12-31`;
    },
    computed: {
      total() {
        // Asegúrate de convertir todos los valores a números
        const valorAntesIva = parseFloat(this.formData.valorAntesIva) || 0;
        const valorOtrosImpuestos = parseFloat(this.formData.valorOtrosImpuestos) || 0;
        const retefuente = parseFloat(this.formData.retefuente) || 0;
        const reteICA = parseFloat(this.formData.reteICA) || 0;
        const reteIVA = parseFloat(this.formData.reteIVA) || 0;
        const descuento = parseFloat(this.formData.descuento) || 0;
        const otrosValores = parseFloat(this.formData.otrosValores) || 0;
  
        return (
          (valorAntesIva +
          this.totalIva + otrosValores +
          valorOtrosImpuestos) -
          (retefuente + reteICA + reteIVA + descuento)
        ).toFixed(2); // Asegúrate de que el total tenga dos decimales
      },
      totalIva() {
        return this.totalIva19 + this.totalIva5;
      },
      totalIva19() {
        return this.ivaEntries.reduce((total, iva) => {
          if (iva.taxRate === "19") {
            return total + (parseFloat(iva.valor) || 0);
          }
          return total;
        }, 0);
      },
      totalIva5() {
        return this.ivaEntries.reduce((total, iva) => {
          if (iva.taxRate === "5") {
            return total + (parseFloat(iva.valor) || 0);
          }
          return total;
        }, 0);
      },
      totalBase19() {
        return this.ivaEntries.reduce((total, iva) => {
          if (iva.taxRate === "19") {
            return total + (parseFloat(iva.base) || 0);
          }
          return total;
        }, 0);
      },
      totalBase5() {
        return this.ivaEntries.reduce((total, iva) => {
          if (iva.taxRate === "5") {
            return total + (parseFloat(iva.base) || 0);
          }
          return total;
        }, 0);
      },
      optionData() {
        return this.$route.query.empresa;
      }
    },
    methods: {
      togglePanel() {
        this.isMinimized = !this.isMinimized;
      },
      expandIfMinimized() {
        if (this.isMinimized) {
          this.isMinimized = false;
        }
      },
      goToHome() {
        this.$router.push({ path: '/menu',  query: { empresa:this.optionData } });
      },
      goToFacturas() {
        this.$router.push({ path: '/facturas',  query: {empresa: this.optionData } });
      },
      goToInformes() {
        this.$router.push({ path: '/informes',  query: { empresa: this.optionData } });
      },
      addIvaEntry() {
        this.ivaEntries.push({ taxRate: "19", type: false, base: 0, valor: 0 });
      },
      removeIvaEntry(index) {
        this.ivaEntries.splice(index, 1);
      },
  
      async fetchClientData() {
          //Busqueda de cliente
  
        if (!this.formData.nit) {
            this.clientDataFound = false;
            return;
          }
          try {
          // Llamada al backend para buscar los datos del cliente
          const response = await axios.get(`http://127.0.0.1:8000/cliente/${this.formData.nit}`);
          console.log("Respuesta del servidor:", response);
  
          if (response.data && response.data.datos) {
              // Rellenar los datos del cliente en el formulario
              this.formData.razonSocial = response.data.datos.RazonSocial;
              this.formData.correo = response.data.datos.Correo;
              this.formData.telefono = response.data.datos.Telefono;
              this.formData.direccion = response.data.datos.Direccion;
              this.formData.ciudad = response.data.datos.Ciudad;
  
              this.clientDataFound = true; // Cliente encontrado
              //alert("Cliente existente: Los datos se han cargado correctamente.");
          }
      } catch (error) {
        console.log("Error response:", error.response);
          if (error.response.status === 404) {
              // Cliente no encontrado, limpiar campos relacionados
              this.formData.razonSocial = "";
              this.formData.correo = "";
              this.formData.telefono = "";
              this.formData.direccion = "";
              this.formData.ciudad = "";
  
              this.clientDataFound = false; // Cliente no encontrado
              alert(error.response.data.detail); // Muestra el mensaje específico del backend
          } else {
            
              console.error("Error al consultar el cliente:", error);
              alert("Hubo un problema al consultar el cliente.");
          }
      }
    
    },
  
      updateIvaCalculation(index) {
        const iva = this.ivaEntries[index];
        const taxRate = parseFloat(iva.taxRate) / 100;
  
        if (!iva.type) {
          // Si el tipo es Base, calcular el valor del IVA
          if (iva.base) {
            iva.valor = (parseFloat(iva.base) * taxRate).toFixed(2);
          }
        } else {
          // Si el tipo es Valor, calcular la base
          if (iva.valor) {
            iva.base = (parseFloat(iva.valor) / taxRate).toFixed(2);
          }
        }
  
        // Actualizar los totales para enviar al backend
        this.formData.baseIva19 = this.totalBase19;
        this.formData.baseIva5 = this.totalBase5;
        this.formData.valorIva19 = this.totalIva19;
        this.formData.valorIva5 = this.totalIva5;
      },
  
      async handleSubmit() {
      // Desestructurar formData para mayor claridad
      if (!this.validateDate()) {
        return;
      }
      
      // Actualizar los valores de IVA para enviar al backend
      this.formData.baseIva19 = this.totalBase19;
      this.formData.baseIva5 = this.totalBase5;
      this.formData.valorIva19 = this.totalIva19;
      this.formData.valorIva5 = this.totalIva5;
      this.formData.valorIva = this.totalIva;
      const { 
          retefuente = 0, 
          reteICA = 0, 
          reteIVA = 0, 
          descuento = 0,  
          otrosValores = 0,
          
          valorOtrosImpuestos = 0, 
          valorAntesIva = 0, 
          flag = false,
      } = this.formData;
  
      // Calcular los valores necesarios para la validación
      const total = parseFloat(this.total) || 0;
      const subtotal = parseFloat(valorAntesIva) || 0;
      const valorIva = parseFloat(this.totalIva) || 0;
  
      // Confirmar con el usuario
      const confirmation = confirm(`¿Está seguro de que el total es ${this.formatCurrency(total)}?`);
  
      if (!confirmation) {
          alert("El envío del formulario ha sido cancelado.");
          return;
      }
  
      // Función para enviar el formulario
      const sendForm = async () => {
          try {
            const payload = {
                  empresa: this.optionData,
                  ...this.formData
              };
              console.log(payload);
              const response = await axios.post("http://127.0.0.1:8000/guardar-factura", payload);
              if (response.status === 200) {
                  this.formSubmitted = true;
                  // Muestra la pantalla de éxito
              }
          } catch (error) {
              console.error("Error al enviar el formulario:", error);
              alert("Hubo un error al enviar el formulario");
          }
      };
  
      // Validar y enviar
      if (flag) {
          // Si el checkbox está marcado, enviar sin validar
          await sendForm();
      } else {
          // Verificar la condición
          const diferencia = Math.abs((total + parseFloat(retefuente) + parseFloat(reteICA) + parseFloat(reteIVA) + parseFloat(descuento)) - (subtotal + parseFloat(otrosValores) + parseFloat(valorIva) + parseFloat(valorOtrosImpuestos)));
          const isValid = diferencia >= 0 && diferencia <= 1 ;
  
          if (isValid) {
              alert("Los datos son correctos.");
              await sendForm();
          } else {
              alert("Los datos son incorrectos. Verifique los valores.");
          }
      }
    },
    
    validateDate() {
      if (!this.formData.fecha) return false;
        
        const selectedDate = new Date(this.formData.fecha);
        const selectedYear = selectedDate.getFullYear();
        const currentYear = new Date().getFullYear();
        
        if (selectedYear < currentYear - 3 || selectedYear > currentYear) {
          this.dateError = `Año fuera de rango. Solo se permite ${currentYear-3} o ${currentYear}.`;
          return false;
        } else {
          this.dateError = '';
          return true;
        }
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      },
      resetForm() {
          this.formData = {
            nit: "",
            razonSocial: "",
            correo: "",
            telefono: "",
            direccion: "",
            ciudad: "",
            fecha: "",
            detalle: "",
            numeroFactura: "",
            valorAntesIva: 0,
            iva19: true, 
            iva5: false,
            baseIva19: 0,
            baseIva5: 0,
            base19IvaNoEspecificada: false,
            baseIva: 0,
            valorIva: 0,
            valorBaseOtrosImpuestos: 0,
            valorOtrosImpuestos: 0,
            retefuente: 0,
            reteICA: 0,
            reteIVA: 0,
            descuento: 0,
            otrosValores: 0,
            flag: false,
          };
          this.ivaEntries = [
            { taxRate: "19", type: false, base: 0, valor: 0 }
          ];
          this.formSubmitted = false;
          this.clientDataFound = false;
           // Vuelve a establecer el estado
      },
    }
    
  };
  </script>

<style>
/* Importación de fuentes */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

/* Variables de colores y estilos generales */
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  --secondary: #475569;
  --accent: #16a34a;
  --danger: #dc2626;
  --warning: #f59e0b;
  --success: #16a34a;
  --text-dark: #1e293b;
  --text-light: #64748b;
  --background: #f8fafc;
  --border: #e2e8f0;
  --card-bg: #ffffff;
  --header-bg: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --transition: all 0.3s ease;
}

/* Estilos base */
body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--background);
  color: var(--text-dark);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* Layout principal */
.full-cont {
  display: flex;
  min-height: 100vh;
}

.main-cont {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16rem; /* Espacio para el menú lateral */
  margin-right: 16rem; /* Espacio para el panel flotante */
  width: calc(100% - 32rem); /* Ancho ajustado a los márgenes */
  transition: var(--transition);
}

.content {
  padding: 1.5rem;
  margin-top: 5rem; /* Espacio para la barra superior */
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--header-bg);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
}

.header h1 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.login-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Menu lateral */
.lateral {
  width: 16rem;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding-top: 5rem; /* Espacio para el header */
  box-shadow: var(--shadow-lg);
  z-index: 10;
  transition: var(--transition);
}

.menu {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0;
  text-align: center;
  padding: 0 1rem 1rem;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.barra {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin-top: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  transition: var(--transition);
  text-decoration: none;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.menu-item:hover {
  background-color: var(--primary);
  transform: translateY(-2px);
}

/* Formulario Principal */
.invoice-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
}

.invoice-form h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary-dark);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1.25rem;
}

.mb-6 {
  margin-bottom: 2rem;
}

/* Secciones */
h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-dark);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
}

/* Labels e inputs */
label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.block {
  display: block;
}

.font-semibold {
  font-weight: 600;
}

input[type="text"],
input[type="email"],
input[type="number"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: white;
  transition: var(--transition);
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: var(--text-dark);
}

input:focus,
textarea:focus,
select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

input:disabled,
textarea:disabled,
select:disabled {
  background-color: #f1f5f9;
  color: var(--text-light);
  cursor: not-allowed;
}

/* Estilo para cliente existente */
.text-green-600 {
  color: var(--success);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(22, 163, 74, 0.1);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--success);
}

.text-green-600::before {
  content: "✓";
  font-weight: bold;
  color: var(--success);
}

/* Botones */
button {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}

button[type="submit"] {
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button[type="submit"]:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

button[type="button"] {
  background-color: var(--secondary);
  color: white;
}

button[type="button"]:hover {
  background-color: #334155;
}

/* Checkbox personalizado */
input[type="checkbox"] {
  margin-right: 0.5rem;
  cursor: pointer;
}

/* Éxito del formulario */
div[v-if="formSubmitted"] {
  text-align: center;
  padding: 2rem;
  background-color: rgba(22, 163, 74, 0.1);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

div[v-if="formSubmitted"] h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  color: var(--success);
  margin-bottom: 1.5rem;
  border: none;
}

div[v-if="formSubmitted"] button {
  background-color: var(--primary);
  color: white;
}

/* Panel flotante */
.floating-div {
  position: fixed;
  top: 5.5rem;
  right: 1.5rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 300px;
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  border: 1px solid var(--border);
  z-index: 900;
  transition: var(--transition);
}

.floating-div h2,
.floating-div h3,
.floating-div h4 {
  margin: 0.5rem 0;
  font-family: 'Montserrat', sans-serif;
}

.floating-div h2 {
  font-size: 1.25rem;
  color: var(--primary-dark);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.floating-div h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
}

.floating-div h4 {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
}

/* IVA Cards */
.iva-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin: 1.5rem 0;
}

.iva-card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: var(--transition);
}

.iva-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.iva-card-header {
  background: var(--header-bg);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.iva-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
}

.iva-card-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.iva-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.iva-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-light);
}

.iva-select {
  padding: 0.75rem;
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: #f8fafc;
  transition: var(--transition);
  font-family: 'Poppins', sans-serif;
  color: var(--text-dark);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.iva-select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.iva-select:disabled {
  background-color: #f1f5f9;
  color: var(--text-light);
  cursor: not-allowed;
}

.iva-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.iva-input {
  padding: 0.75rem;
  padding-left: 1.75rem;
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: #f8fafc;
  transition: var(--transition);
  font-family: 'Poppins', sans-serif;
  color: var(--text-dark);
  width: 100%;
}

.iva-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.iva-input:disabled {
  background-color: #f1f5f9;
  color: var(--text-light);
  cursor: not-allowed;
}

.iva-currency {
  position: absolute;
  left: 0.75rem;
  color: var(--text-light);
  font-weight: 500;
}

/* Toggle switch */
.toggle-group {
  display: flex;
  align-items: center;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-input {
  display: none;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 26px;
  cursor: pointer;
}

.toggle-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--text-light);
  border-radius: 34px;
  transition: var(--transition);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-label .toggle-track {
  background-color: var(--primary);
}

.toggle-input:checked + .toggle-label .toggle-thumb {
  transform: translateX(26px);
}

.toggle-input:disabled + .toggle-label {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-light);
  min-width: 40px;
}

/* Botones de agregar/quitar IVA */
.iva-actions {
  display: flex;
  gap: 0.5rem;
}

.iva-button {
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.iva-button-add {
  background-color: var(--success);
  color: white;
}

.iva-button-remove {
  background-color: var(--danger);
  color: white;
}

.iva-button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-sm);
}

.button-icon {
  line-height: 1;
}

/* Botón para mostrar/ocultar el panel flotante en pantallas medianas */
.toggle-floating-panel {
  position: fixed;
  right: 30px;
  bottom: 330px; /* Adjust based on panel height */
  cursor: pointer;
  background-color: #f0f0f0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.toggle-floating-panel:hover {
  background-color: var(--primary-dark);
  transform: scale(1.1);
}

/* Clase para panel flotante minimizado */
.floating-div.minimized {
  width: 40px;
  padding: 0;
  overflow: hidden;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  cursor: pointer;
}

.floating-div.minimized:hover {
  background-color: var(--primary-dark);
  transform: scale(1.1);
}

.floating-div.minimized * {
  display: none;
}

.floating-div.minimized::before {
  content: "+";
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 1500px) {
  .full-cont {
    position: relative;
  }
  
  .main-cont {
    margin-right: 0;
    width: calc(100% - 16rem);
  }
  
  /* Panel flotante en pantallas medianas */
  .floating-div {
    top: 5.5rem;
    right: 1.5rem;
    width: 250px;
    max-height: 60vh;
    font-size: 0.9rem;
    z-index: 950;
    padding: 1rem;
  }
  
  .toggle-floating-panel {
    display: flex;
  }
  
  /* Hacer más compacto el contenido del panel */
  .floating-div h2 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .floating-div h3 {
    font-size: 0.9rem;
  }
  
  .floating-div h4 {
    font-size: 0.8rem;
  }
}

@media (max-width: 1200px) {
  .full-cont {
    flex-direction: column;
  }
  
  .main-cont {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  
  .lateral {
    position: static;
    width: 100%;
    height: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .barra {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .menu-item {
    width: auto;
  }
  
  .content {
    margin-top: 1rem;
    padding: 1rem;
  }
  
  /* Asegurarse de que el menú fijo no afecte el contenido en pantallas medianas */
  .content {
    padding-top: 5rem;
  }
  
  /* Hacer aún más compacto el panel flotante */
  .floating-div {
    max-height: 50vh;
    width: 200px;
  }
}

@media (max-width: 768px) {
  .iva-card-content {
    grid-template-columns: 1fr;
  }
  
  .header {
    padding: 0.75rem 1rem;
  }
  
  .header h1 {
    font-size: 1.25rem;
  }
  
  .invoice-form {
    padding: 1rem;
  }
  
  .menu {
    font-size: 1.1rem;
  }
  
  .barra {
    gap: 0.5rem;
  }
  
  .menu-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  /* Panel flotante aún más compacto en móviles */
  .floating-div {
    max-height: 40vh;
    bottom: 1rem;
    top: auto;
    right: 1rem;
    width: 180px;
    font-size: 0.85rem;
  }
}
</style>