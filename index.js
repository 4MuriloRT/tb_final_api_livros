import express from "express"
import mysql, { createConnection } from "mysql"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const app = express()

app.use(express.json())
app.use(cors())

app.listen(8800, ()=> {
    console.log("Connected to api-livros on port 8800")
})

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud_livros"
})

app.get("/", (req, res)=>{
    res.json("Hello, teste em 03-07-2024")
})

app.get("/books", (req,res)=>{
    const q = "select * from books"
    db.query(q, (err, data)=>{
        if (err)
            return res.json(err)
        return(
            res.json(data)
        )
    })
})

app.post("/books", (req,res)=>{
    const q = "INSERT INTO books(`title`, `des`,`price`, `cover`)VALUES(?)"
    const VALUES = [req.body.title, req.body.des,req.body.price,req.body.cover]

    db.query(q, [VALUES], (err, data)=>{
        if (err) return res.json(err)
        return res.json("Book has been created successfully") 
    })
})

app.delete("/books/:id", (req,res)=>{
    const bookId = req.params.id;
    const q = "delete from books where id = ?"

    db.query(q, [bookId],(err, data)=>{
        if(err) return res.json(err);
        return res.json("Book has been deleted successfully")
    })
})


app.put("/books/:id", (req,res)=>{
    const bookId = req.params.id;
    const q = "update books set `title`=?, `des`=?, `price`=?, `cover`=? where id = ?"

    const values=[
        req.body.title,
        req.body.des,
        req.body.price,
        req.body.cover
    ]

    db.query(q, [...values, bookId],(err, data)=>{
        if(err) return res.json(err);
        return res.json("Book has been updated successfully")
    })
})

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";
    db.query(q, [bookId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data[0]); // Retorna o livro encontrado
    });
  });

 //Users

app.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const q = "INSERT INTO users(`username`, `password`, `role`) VALUES (?, ?, ?)";
  const values = [username, hashedPassword, role || "user"];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("User registered successfully");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const user = data[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "secreta_chave",
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  });
});
const verifyToken = (req, res, next) => {   
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Token not provided");

  jwt.verify(token, "secreta_chave", (err, user) => {
    if (err) return res.status(403).json("Invalid token");

    req.user = user; // adiciona dados do usuário ao request
    next();
  });
};
  