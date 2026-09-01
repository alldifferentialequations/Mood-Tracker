import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import 'dotenv/config';
import { body, validationResult } from 'express-validator';

const app = express();


app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());


//Crear las conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


//Codigo para el registro
app.post("/registro", [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').notEmpty().isEmail().withMessage('Formato de correo inválido'),
    body('password').notEmpty().isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres')
] ,async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ "success": false, "errores": errores.array(), "Mensaje": "Errores en los campos" });
        }

        const {nombre, email, password} = req.body;
        const consulta = "INSERT INTO usuario (email, password, nombre_usuario) VALUES (?, ?, ?)";
        const [resultado] = await pool.execute(consulta, [email, password, nombre]);

        res.status(201).json({
            "Succes": true,
            "Mensaje": "Usuario creado con exito",
        })
    } catch (error) {
        if (error.errno === 1062) {
            res.status(400).json({
                "Mensaje": "Error 1062"
            })
        }

        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para el inicio de sesion
app.post("/login", [
    body('email').notEmpty().isEmail().withMessage("Formato de correo inválido"),
    body('password').notEmpty().isLength({min: 8}).withMessage('La contraseña debe tener mínimo 8 caracteres')
], async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ "success": false, "errores": errores.array(), "Mensaje": "Errores en los campos" });
        }

        const {email, password} = req.body;
        const consulta = 'SELECT id_usuario, email, password FROM usuario WHERE email = ?';
        const [resultado] = await pool.execute(consulta, [email]);

        if (resultado.length === 0) {
            return res.status(404).json({"success": false, "Mensaje": "Usuario no encontrado"});
        }

        if (resultado[0].email !== email || resultado[0].password !== password) {
            return res.status(400).json({"success": true, "Mensaje": "Los datos no coinciden"});
        }

        res.status(200).json({"Email": email, "Password": password, "id": resultado[0]["id_usuario"], "Mensaje": "El usuario ha sido encontrado :)"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success": false, "Mensaje": "Ocurrió un error. Fallo del servidor"});
    }
});

//Codigo para cargar los moods a la pagina
app.get("/login/mood/:id", async (req, res) => {  
    try {
        const { id } = req.params;
        const query = "SELECT id_mood, color, feeling FROM mood WHERE id_usuario = ?";
        const [resultado] = await pool.execute(query, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({"Mensaje": "Datos repetidos"});
        }

        console.log(error);
        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para cargar los dias a la pagina
app.get("/login/dia/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = "SELECT id_registro_fecha, fecha, id_mood FROM registro_fecha WHERE id_usuario = ?";
        const [resultado] = await pool.execute(consulta, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para cargar los moods al agregar el nuevo mood
app.get("/principal/mood/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT id_mood, color, feeling FROM mood WHERE id_usuario = ?";
        const [resultado] = await pool.execute(query, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({"Mensaje": "Datos repetidos"});
        }

        console.log(error);
        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para agregar un nuevo mood
app.post("/principal/mood", async (req, res) => {
    try {
        const {color, feeling, id} = req.body;
        const query = "INSERT INTO mood (color, feeling, id_usuario) VALUES (?, ?, ?)";
        const [resultado] = await pool.execute(query, [color, feeling, id]);

        return res.status(200).json({"Mensaje": "Se ha creado un nuevo mood"});
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({"Mensaje": "Datos repetidos"});
        }

        console.log(error);
        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para borrar un mood
app.delete("/principal/mood", async (req, res) => {
    try {
        const { id_mood, id_usuario } = req.body;
        const consulta = "DELETE FROM mood WHERE id_mood = ? AND id_usuario = ?";
        const [resultado] = await pool.execute(consulta, [id_mood, id_usuario]);
        
        return res.status(200).json({"Mensaje": "Se ha eliminado un mood pe"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para agregar un dia a la base de datos
app.post("/principal/dia", async (req, res) => {
    try {
        const { fecha, id_mood, id_usuario} = req.body;
        const consulta = "INSERT INTO registro_fecha (fecha, id_mood, id_usuario) VALUES (?, ?, ?)";
        const [resultado] = await pool.execute(consulta, [fecha, id_mood, id_usuario]);
        
        res.status(200).json({"Mensaje": "Un nuevo dia ha sido agregado uwu"});
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({"Mensaje": "Fecha duplicada"});
        }

        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para borrar un dia a la base de datos
app.delete("/principal/dia", async (req, res) => {
    try {
        const { fecha, id_mood, id_usuario } = req.body;
        const consulta = "DELETE FROM registro_fecha WHERE fecha = ? AND id_usuario = ?";
        const [resultado] = await pool.execute(consulta, [fecha, id_usuario]);
        
        res.status(200).json({"Mensaje": "Dia eliminado"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

app.patch("/principal/dia", async(req, res) => {
    try {
        const { fecha, id_mood, id_usuario } = req.body;
        const consulta = "UPDATE registro_fecha SET id_mood = ? WHERE id_usuario = ? AND fecha = ?";
        const [resultado] = await pool.execute(consulta, [id_mood, id_usuario, fecha]);
        
        res.status(200).json({"Mensaje": "Dia Actualizado"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para cargar los dias a la pagina principal
app.get("/principal/dia/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = "SELECT id_registro_fecha, fecha, id_mood FROM registro_fecha WHERE id_usuario = ?";
        const [resultado] = await pool.execute(consulta, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server Encendido\nPuerto: ${process.env.PORT}`);
});