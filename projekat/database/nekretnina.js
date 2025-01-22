const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

module.exports = function (sequelize, DataTypes) {
    const Nekretnina = sequelize.define('Nekretnina', {
        tip_nekretnine: Sequelize.STRING,
        naziv: Sequelize.STRING,
        kvadratura: Sequelize.INTEGER,
        cijena: Sequelize.INTEGER,
        tip_grijanja: Sequelize.STRING,
        lokacija: Sequelize.STRING,
        godina_izgradnje: Sequelize.INTEGER,
        datum_objave: Sequelize.DATE,
        opis: Sequelize.STRING
    },
    {
        tableName: 'Nekretnina'
    },
    {
        instanceMethods: {
            async getInteresovanja() {
                const upiti = await this.getUpiti();
                const zahtjevi = await this.getZahtjevi();
                const ponude = await this.getPonude();

                return upiti.concat(zahtjevi, ponude);
            }
        }
    });
    
   return Nekretnina;
}
