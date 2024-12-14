const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

//middleware para aanalizar los datos JSON
app.use(express.json());

//Configuracion para la conexion MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "practica",
});

//Conetar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conectado con exito a la base de datos");
  }
});

//Crear una nueva materia
app.post("/materias", (req, res) => {
  const materias = req.body;
  const sql =
    "INSERT INTO materias (NombreMateria, Descripcion, Nota) VALUES(?, ?, ?)";

  db.query(
    sql,
    [materias.NombreMateria, materias.Descripcion, materias.Nota],
    (err, result) => {
      if (err) {
        console.error("Error a crear una nueva materia:", err);
        res.status(500).json({ error: "Error al crear una nueva materia" });
      } else {
        console.log("Materia creada con exito");
        res
          .status(201)
          .json({ message: "Materia Creada", id: result.insertId });
      }
    }
  );
});

//Obtener todas las materias
app.get("/materias", (req, res) => {
  const sql = "SELECT * FROM materias"
  db.query(sql, (err, results)=>{
    if (err) {
      console.error("Error al obtener las materias", err);
      res.status(500).json({error: "Error al cargar las materias de la tabla"})      
    } else { 
      console.log("Materias obtenidas con exito")
      res.status(200).json(results)   
    }
  });
});


//Obtener una materia por su ID
app.get("/materias/:id", (req, res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM materias WHERE IDMateria = ?"
  db.query(sql, [id], (err, results)=>{
    if (err) {
      console.error("Error al obtener la materia", err)
      res.status(500).json({error: "Error al cargar la materia de la tabla"});
    } else {
      console.log("Materias obtenidas con exito")
      res.status(200).json(results);
    }
  });
});

//Actualizar una materia desde su ID
app.put("/materias/:id", (req, res)=>{
  const id = req.params.id;
  const materias = req.body;
  const sql = "UPDATE materias SET NombreMateria = ?, Descripción = ?, Nota = ? WHERE IDMateria = ?";
  db.query(sql, [materias.NombreMateria, materias.Descripcion, materias.Nota, id], (err) =>{
    if (err) {
      console.error("Error al actualizar la materia", err)
      res.status(500).json({error: "Error al actualizar"})
    } else {
      console.log("Materia actualizada");
      res.status(201).json({message: "Materia actualizadas"})
    }
  });
})

//Iniciar el Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en httt://localhost:${port}`);
});
