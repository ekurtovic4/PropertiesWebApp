const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

module.exports = function (sequelize, DataTypes) {
    const Korisnik = sequelize.define('Korisnik', {
        ime: Sequelize.STRING,
        prezime: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        admin: Sequelize.BOOLEAN
    },
    {
        tableName: 'Korisnik'
    });
    
   return Korisnik;
}
