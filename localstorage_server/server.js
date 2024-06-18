const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database(':memory:');

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:3000/', // adresse de votre application React
//   credentials: true
// }));
// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000', // L'origine autorisée
  credentials: true, // Permet d'envoyer les credentials
};

app.use(cors(corsOptions));
//app.use(cors());
app.use(session({
  key: 'localstorage_user_sid',
  secret: 's3cr3t_cloud_campusDFS',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// db.serialize(() => {
//   db.run(
//     "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT");
// });

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
});

app.get("/welcome", (req, res) => {
  res.send("Welcome")
})

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) {
        return res
          .status(500)
          .send("Erreur lors de l'enregistrement de l'utilisateur");
      }
      res.status(201).send("Utilisateur enregistré avec succès");
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).send("Erreur lors de la connexion");
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .send("Nom d'utilisateur ou mot de passe incorrect");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
    };
    res.status(200).send({
      id: user.id,
      username: user.username,
    });
    //res.send("Connexion réussie");
  });
});

app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.localStorage_user_sid) {
    res.clearCookie("localstorage_user_sid");
    res.send("Déconnexion réussie");
  } else {
    res.status(400).send("Utilisateur non connecté");
  }
});

app.get("/checkAuth", (req, res) => {
  if (req.session.user && req.cookies.localStorage_user_sid) {
    res.send(req.session.user);
  } else {
    res.status(401).send("Non autorisé");
  }
}); 

app.listen(5000, () => {
  console.log("Serveur démarré sur le port 5000");
});
