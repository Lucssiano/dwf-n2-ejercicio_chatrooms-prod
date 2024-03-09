"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestoreDB = exports.realTimeDB = void 0;
var serviceAccount = require("../firebaseKey.json");
var admin = require("firebase-admin");
// Inicializar la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://apx-dwf-m6-56070-default-rtdb.firebaseio.com',
});
var realTimeDB = admin.database();
exports.realTimeDB = realTimeDB;
var firestoreDB = admin.firestore();
exports.firestoreDB = firestoreDB;
