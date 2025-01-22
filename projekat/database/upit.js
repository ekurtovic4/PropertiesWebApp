const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

module.exports = function (sequelize, DataTypes) {
    const Upit = sequelize.define('Upit', {
        nekretnina_id: Sequelize.INTEGER,
        korisnik_id: Sequelize.INTEGER,
        tekst: Sequelize.STRING
    },
    {
        tableName: 'Upit'
    });
    
   return Upit;
}
