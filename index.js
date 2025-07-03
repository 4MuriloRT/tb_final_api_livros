import express from "express"
import mysql, { createConnection } from "mysql"
import cors from "cors"

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
});