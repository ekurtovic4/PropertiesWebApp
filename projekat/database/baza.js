const Sequelize = require("sequelize");
const korisnik = require('./korisnik');
const nekretnina = require('./nekretnina');
const ponuda = require('./ponuda');
const upit = require('./upit');
const zahtjev = require('./zahtjev');

const sequelize = new Sequelize("wt24", "root", "password", {
   host: "mysql-db",
   dialect: "mysql",
   port: '3306',
   logging: false,
   retry: {
      max: 10, // Number of connection attempts
      backoffBase: 1000, // Initial retry delay in ms
      backoffExponent: 1.5, // Exponential backoff factor
   }
});

const baza = {}

baza.Sequelize = Sequelize;  
baza.sequelize = sequelize;

baza.korisnik = korisnik(sequelize);
baza.nekretnina = nekretnina(sequelize);
baza.ponuda = ponuda(sequelize);
baza.upit = upit(sequelize);
baza.zahtjev = zahtjev(sequelize);

baza.nekretnina.hasMany(baza.ponuda, { as: 'ponude', foreignKey: 'nekretnina_id' });
baza.nekretnina.hasMany(baza.upit, { as: 'upiti', foreignKey: 'nekretnina_id' });
baza.nekretnina.hasMany(baza.zahtjev, { as: 'zahtjevi', foreignKey: 'nekretnina_id' });

baza.korisnik.hasMany(baza.ponuda, { as: 'ponude', foreignKey: 'korisnik_id' });
baza.korisnik.hasMany(baza.upit, { as: 'upiti', foreignKey: 'korisnik_id' });
baza.korisnik.hasMany(baza.zahtjev, { as: 'zahtjevi', foreignKey: 'korisnik_id' });

baza.ponuda.hasMany(baza.ponuda, { as: 'ponudeKojimaJeKorijen', foreignKey: 'vezana_ponuda_id' });

// Initialize DB
async function addNekretnine() {
   const nekretnineData = [
      {
        tip_nekretnine: "Stan",
        naziv: "Luksuzni apartman u centru",
        kvadratura: 85,
        cijena: 150000,
        tip_grijanja: "Centralno",
        lokacija: "Sarajevo",
        godina_izgradnje: 2015,
        datum_objave: new Date(),
        opis: "Prelijep stan u srcu grada sa pogledom na rijeku.",
      },
      {
        tip_nekretnine: "Kuća",
        naziv: "Porodična kuća sa dvorištem",
        kvadratura: 200,
        cijena: 250000,
        tip_grijanja: "Podno grijanje",
        lokacija: "Banja Luka",
        godina_izgradnje: 2010,
        datum_objave: new Date(),
        opis: "Prostrana kuća sa velikim dvorištem i garažom.",
      }
    ];

   try{
      await Promise.all(nekretnineData.map((nekretnina) => {
         return baza.nekretnina.create(nekretnina);
      }));
      console.log("Nekretnina table filled!");
   } catch(err){
      console.error(err);
      throw err;
   }
}

async function addKorisnici() {
   const korisniciData = [
      {
        ime: "Prvi",
        prezime: "Korisnik",
        username: "prvikorisnik",
        password: "$2a$10$0tzFgdJT8io3gRHqvROUPuy0SE02pKKXejlgpzkoU1DfyQrTVJpxq",
        admin: false,
      },
      {
       ime: "Drugi",
       prezime: "Korisnik",
       username: "drugikorisnik",
       password: "$2a$10$0tzFgdJT8io3gRHqvROUPuy0SE02pKKXejlgpzkoU1DfyQrTVJpxq",
       admin: true
     }
    ];

   try{
      await Promise.all(korisniciData.map((korisnik) => {
         return baza.korisnik.create(korisnik);
      }));
      console.log("Korisnik table filled!");
   } catch(err){
      console.error(err);
      throw err;
   }
}

module.exports = {baza, addNekretnine, addKorisnici};