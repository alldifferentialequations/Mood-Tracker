import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import 'dotenv/config';
import { body, validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Middleware verificarJWT
function verificarJWT(req, res, next) {
  // 1. Obtener el token del header "Authorization"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado: No hay token" });
  }

  try {
    // 2. Verificar que la firma sea válida con tu clave secreta
    const datosDecodificados = jwt.verify(token, process.env.CLAVE);
    
    // 3. Inyectar el ID verificado dentro del objeto "req" (petición)
    req.usuarioId = datosDecodificados.id;

    // 4. Continuar hacia la ruta final
    next(); 
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
}

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
            return res.status(400).json({ "success": false, "errores": errores.array(), "mensaje": "Errores en los campos" });
        }

        const { nombre, email, password } = req.body;

        // Hash de la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const consulta = "INSERT INTO usuario (email, password, nombre_usuario) VALUES (?, ?, ?)";
        const [resultado] = await pool.execute(consulta, [email, hashedPassword, nombre]);

        return res.status(201).json({
            "succes": true,
            "mensaje": "Usuario creado con exito",
        })
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({
                "mensaje": "Error 1062"
            })
        }

        return res.status(500).json({ "mensaje": "Error interno del servidor" });
    }
});

//Codigo para iniciar sesion
app.post("/login", [
    body('email').notEmpty().isEmail().withMessage("Formato de correo inválido"),
    body('password').notEmpty().isLength({min: 8}).withMessage('La contraseña debe tener mínimo 8 caracteres')
], async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ "success": false, "errores": errores.array(), "mensaje": "Errores en los campos" });
        }

        const { email, password } = req.body;
        const consulta = 'SELECT id_usuario, email, password FROM usuario WHERE email = ?';
        const [resultado] = await pool.execute(consulta, [email]);

        if (resultado.length === 0) {
            return res.status(401).json({"success": false, "mensaje": "Credenciales incorrectas"});
        }

        const passwordValida = await bcrypt.compare(password, resultado[0]["password"]);
        if (!passwordValida) {
            return res.status(401).json({ success: false, mensaje: "Credenciales incorrectas" });
        }

        const datosJWT = {
            id: resultado[0]["id_usuario"],
            correo: email
        }

        const token = jwt.sign(datosJWT, process.env.CLAVE, { expiresIn: '2h' });

        return res.status(200).json({
            "token": token,
            "email": email,
            "id": resultado[0]["id_usuario"],
            "mensaje": "El usuario ha sido encontrado :)"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({"success": false, "mensaje": "Ocurrió un error. Fallo del servidor"});
    }
});

//Codigo para cargar los moods a la pagina
app.get("/mood", verificarJWT,  async (req, res) => {  
    try {
        const id = req.usuarioId;

        const query = "SELECT id_mood, color, feeling FROM mood WHERE id_usuario = ?";
        const [resultado] = await pool.execute(query, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para agregar un nuevo mood
app.post("/mood", verificarJWT , async (req, res) => {
    try {
        const id = req.usuarioId;

        const { color, feeling } = req.body;
        const query = "INSERT INTO mood (color, feeling, id_usuario) VALUES (?, ?, ?)";
        await pool.execute(query, [color, feeling, id]);

        return res.status(201).json({"Mensaje": "Se ha creado un nuevo mood"});
    } catch (error) {
        if (error.errno === 1062) {
            return res.status(400).json({"Mensaje": "Datos repetidos"});
        }

        console.log(error);
        return res.status(500).json({ "Mensaje": "Error interno del servidor" });
    }
});

//Codigo para borrar un mood
app.delete("/mood/:id_mood", verificarJWT, async (req, res) => {
    try {
        const id_usuario = req.usuarioId;

        const { id_mood } = req.params;
        const consulta = "DELETE FROM mood WHERE id_mood = ? AND id_usuario = ?";
        await pool.execute(consulta, [id_mood, id_usuario]);
        
        return res.status(200).json({"Mensaje": "Se ha eliminado un mood pe"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para cargar los dias a la pagina
app.get("/dia", verificarJWT, async (req, res) => {
    try {
        const id = req.usuarioId;

        const consulta = "SELECT id_registro_fecha, fecha, id_mood FROM registro_fecha WHERE id_usuario = ?";
        const [resultado] = await pool.execute(consulta, [id]);

        return res.status(200).json({"Resultados": resultado});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});
 
//Codigo para agregar un dia a la base de datos
app.post("/dia", verificarJWT, async (req, res) => {
    try {
        const id_usuario = req.usuarioId;

        const { fecha, id_mood } = req.body;
        const consulta = "INSERT INTO registro_fecha (fecha, id_mood, id_usuario) VALUES (?, ?, ?)";
        await pool.execute(consulta, [fecha, id_mood, id_usuario]);
        
        return res.status(200).json({"Mensaje": "Un nuevo dia ha sido agregado uwu"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para borrar un dia a la base de datos
app.delete("/dia/:fecha", verificarJWT, async (req, res) => {
    try {
        const id_usuario = req.usuarioId;

        const { fecha } = req.params;
        const consulta = "DELETE FROM registro_fecha WHERE fecha = ? AND id_usuario = ?";
        await pool.execute(consulta, [fecha, id_usuario]);
        
        return res.status(200).json({"Mensaje": "Dia eliminado"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

//Codigo para actualizar un dia
app.patch("/dia", verificarJWT, async(req, res) => {
    try {
        const id_usuario = req.usuarioId;

        const { fecha, id_mood } = req.body;
        const consulta = "UPDATE registro_fecha SET id_mood = ? WHERE id_usuario = ? AND fecha = ?";
        await pool.execute(consulta, [id_mood, id_usuario, fecha]);
        
        return res.status(200).json({"Mensaje": "Dia Actualizado"});
    } catch (error) {
        return res.status(500).json({"Mensaje": "Error interno del servidor"});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server Encendido en el Puerto: ${process.env.PORT}\n\n`);
});