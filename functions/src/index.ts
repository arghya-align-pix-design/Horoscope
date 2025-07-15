//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';


admin.initializeApp();
const db = admin.firestore();

exports.autoCloseChats = functions.pubsub
  .schedule("30 18 * * *") // 12:00 AM IST
  .onRun(async () => {
    console.log("⏰ Running auto-close chat task...");

    const openChats = await db.collection("chats").where("closed", "==", false).get();

    const updates = openChats.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => 
        doc.ref.update({ closed: true }));
    await Promise.all(updates);

    console.log(`✅ Closed ${updates.length} chats.`);
  });

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
