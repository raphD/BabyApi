const express = require("express");
const app = express();

const port = 3000;
const fs = require("fs");
const cors = require("cors"); // Import the cors module
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow requests from this origin
  })
);

// Define a simple route
app.get("/", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read the file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      console.log(jsonData);
      res.send(jsonData);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      res.status(500).send("Error parsing JSON");
    }
  });
});

app.put("/items", (req, res) => {
  const newItem = Math.floor(new Date().getTime() / 1000.0).toString(); // Timestamp en secondes
  const filePath = "data.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier :", err);
      return res.status(500).json({ error: "Erreur de lecture des données" });
    }

    try {
      const jsonData = JSON.parse(data);

      // Vérifier si jsonData a une propriété "timestamps" qui est un tableau
      if (jsonData.timestamps && Array.isArray(jsonData.timestamps)) {
        jsonData.timestamps.push(newItem);

        const updatedJson = JSON.stringify(jsonData, null, 2);
        fs.writeFile(filePath, updatedJson, (err) => {
          if (err) {
            console.error("Erreur lors de l'écriture dans le fichier :", err);
            return res
              .status(500)
              .json({ error: "Erreur de mise à jour des données" });
          }
          res.json(jsonData);
        });
      } else {
        console.error("Le fichier JSON n'a pas la structure attendue.");
        return res.status(500).json({ error: "Format de données invalide" });
      }
    } catch (parseError) {
      console.error("Erreur lors de l'analyse JSON :", parseError);
      return res.status(500).json({ error: "Erreur d'analyse des données" });
    }
  });
});

app.put("/items/:timestamp", (req, res) => {
  const newItem = {
    timestamp: req.params.timestamp,
  };
  const filePath = "data.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier :", err);
      return res.status(500).json({ error: "Erreur de lecture des données" });
    }

    try {
      const jsonData = JSON.parse(data);

      // Vérifier si jsonData a une propriété "timestamps" qui est un tableau
      if (jsonData.timestamps && Array.isArray(jsonData.timestamps)) {
        jsonData.timestamps.push(newItem.timestamp); // Ajouter le timestamp au tableau

        const updatedJson = JSON.stringify(jsonData, null, 2);
        fs.writeFile(filePath, updatedJson, (err) => {
          if (err) {
            console.error("Erreur lors de l'écriture dans le fichier :", err);
            return res
              .status(500)
              .json({ error: "Erreur de mise à jour des données" });
          }
          res.json(jsonData);
        });
      } else {
        console.error("Le fichier JSON n'a pas la structure attendue.");
        return res.status(500).json({ error: "Format de données invalide" });
      }
    } catch (parseError) {
      console.error("Erreur lors de l'analyse JSON :", parseError);
      return res.status(500).json({ error: "Erreur d'analyse des données" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
