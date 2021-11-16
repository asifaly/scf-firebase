import {Request, Response} from "express";
import {db} from "../firebase";

const addRecord = async (req: Request, res: Response) => {
  try {
    const record = db.collection(req.params.collectionName).doc();
    record.set(req.body);
    res.status(200).send({
      status: "success",
      message: `New Record with reference ${record.id} added successfully`,
      data: req.body,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRecordById = async (req: Request, res: Response) => {
  try {
    const recordRef = db.collection(req.params.collectionName).doc(req.params.docId);
    const record = await recordRef.get();
    return res.status(200).json(record.data());
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAllRecords = async (req: Request, res: Response) => {
  /* eslint no-var: off */
  var allRecords :unknown[] = [];
  try {
    const recordRef = await db.collection(req.params.collectionName).get();
    recordRef.forEach((doc) => {
      const docid :string = doc.id;
      const document :unknown = {
        id: docid, ...doc.data(),
      };
      allRecords.push(document);
    });
    // If there is a query param the below will filter the records, more than one query param will also work
    const filters :any = req.query;
    const filteredRecords = allRecords.filter((record :any) => {
      let isValid = true;
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          isValid = isValid && record[key].toString().toLowerCase().includes(filters[key].toLowerCase());
        }
      }
      return isValid;
    });

    return res.status(200).json(filteredRecords);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateRecord = async (req: Request, res: Response) => {
  try {
    const record = db.collection(req.params.collectionName).doc(req.params.docId);
    await record.set(req.body, {merge: true}).catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: `Record with reference ${record.id} updated successfully`,
      data: req.body,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteRecord = async (req: Request, res: Response) => {
  try {
    const record = db.collection(req.params.collectionName).doc(req.params.docId);
    await record.delete().catch((error) => {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });

    return res.status(200).json({
      status: "success",
      message: "Record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export {addRecord, getAllRecords, updateRecord, deleteRecord, getRecordById};

