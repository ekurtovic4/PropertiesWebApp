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
        vezana_ponuda_id: Sequelize.INTEGER
    },
    {
        tableName: 'Ponuda'
    });

    Object.defineProperty(Ponuda.prototype, 'vezanePonude', {
        get: async function () {
            if(this.vezana_ponuda_id == null){
                return [];
            }
            return await Ponuda.findAll({
                where: {
                    [Sequelize.Op.and]: [
                        {vezana_ponuda_id: this.vezana_ponuda_id}, 
                        {id: {[Sequelize.Op.ne]: this.id}}
                    ]
                }
            });
        }
    });
    
    return Ponuda;
}
