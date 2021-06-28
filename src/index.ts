import express, {query, Request, Response} from "express";
import mongoose from "mongoose";
import Book from "./book.model";
import bodyParser from "body-parser";
import serveStatic from "serve-static";
import cors from "cors";

const app=express();
app.use(bodyParser.json());
app.use(serveStatic("public"));
app.use(cors());
const uri = "mongodb://localhost:27017/BIBLI02";
mongoose.connect(uri, (err) => {
    if (err) console.log(err);
   else     console.log("Mongo Data");
});

app.get("/", (req :Request, resp: Response) => {
    resp.send("heelo");
});


app.get("/books", (req :Request, resp: Response) => {
   // resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    Book.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
       
            resp.send(books);
    });
});


app.post("/books", (req :Request, resp: Response) => {
    let book =new Book(req.body);
    book.save(err=>{
        if (err)
        resp.status(500).send(err);
        else
            resp.send(book);
        });
});

app.put("/books/:_id", (req :Request, resp: Response) => {

    Book.findByIdAndUpdate(req.params._id,req.body,(err,book)=>{
        if (err)
        resp.status(500).send(err);
        else
            resp.send("Book updated successfull");
        });
});

app.delete("/books/:_id", (req :Request, resp: Response) => {

    Book.findByIdAndDelete(req.params._id,req.body,(err,book)=>{
        if (err)
        resp.status(500).send(err);
        else
            resp.send("Book delete successfull");
        });
});

app.get("/pbooks", (req:Request, resp: Response) => {

let p :number = parseInt(req.query.page as any||1);
let size :number = parseInt(req.query.page as any||5);

    Book.paginate({},{page : p , limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});

app.get("/books-search", (req:Request, resp: Response) => {

    let p :number = parseInt(req.query.page as any||1);
    let size :number = parseInt(req.query.page as any||5);
    let kw :string = req.query.kw as any || "";
    
        Book.paginate({title:{$regex:".*(?i)"+kw+".*"}},{page : p , limit: size }, function (err, result) {
            if (err)
                resp.status(500).send(err);
            else
                resp.send(result);
        });
    });
app.listen(8085, () => {
    console.log("server");
});