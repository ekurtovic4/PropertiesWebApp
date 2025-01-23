const express = require('express');
const session = require("express-session");
const path = require('path');
const fs = require('fs').promises; // Using asynchronus API for file read and write
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

const baza = require('./database/baza');
const { Sequelize } = require('sequelize');

app.use(session({
  secret: 'tajna sifra',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));

// Enable JSON parsing without body-parser
app.use(express.json());

/* ---------------- SERVING HTML -------------------- */

// Async function for serving html files
async function serveHTMLFile(req, res, fileName) {
  const htmlPath = path.join(__dirname, 'public/html', fileName);
  try {
    const content = await fs.readFile(htmlPath, 'utf-8');
    res.send(content);
  } catch (error) {
    console.error('Error serving HTML file:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
}

// Array of HTML files and their routes
const routes = [
  { route: '/nekretnine.html', file: 'nekretnine.html' },
  { route: '/detalji.html', file: 'detalji.html' },
  { route: '/meni.html', file: 'meni.html' },
  { route: '/prijava.html', file: 'prijava.html' },
  { route: '/profil.html', file: 'profil.html' },
  { route: '/statistika.html', file: 'statistika.html' },
  { route: '/vijesti.html', file: 'vijesti.html' },
  { route: '/mojiUpiti.html', file: 'mojiUpiti.html' }
  // Practical for adding more .html files as the project grows
];

// Loop through the array so HTML can be served
routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

/* ----------- SERVING OTHER ROUTES --------------- */

// Async function for reading json data from data folder 
/*async function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

// Async function for reading json data from data folder 
async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, 'data', `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}*/

/*
Checks if the user exists and if the password is correct based on korisnici.json data. 
If the data is correct, the username is saved in the session and a success message is sent.
*/
app.post('/login', async (req, res) => {
  let failedLogins, locked;
  const jsonObj = req.body;
  
  if(req.session.locked != null){
    locked = req.session.locked;

    if(locked > Date.now()){
      let newLine = `[${new Date()}] - username: ${jsonObj.username} - status: neuspješno`;
      await fs.appendFile(path.join(__dirname, 'data', 'prijave.txt'), newLine + '\r\n');
      return res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu' });
    }
    else{
      locked = null;
      req.session.locked = locked;
    }
  }
  else{
    locked = null;
    req.session.locked = locked;
  }

  if(req.session.failedLogins != null){
    failedLogins = req.session.failedLogins;
  }
  else{
    failedLogins = 0;
    req.session.failedLogins = failedLogins;
  }

  try {
    let found = false;

    const korisnik = await baza.korisnik.findOne({ where: {username: jsonObj.username} });
    const isPasswordMatched = await bcrypt.compare(jsonObj.password, korisnik.password);

    if (isPasswordMatched) {
      req.session.username = korisnik.username;
      found = true;
    }

    let loginLine = `[${new Date()}] - username: ${jsonObj.username} - status: `;

    if (found) {
      failedLogins = 0;
      req.session.failedLogins = failedLogins;
      loginLine += 'uspješno';
      await fs.appendFile(path.join(__dirname, 'data', 'prijave.txt'), loginLine + '\r\n');
      res.json({ poruka: 'Uspješna prijava' });
    } 
    else {
      failedLogins += 1;
      req.session.failedLogins = failedLogins;
      loginLine += 'neuspješno';
      await fs.appendFile(path.join(__dirname, 'data', 'prijave.txt'), loginLine + '\r\n');

      if(failedLogins >= 3){
        req.session.locked = Date.now() + 60000;
        failedLogins = 0;
        req.session.failedLogins = failedLogins;
        res.status(429).json({ greska: 'Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu' });
      }
      else{
        res.json({ poruka: 'Neuspješna prijava' });
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Delete everything from the session.
*/
app.post('/logout', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Clear all information from the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ greska: 'Internal Server Error' });
    } else {
      res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
    }
  });
});

/*
Returns currently logged user data. First takes the username from the session and grabs other data
from the .json file.
*/
app.get('/korisnik', async (req, res) => {
  // Check if the username is present in the session
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // User is logged in, fetch additional user data
  const username = req.session.username;

  try {
    const user = await baza.korisnik.findOne({ where: {username: username} });

    if (!user) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Send user data
    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password, // Should exclude the password for security reasons
      admin: user.admin
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Allows logged user to make a request for a property
*/
app.post('/upit', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { nekretnina_id, tekst_upita } = req.body;

  try {
    const loggedInUser = await baza.korisnik.findOne({ where: {username: req.session.username} });
    const nekretnina = await baza.nekretnina.findOne({ where: {id: nekretnina_id} });

    if (!nekretnina) {
      // Property not found
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
    }

    let upitiZaUsera = await baza.upit.findAll({ 
      where: {
        [Sequelize.Op.and]: [
          {nekretnina_id: nekretnina_id},
          {korisnik_id: loggedInUser.id}
        ]
      }
    });

    if (upitiZaUsera && upitiZaUsera.length >= 3){
      return res.status(429).json({ greska: "Previse upita za istu nekretninu." });
    }

    await baza.upit.create({
      nekretnina_id: nekretnina_id,
      korisnik_id: loggedInUser.id,
      tekst: tekst_upita
    });

    res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Updates any user field
*/
app.put('/korisnik', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.username) {
    // User is not logged in
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  // Get data from the request body
  const { ime, prezime, username, password } = req.body;

  try {
    const loggedInUser = await baza.korisnik.findOne({ where: {username: req.session.username} });

    if (!loggedInUser) {
      // User not found (should not happen if users are correctly managed)
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    // Update user data with the provided values
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      loggedInUser.password = hashedPassword;
    }

    loggedInUser.save();

    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/*
Returns all properties from the file.
*/
app.get('/nekretnine', async (req, res) => {
  try {
    const nekretnineData = await baza.nekretnina.findAll();
    res.json(nekretnineData);
  } catch (error) {
    console.error('Error fetching properties data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
/*app.post('/marketing/nekretnine', async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile('preferencije');

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error('Neispravan format podataka u preferencije.json.');
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile('preferencije', preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find((item) => item.id === parseInt(id, 10));

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile('preferencije', preferencije);

      res.status(200).json({ success: true, message: 'Broj klikova ažuriran.' });
    } else {
      res.status(404).json({ error: 'Nekretnina nije pronađena.' });
    }
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/pretrage', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/marketing/osvjezi/klikovi', async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON 
    const preferencije = await readJsonFile('preferencije');

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error('Greška prilikom čitanja ili pisanja JSON datoteke:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/

app.get('/nekretnine/top5', async (req, res) => {
  let lokacija = req.query.lokacija;

  try{
    let nekretnine = await baza.nekretnina.findAll({
      where: {lokacija: lokacija},
      order: [['datum_objave', 'DESC']],
      limit: 5
    });

    res.status(200).json(nekretnine);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina za zadanu lokaciju:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/upiti/moji', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try{
    const loggedInUser = await baza.korisnik.findOne({ where: {username: req.session.username} });
    const upiti = await baza.upit.findAll({ where: {korisnik_id: loggedInUser.id} });

    if(!upiti){
      return res.status(404).json([]);
    }
    else{
      return res.status(200).json(upiti);
    }
  } catch (error) {
    console.error('Greška prilikom dohvaćanja korisnika ili nekretnina')
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/nekretnina/:id', async (req, res) => {
  const { id } = req.params;

  try{
    const nekretnina = await baza.nekretnina.findOne({ where: { id: id } });

    if(!nekretnina) {
      return res.status(404).json({ greska: 'Nije pronađena nekretnina pod ovim id-em' });
    }

    let upiti = await baza.upit.findAll({ where: {nekretnina_id: id} });
    upiti = upiti.reverse().slice(0, 3);

    res.status(200).json({ ...nekretnina.toJSON(), upiti });
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina')
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/next/upiti/nekretnina/:id', async(req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page);

  if(isNaN(page) || page < 0) {
    return res.status(404).json([]);
  }

  try{
    const upiti = await baza.upit.findAll({ where: {nekretnina_id: id} });

    let upitiPage = upiti.reverse().slice(3 * page, 3 * (page + 1));
    if(upitiPage.length != 0) {
      res.status(200).json(upitiPage);
    }
    else{
      res.status(404).json(upitiPage);
    }
  } catch (error) {
    console.error('Greška prilikom dohvaćanja nekretnina')
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});


app.get('/nekretnina/:id/interesovanja', async(req, res) => {
  const { id } = req.params;

  try {
    const nekretnina = await baza.nekretnina.findOne({ where: {id: id} });
    if(!nekretnina){
      return res.status(404).json({ greska: 'Nije pronađena nekretnina pod ovim id-em' });
    }

    let interesovanja = await nekretnina.getInteresovanja();
    interesovanja = interesovanja.map(i => i.toJSON());

    if(!req.session.username){
      interesovanja = interesovanja.map(i => {
        if("cijenaPonude" in i){
          delete i.cijenaPonude;
        }
        return i;
      });
    }
    else{
      const korisnik = await baza.korisnik.findOne({ where: {username: req.session.username} });

      if(!korisnik.admin){
        interesovanja = await Promise.all(
          interesovanja.map(async i => {
            if("cijenaPonude" in i && korisnik.id != i.korisnik_id){
              const vezanaPonuda = await baza.ponuda.findOne({ where: {id: i.vezana_ponuda_id} });
  
              if(!vezanaPonuda || korisnik.id != vezanaPonuda.korisnik_id){
                delete i.cijenaPonude;
              }
            }
            return i;
          })
        ); 
      }
    }

    return res.status(200).json(interesovanja);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.post('/nekretnina/:id/ponuda', async(req, res) => {
  const { id } = req.params;
  const ponuda = req.body;

  if(!req.session.username){
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try{
    const korisnik = await baza.korisnik.findOne({ where: {username: req.session.username} });
    
    let novaPonuda = {
      nekretnina_id: parseInt(id, 10),
      korisnik_id: korisnik.id,
      tekst: ponuda.tekst,
      cijenaPonude: ponuda.ponudaCijene,
      datumPonude: new Date(ponuda.datumPonude),
      odbijenaPonuda: ponuda.odbijenaPonuda 
    };

    if(ponuda.idVezanePonude == null){
      novaPonuda.vezana_ponuda_id = null;
    }
    else{
      let ponudaZaKojuJeVezana = await baza.ponuda.findOne({ where: {id: ponuda.idVezanePonude} });
      
      if(ponudaZaKojuJeVezana.odbijenaPonuda){
        return res.status(400).json({ greska: 'Ne mogu se vezati nove ponude u lanac odbijenih ponuda!' });
      }

      if(ponudaZaKojuJeVezana.vezana_ponuda_id == null){
        if(!korisnik.admin && ponudaZaKojuJeVezana.korisnik_id != korisnik.id){
          return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        novaPonuda.vezana_ponuda_id = ponudaZaKojuJeVezana.id;

        if(ponuda.odbijenaPonuda){
          ponudaZaKojuJeVezana.odbijenaPonuda = true;
          await ponudaZaKojuJeVezana.save();
        }
      }
      else{
        let korijenskaPonuda = await baza.ponuda.findOne({ where: {id: ponudaZaKojuJeVezana.vezana_ponuda_id} });

        if(korijenskaPonuda.odbijenaPonuda){
          return res.status(400).json({ greska: 'Ne mogu se vezati nove ponude u lanac odbijenih ponuda!' });
        }

        if(!korisnik.admin && korijenskaPonuda.korisnik_id != korisnik.id){
          return res.status(401).json({ greska: 'Neautorizovan pristup' });
        }

        novaPonuda.vezana_ponuda_id = korijenskaPonuda.id;

        if(ponuda.odbijenaPonuda){
          korijenskaPonuda.odbijenaPonuda = true;
          await korijenskaPonuda.save();
        }
      }
    }

    await baza.ponuda.create(novaPonuda);
    res.status(200).json({ poruka: 'Uspješno dodana ponuda!' });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.post('/nekretnina/:id/zahtjev', async(req, res) => {
  const { id } = req.params;
  const zahtjev = req.body;

  if(!req.session.username){
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try{    
    if(new Date(zahtjev.trazeniDatum) < Date.now()){
      return res.status(404).json({ greska: 'Traženi datum ne može biti raniji od trenutnog datuma' });
    }

    const nekretnina = await baza.nekretnina.findOne({ where: {id: id} });
    if(!nekretnina){
      return res.status(404).json({ greska: 'Ne postoji nekretnina sa zadanim id-em' });
    }

    const korisnik = await baza.korisnik.findOne({ where: {username: req.session.username} });

    let noviZahtjev = {
      nekretnina_id: parseInt(id, 10),
      korisnik_id: korisnik.id,
      tekst: zahtjev.tekst,
      trazeniDatum: new Date(zahtjev.trazeniDatum),
      odobren: null
    };

    await baza.zahtjev.create(noviZahtjev);
    res.status(200).json({ poruka: 'Uspješno dodan zahtjev!' });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.put('/nekretnina/:id/zahtjev/:zid', async(req, res) => {
  const { id, zid } = req.params;
  const odgovor = req.body;

  if(!req.session.username){
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try{
    const nekretnina = await baza.nekretnina.findOne({ where: {id: id} });
    if(!nekretnina){
      return res.status(404).json({ greska: 'Ne postoji nekretnina sa zadanim id-em' });
    }

    let zahtjev = await baza.zahtjev.findOne({ where: {id: zid} });
    if(!zahtjev){
      return res.status(404).json({ greska: 'Ne postoji zahtjev sa zadanim id-em' });
    }

    const korisnik = await baza.korisnik.findOne({ where: {username: req.session.username} });
    if(!korisnik.admin){
      return res.status(401).json({ greska: 'Potrebne su administratorske privilegije' });
    }

    if(!odgovor.odobren && odgovor.addToTekst == null){
      return res.status(400).json({ greska: 'Potrebno je proslijediti neki tekst ukoliko zahtjev nije odobren' });
    }

    zahtjev.odobren = odgovor.odobren;
    zahtjev.tekst = zahtjev.tekst.concat(" ODGOVOR ADMINA: ", odgovor.addToTekst);
    await zahtjev.save();

    return res.status(200).json({ poruka: 'Uspješno izmijenjen zahtjev' });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

//dodano za potrebe detalji.js

app.get('/korisnik/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await baza.korisnik.findOne({ where: {id: id} });

    if (!user) {
      return res.status(401).json({ greska: 'Neautorizovan pristup' });
    }

    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password 
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});


app.get('/nekretnina/:id/ponude/korisnik', async(req, res) => {
  const { id } = req.params;

  try{
    const korisnik = await baza.korisnik.findOne({ where: {username: req.session.username} });

    let ponude = [];

    if(korisnik.admin){
      ponude = await baza.ponuda.findAll({
        where: {
          [Sequelize.Op.and]: [
            {nekretnina_id: id},
            {vezana_ponuda_id: null},
            {odbijenaPonuda: false}
          ]
        }
      });
    }
    else{
      ponude = await baza.ponuda.findAll({
        where: {
          [Sequelize.Op.and]: [
            {nekretnina_id: id},
            {korisnik_id: korisnik.id},
            {vezana_ponuda_id: null},
            {odbijenaPonuda: false}
          ]
        }
      });
    }

    if(!ponude || ponude.length == 0){
      return res.status(404).json({ poruka: 'Korisnik nema ranijih ponuda za ovu nekretninu' });
    }

    let ponudePlusVezane = [...ponude];

    for(let p of ponude){
      let vezane = await baza.ponuda.findAll({
        where: {
          [Sequelize.Op.and]: [
            {nekretnina_id: id},
            {vezana_ponuda_id: p.id}
          ]
        }
      });

      ponudePlusVezane.push(...vezane);
    }
    
    res.status(200).json(ponudePlusVezane);
  }
  catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/nekretnina/:id/zahtjevi', async(req, res) => {
  const { id } = req.params;
  
  try{
    let zahtjevi = await baza.zahtjev.findAll({
      where: {
        [Sequelize.Op.and]: [
          {nekretnina_id: id},
          {odobren: null}
        ]
      }
    });

    if(!zahtjevi || zahtjevi.length == 0){
      return res.status(404).json({ poruka: 'Nema neodgovorenih zahtjeva za ovu nekretninu' });
    }
    else{
      return res.status(200).json(zahtjevi);
    }
  }
  catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

app.get('/zahtjev/:zid', async(req, res) => {
  const { zid } = req.params;

  try{
    let zahtjev = await baza.zahtjev.findOne({ where: {id: zid} });
    res.status(200).json(zahtjev);
  }
  catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ greska: 'Internal Server Error' });
  }
});

//============================

// Start server
async function startServer() {
  try {
    await baza.sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
  catch(error) {
    console.error(`Error ${error} while starting server`);
  }
}

startServer();
