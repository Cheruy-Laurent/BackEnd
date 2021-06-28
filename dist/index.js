"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const serve_static_1 = __importDefault(require("serve-static"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(serve_static_1.default("public"));
app.use(cors_1.default());
const uri = "mongodb://localhost:27017/BIBLI02";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("Mongo Data");
});
app.get("/", (req, resp) => {
    resp.send("heelo");
});
app.get("/books", (req, resp) => {
    // resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.post("/books", (req, resp) => {
    let book = new book_model_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:_id", (req, resp) => {
    book_model_1.default.findByIdAndUpdate(req.params._id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book updated successfull");
    });
});
app.delete("/books/:_id", (req, resp) => {
    book_model_1.default.findByIdAndDelete(req.params._id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book delete successfull");
    });
});
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.page || 5);
    book_model_1.default.paginate({}, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
app.get("/books-search", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.page || 5);
    let kw = req.query.kw || "";
    book_model_1.default.paginate({ title: { $regex: ".*(?i)" + kw + ".*" } }, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
app.listen(8085, () => {
    console.log("server");
});
