const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("users").get();
  
    let users = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
  
      users.push({ id,...data}); // spread operator with data will return entire object.
      //push each object in users array
    });
  
    res.status(200).send(JSON.stringify(users)); // set status, stringify response and send
  });

app.get("/:id", async (req, res) => {
  const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();

  const userid = snapshot.id
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({id:userid,...userData})) // set status and send response
}) 

app.post("/", async (req, res) => {
    const user = req.body;
  
    await admin.firestore().collection("users").add(user);
  
    res.status(201).send('Successfully created');
});

app.put("/:id", async (req,res) => {
  const body = req.body

  await admin.firestore().collection('users').doc(req.params.id).update(body)

  res.status(200).send('Successfully updated')
})

app.delete("/:id", async (req,res) => {
 
  await admin.firestore().collection('users').doc(req.params.id).delete();

  res.status(200).send('Succesfully deleted')
})

exports.user = functions.https.onRequest(app);

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
