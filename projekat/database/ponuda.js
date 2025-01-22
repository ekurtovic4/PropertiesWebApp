const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

module.exports = function (sequelize, DataTypes) {
    const Ponuda = sequelize.define('Ponuda', {
        nekretnina_id: Sequelize.INTEGER,
        korisnik_id: Sequelize.INTEGER,
        tekst: Sequelize.STRING,
        cijenaPonude: Sequelize.INTEGER,
        datumPonude: Sequelize.DATE,
        odbijenaPonuda: Sequelize.BOOLEAN,
        vezana_ponuda_id: Sequelize.INTEGER,
        vezanePonude: {
            type: Sequelize.VIRTUAL,
            get() {
                return this.getVezanePonude();
            }
        }
    },
    {
        tableName: 'Ponuda'
    });

    Ponuda.prototype.getVezanePonude = async function() {
        const ponude = await Ponuda.findAll({ 
            where: {
                [Sequelize.Op.and]: [
                    {vezana_ponuda_id: this.vezana_ponuda_id}, 
                    {id: {[Sequelize.Op.ne]: this.id}}
                ]
            } 
        });
        return ponude;
    };
    
    return Ponuda;
}
