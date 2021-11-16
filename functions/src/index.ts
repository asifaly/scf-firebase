import * as express from "express";
import * as functions from "firebase-functions";
import {addRecord, deleteRecord, getAllRecords, getRecordById, updateRecord} from "./controllers/dataController";

const app = express();

app.get("/", (req, res) => res.status(200).send("Hey there!"));

app.post("/:collectionName", addRecord);
app.get("/:collectionName", getAllRecords);
app.get("/:collectionName/:docId", getRecordById);
app.patch("/:collectionName/:docId", updateRecord);
app.delete("/:collectionName/:docI]", deleteRecord);


exports.api = functions.https.onRequest(app);
