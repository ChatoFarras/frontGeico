<template>
  <div>
      <h1>Facturas en {{ this.optionData }}</h1>
      
      <!-- Selector de mes -->
      <div class="filtro-mes">
          <select v-model="mesSeleccionado" @change="filtrarFacturas">
              <option value="">Todos los meses</option>
              <option v-for="mes in meses" :key="mes.numero" :value="mes.numero">
                  {{ mes.nombre }}
              </option>
          </select>
      </div>
  
      <table>
          <thead>
              <tr>
                  <th>NIT</th>
                  <th>Número de Factura</th>
                  <th>Detalle</th>
                  <th>Fecha</th>
                  <th>Subtotal</th>
                  <th>Valor IVA</th>
                  <th>Valor Otros Impuestos</th>
                  <th>Retefuente</th>
                  <th>ReteIVA</th>
                  <th>ReteICA</th>
                  <th>Total a Pagar</th>
                  <th>Necesita Revisión</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="factura in facturasFiltradas" 
                  :key="factura.nit" 
                  :class="factura.necesita_revision ? 'row-red' : 'row-green'">
                  <td>{{ factura.nit }}</td>
                  <td>{{ factura.numero_factura }}</td>
                  <td>{{ factura.detalle }}</td>
                  <td>{{ formatDate(factura.fecha) }}</td>
                  <td>{{ formatCurrency(factura.valor_antes_iva) }}</td>
                  <td>{{ formatCurrency(factura.valor_iva) }}</td>
                  <td>{{ formatCurrency(factura.valor_otros_impuestos) }}</td>
                  <td>{{ formatCurrency(factura.retefuente) }}</td>
                  <td>{{ formatCurrency(factura.reteiva) }}</td>
                  <td>{{ formatCurrency(factura.reteica) }}</td>
                  <td>{{ formatCurrency(factura.total_a_pagar) }}</td>
                  <td>{{ factura.necesita_revision ? 'Sí' : 'No'}}</td>
                  <td>
                      <!--button @click="editarFactura(factura)" class="btn-editar">Editar</button-->
                      <button @click="eliminarFactura(factura.nit, factura.numero_factura)" class="btn-eliminar">Eliminar</button>
                  </td>
              </tr>
          </tbody>
      </table>
  
      <div class="footer">
          <button @click="regresar">Regresar</button>
          <button @click="irAInicio">Generar Informe</button>
      </div>
  </div>
</template>
  
<script>
export default {
    data() {
        return {
            facturas: [],
            meses: [
                { numero: 1, nombre: 'Enero' },
                { numero: 2, nombre: 'Febrero' },
                { numero: 3, nombre: 'Marzo' },
                { numero: 4, nombre: 'Abril' },
                { numero: 5, nombre: 'Mayo' },
                { numero: 6, nombre: 'Junio' },
                { numero: 7, nombre: 'Julio' },
                { numero: 8, nombre: 'Agosto' },
                { numero: 9, nombre: 'Septiembre' },
                { numero: 10, nombre: 'Octubre' },
                { numero: 11, nombre: 'Noviembre' },
                { numero: 12, nombre: 'Diciembre' }
            ],
            mesSeleccionado: ''
        }
    },
    computed: {
        facturasFiltradas() {
            if (!this.mesSeleccionado) {
                return this.facturas;
            }
            
            // Convertir mesSeleccionado a número
            const mesSeleccionadoNum = Number(this.mesSeleccionado);
            
            return this.facturas.filter(factura => {
                if (!factura.fecha) return false;
                
                // Extraer directamente el mes desde la cadena de texto formato YYYY-MM-DD
                try {
                    // Dividir la fecha por el guion
                    const partesFecha = factura.fecha.split('-');
                    
                    // Si el formato es YYYY-MM-DD, el mes estará en la posición 1
                    if (partesFecha.length >= 2) {
                        // Convertir a número y comparar
                        const mesFactura = parseInt(partesFecha[1], 10);
                        return mesFactura === mesSeleccionadoNum;
                    }
                    return false;
                } catch (error) {
                    console.error("Error al procesar la fecha:", factura.fecha, error);
                    return false;
                }
            });
        },
        optionData() {
            return this.$route.query.empresa;
        }
    },
    async created() {
        await this.obtenerFacturas();
    },
    methods: {
        async obtenerFacturas() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/facturas/${this.optionData}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                this.facturas = await response.json();
                console.log("Facturas obtenidas:", this.facturas);
            } catch (error) {
                console.error("Error al obtener facturas:", error);
                alert("Error al obtener las facturas");
            }
        },
        filtrarFacturas() {
            console.log("Mes seleccionado:", this.mesSeleccionado);
            console.log("Facturas filtradas:", this.facturasFiltradas);
        },
        formatDate(fecha) {
            if (!fecha) return '';
            
            try {
                // Si la fecha está en formato YYYY-MM-DD
                const partesFecha = fecha.split('-');
                if (partesFecha.length === 3) {
                    // Formato día/mes/año para visualización
                    return `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
                }
                return fecha;
            } catch (error) {
                console.error("Error al formatear fecha:", fecha, error);
                return fecha;
            }
        },
        async editarFactura(factura) {
            this.$router.push({
                name: 'edit',
                query: {
                    empresa: this.optionData,
                    facturaNit: `${factura.nit}`,
                    numeroFactura: `${factura.numero_factura}`
                }
            });
        },
        async eliminarFactura(nit, numero_factura) {
            const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta factura?");
            if (confirmDelete) {
                try {
                    const response = await fetch(`http://localhost:8000/factura/${this.optionData}/${nit}/${numero_factura}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        alert("Factura eliminada con éxito");
                        await this.obtenerFacturas();
                    } else {
                        alert("Error al eliminar la factura");
                    }
                } catch (error) {
                    console.error("Error al eliminar la factura:", error);
                    alert("Error al eliminar la factura");
                }
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
        regresar() {
            this.$router.go(-1);
        },
        irAInicio() {
            this.$router.push({ path: '/informes', query: { empresa: this.optionData } });
        }
    }
}
</script>

<style>
/* Estilos generales para la tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-family: 'Arial, sans-serif';
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

/* Estilo para encabezados */
th {
  background-color: #009879;
  color: white;
  font-weight: bold;
}

/* Estilo para las filas */
tr {
  transition: background-color 0.3s;
}

tr:hover {
  background-color: #f1f1f1;
}

.row-red {
  background-color: #ffcccc;
}

.row-green {
  background-color: #ccffcc;
}

/* Estilo para los botones */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-right: 10px;
}

button:hover {
  background-color: #0056b3;
}

/* Estilo para la barra inferior */
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px;
  border-top: 1px solid #ddd;
}
.filtro-mes {
    margin: 20px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.filtro-mes select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.btn-editar {
    background-color: #28a745;
    margin-right: 5px;
}

.btn-eliminar {
    background-color: #dc3545;
}
</style>
