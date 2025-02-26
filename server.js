const express = require("express");
const path = require("path");

const app = express();

// Servir archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// Manejar rutas en modo history de Vue
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Usar el puerto proporcionado por Azure o el 8080 por defecto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
