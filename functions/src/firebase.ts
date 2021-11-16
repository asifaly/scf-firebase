import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as serviceAccount from "../src/serviceAccountKey.json";

const params = serviceAccount as any;

admin.initializeApp({
  credential: admin.credential.cert(params),
});

const logger = functions.logger;
const db = admin.firestore();
const auth = admin.auth();
const activityRef = db.collection("activities");
export {admin, db, activityRef, logger, auth};

