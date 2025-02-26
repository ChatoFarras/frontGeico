<template>
    <div class="container">
        <h1>Editar Factura {{ this.optionEmpresa }}</h1>
        
        <!-- Datos no editables -->
        <div class="datos-no-editables">
            <div class="campo">
                <label>NIT:</label>
                <span>{{ this.optionNit }}</span>
            </div>
            <div class="campo">
                <label>Numero Factura:</label>
                <span>{{ this.optionFactura }}</span>
            </div>
            <div class="campo">
                <label>Cliente:</label>
                <span>{{ factura.cliente }}</span>
            </div>
            <div class="campo">
                <label>Fecha:</label>
                <span>{{ factura.fecha }}</span>
            </div>
            <div class="campo">
                <label>Detalle:</label>
                <span>{{ factura.detalle }}</span>
            </div>
        </div>

        <!-- Formulario de edición -->
        <form @submit.prevent="guardarCambios">
            

            <!-- Campos numéricos -->
            <div class="campos-numerico">
                <div class="campo-editable">
                    <label>Subtotal:</label>
                    <input type="number" v-model="factura.valor_antes_iva" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>Descuento:</label>
                    <input type="number" v-model="factura.descuento" step="0.01" required>
                </div>

                <div class="campo-editable">
                    <label>Otros Valores:</label>
                    <input type="number" v-model="factura.otros_valores" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>IVA 19%:</label>
                    <input type="number" v-model="factura.iva19" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>Base IVA 19%:</label>
                    <input type="number" v-model="factura.base19" step="0.01" required>
                </div>

                <div class="campo-editable">
                    <label>IVA 5%:</label>
                    <input type="number" v-model="factura.iva5" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>Base IVA 5%:</label>
                    <input type="number" v-model="factura.base5" step="0.01" required>
                </div>




                <div class="campo-editable">
                    <label>IVA TOTAL:</label>
                    <input type="number" v-model="factura.valor_iva" step="0.01" required>
                </div>
                

                <div class="campo-editable">


                </div>
                <div class="campo-editable">
                    <label>Otros Impuestos:</label>
                    <input type="number" v-model="factura.valor_otros_impuestos" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>Base Otros Impuestos:</label>
                    <input type="number" v-model="factura.base_otros_impuestos" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>Retefuente:</label>
                    <input type="number" v-model="factura.retefuente" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>ReteIVA:</label>
                    <input type="number" v-model="factura.reteiva" step="0.01" required>
                </div>
                <div class="campo-editable">
                    <label>ReteICA:</label>
                    <input type="number" v-model="factura.reteica" step="0.01" required>
                </div>
            </div>

            <!-- Total y revisión -->
            <div class="campo-editable">
                <label>Total a Pagar:</label>
                <input type="number" v-model="factura.total_a_pagar" step="0.01" required>
            </div>
            <div class="campo-editable">
                <label>Necesita Revisión:</label>
                <input type="checkbox" v-model="factura.necesita_revision">
            </div>

            <!-- Botones de acción -->
            <div class="botones-accion">
                <button type="submit" class="btn-guardar">Guardar Cambios</button>
                <button type="button" @click="$router.go(-1)" class="btn-cancelar">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            factura: {
                nit: '',
                cliente: '',
                fecha: '',
                detalle: '',
                valor_antes_iva: 0,
                descuento:0, 
                otros_valores:0,
                iva19: 0 ,
                base19: 0,
                valor_iva: 0,
                valor_otros_impuestos: 0,
                retefuente: 0,
                reteiva: 0,
                reteica: 0,
                total_a_pagar: 0,
                necesita_revision: false
            }
        }
    },
    computed: {

        optionEmpresa() {
            return this.$route.query.empresa;
        },
        optionNit() {
            return this.$route.query.facturaNit;
        },
        optionFactura() {
            return this.$route.query.numeroFactura;
        },
    },
    async created() {
        const empresa = this.optionEmpresa
        const nit = this.optionNit
        const factura = this.optionFactura
        await this.obtenerFactura(empresa, nit, factura);
    },
    methods: {
        async obtenerFactura(empresa, nit, factura) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/facturaEdit/${empresa}/${nit}/${factura}`);
                const data = await response.json();
                const facturaData = data[0];
                this.factura = {
                    nit: facturaData.nit,
                    numero_factura: facturaData.numero_factura,
                    cliente: facturaData.RazonSocial,
                    fecha: facturaData.fecha,
                    detalle: facturaData.detalle, 
                    valor_antes_iva: facturaData.valor_antes_iva,
                    descuento:facturaData.descuento, 
                    otros_valores:facturaData.otros_valores,
                    iva19: facturaData.valor19 ,
                    base19: facturaData.base19 ,
                    iva5: facturaData.valor5 ,
                    base5: facturaData.base5 ,
                    valor_iva: facturaData.valor_iva,
                    valor_otros_impuestos: facturaData.valor_otros_impuestos,
                    base_otros_impuestos: facturaData.base_otros_impuestos ,
                    retefuente: facturaData.retefuente,
                    reteiva: facturaData.reteiva,
                    reteica: facturaData.reteica,
                    total_a_pagar: facturaData.total_a_pagar,
                    necesita_revision: facturaData.necesita_revision
            };



            } catch (error) {
                console.error("Error al obtener la factura:", error);
                this.$router.push({ path: '/facturas' });
            }
        },
        async guardarCambios() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/update-factura/${empresa}/${nit}/${factura}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.factura)
                });

                if (response.ok) {
                    alert('Factura actualizada con éxito');
                    this.$router.push({ name: 'listar-facturas' });
                } else {
                    alert('Error al actualizar la factura');
                }
            } catch (error) {
                console.error("Error al guardar los cambios:", error);
                alert('Error al actualizar la factura');
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
    }
}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.datos-no-editables {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.campo {
    margin-bottom: 15px;
}

.campo-editable {
    margin-bottom: 15px;
}

.campo label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.campo input[type="text"],
.campo input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.campo input[type="checkbox"] {
    margin-right: 10px;
}

.botones-accion {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.btn-guardar {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-eliminar {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-cancelar {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}
</style>