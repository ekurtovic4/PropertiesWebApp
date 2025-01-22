const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

module.exports = function (sequelize, DataTypes) {
    const Zahtjev = sequelize.define('Zahtjev', {
        nekretnina_id: Sequelize.INTEGER,
        korisnik_id: Sequelize.INTEGER,
        tekst: Sequelize.STRING,
        trazeniDatum: Sequelize.DATE,
        odobren: Sequelize.BOOLEAN
    },
    {
        tableName: 'Zahtjev'
    });
    
   return Zahtjev;
}
