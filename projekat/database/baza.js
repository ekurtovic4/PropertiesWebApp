const Sequelize = require("sequelize");
const korisnik = require('./korisnik');
const nekretnina = require('./nekretnina');
const ponuda = require('./ponuda');
const upit = require('./upit');
const zahtjev = require('./zahtjev');

const sequelize = new Sequelize("wt24", "root", "password", {
   host: "127.0.0.1",
   dialect: "mysql"
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

module.exports = baza;