"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
var cors_1 = require("cors");
var port = process.env.PORT || 3000; /* No sé cual seria el process env port --- PREGUNTAR */
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var usersCollection = db_1.firestoreDB.collection('users');
var roomsCollection = db_1.firestoreDB.collection('rooms');
/* SignUp */
app.post('/signup', function (req, res) {
    var _a = req.body, email = _a.email, name = _a.name;
    usersCollection
        .where('email', '==', email)
        .get()
        .then(function (snapshot) {
        if (snapshot.empty)
            usersCollection
                .add({ email: email, name: name })
                .then(function (newUserRef) { return res.json({ message: 'Usuario creado de manera exitosa', id: newUserRef.id }); });
        else
            res.status(400).json({ error: 'User already exists' });
    });
});
/* Auth o login*/
app.post('/auth', function (req, res) {
    var _a = req.body, name = _a.name, email = _a.email;
    usersCollection
        .where('email', '==', email)
        .where('name', '==', name)
        .get()
        .then(function (snapshot) {
        if (snapshot.empty) {
            res.status(400).json({ error: 'User not found' });
        }
        else
            res.json({ message: 'User found', id: snapshot.docs[0].id });
    });
});
/* ### Rooms (REALTIME DB y FIRESTORE DB) ### */
app.post('/rooms', function (req, res) {
    var userId = req.body.userId;
    usersCollection
        .doc(userId.toString())
        .get()
        .then(function (user) {
        if (user.exists) {
            var roomRef_1 = db_1.realTimeDB.ref("chatroom/rooms/".concat((0, nanoid_1.nanoid)()));
            roomRef_1.set({ messages: [], owner: userId }).then(function (rtdbRes) {
                var roomLongId = roomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomsCollection
                    .doc(roomId.toString())
                    .set({ rtdbRoomId: roomLongId })
                    .then(function () {
                    res.json({ message: 'Room created', roomId: roomId.toString() });
                });
            });
        }
        else {
            res.status(401).json({ error: 'User does not exists' });
        }
    });
});
app.get('/rooms/:roomId', function (req, res) {
    var roomId = req.params.roomId;
    roomsCollection
        .doc(roomId)
        .get()
        .then(function (room) {
        if (room.exists)
            res.json(room.data());
        else
            res.status(401).json({ error: 'Room does not exists' });
    });
});
app.post('/messages/:rtdbId', function (req, res) {
    var rtdbId = req.params.rtdbId;
    var chatRoomRef = db_1.realTimeDB.ref("/chatroom/rooms/".concat(rtdbId, "/messages"));
    chatRoomRef.push(req.body, function () {
        res.json({ status: 'ok' });
    });
});
app.get('/users/:userId', function (req, res) {
    var userId = req.params.userId;
    usersCollection
        .doc(userId)
        .get()
        .then(function (user) {
        var userData = user.data();
        if (user.exists)
            res.json(userData);
        else
            res.status(401).json({ error: 'User does not exists' });
    });
});
app.use(express_1.default.static('dist'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
app.listen(port, function () { return console.log("-------- Server is running on port ".concat(3000, " -------- ")); });
