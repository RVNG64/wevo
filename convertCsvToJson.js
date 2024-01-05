const fs = require('fs');
const Papa = require('papaparse');

const csvFilePath = 'public/dt-events.csv';
const jsonFilePath = 'public/bddEvents.json';

fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Une erreur est survenue lors de la lecture du fichier CSV :", err);
    return;
  }

  Papa.parse(data, {
    header: true,
    complete: (result) => {
      fs.writeFile(jsonFilePath, JSON.stringify(result.data, null, 2), 'utf8', (err) => {
        if (err) {
          console.error("Une erreur est survenue lors de l'écriture du fichier JSON :", err);
        } else {
          console.log('Fichier JSON créé avec succès !');
        }
      });
    }
  });
});
