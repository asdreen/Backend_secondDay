import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const authorsRouter = express.Router();

// GET /authors => returns the list of authors: http://localhost:3001/authors
// GET /authors/123 => returns a single author: http://localhost:3001/authors/:authorId
// POST /authors => create a new author: http://localhost:3001/authors/ (+body)
// PUT /authors/123 => edit the author with the given id: http://localhost:3001/authors/:authorId (+body)
// DELETE /authors/123 => delete the author with the given id: http://localhost:3001/authors/:authorId

// 1. POST http://localhost:3001/users/ (+body)
authorsRouter.post("/", (req, res) => {
  console.log(req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
    avatar: `url("https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}")`,
  };
  const authorsList = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsList.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsList));
  res.status(201).send({ id: newAuthor.id });
});

// 2. GET http://localhost:3001/users/
authorsRouter.get("/", (req, res) => {
  const authorsList = fs.readFileSync(authorsJSONPath);
  console.log("authorlist:", authorsList);
  const authors = JSON.parse(authorsList);
  res.send(authors);
});

// 3. GET http://localhost:3001/users/:userId
authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorlist = JSON.parse(fs.readFileSync(authorsJSONPath));
  const foundAuthor = authorlist.find((author) => author.id === authorId);
  res.send(foundAuthor);
});

// 4. PUT http://localhost:3001/users/:userId
authorsRouter.put("/:authorId", (req, res) => {
  console.log(req.body);
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorList.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthorData = authorList[index];
  const updatedAuthor = {
    ...oldAuthorData,
    ...req.body,
    updatedAt: new Date(),
  };
  authorList[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorList));
  res.send(updatedAuthor);
});

// 5. DELETE http://localhost:3001/users/:userId
authorsRouter.delete("/:authorId", (req, res) => {
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainAuthors = authorList.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainAuthors));
  res.status(204).send();
});
export default authorsRouter;
