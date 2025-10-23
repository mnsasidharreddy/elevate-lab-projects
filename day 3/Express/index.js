import express from "express";
const app = express();
const port = 3000;
app.use(express.json());

let books = [
  { id: 1, title: "The Book", author: "Ram" },
  { id: 2, title: "The Cook", author: "Joy" }
];


app.get("/", (req, res)=> {
res.send(`
    <h1>Hi Try The Below Endpoints</h1>
    <ol>
      <li>Use GET /books to view all books</li>
      <li>Use POST /books to add a book</li>
      <li>Use PUT /books/:id to update a book</li>
      <li>Use DELETE /books/:id to delete a book</li>
    </ol>`);
});

app.get("/books", (req, res) => {
  res.json(books);
});


app.post("/books", (req, res) => {
  const { id, title, author } = req.body;
  if (!id || !title || !author) {
    return res.status(400).json({ error: "Please provide id, title, and author" });
  }
  books.push({ id, title, author });
  res.status(201).json({ message: "Book added", book: { id, title, author } });
});

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });

  if (title) book.title = title;
  if (author) book.author = author;

  res.json({ message: "Book updated", book });
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  books.splice(index, 1);
  res.json({ message: "Book deleted" });
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}.`);
});
