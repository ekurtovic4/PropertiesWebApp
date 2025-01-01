let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];


    //implementacija metoda
    let init = function (listaNekretnina, listaKorisnika) {
        this.listaNekretnina = listaNekretnina;
        this.listaKorisnika = listaKorisnika;
    }

    let filtrirajNekretnine = function (kriterij) {
        return this.listaNekretnina.filter(nekretnina => {
            // Filtriranje po tipu nekretnine
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
                return false;
            }

            // Filtriranje po minimalnoj kvadraturi
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                return false;
            }

            // Filtriranje po maksimalnoj kvadraturi
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
                return false;
            }

            // Filtriranje po minimalnoj cijeni
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
                return false;
            }

            // Filtriranje po maksimalnoj cijeni
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                return false;
            }
            
            // Dodatno filtriranje po id-u
            if (kriterij.id && nekretnina.id != kriterij.id) {
                return false;
            }

            // Dodatno filtriranje po nazivu
            if (kriterij.naziv && nekretnina.naziv != kriterij.naziv) {
                return false;
            }

            // Dodatno filtriranje po tipu grijanja
            if (kriterij.tip_grijanja && nekretnina.tip_grijanja != kriterij.tip_grijanja) {
                return false;
            }

            // Dodatno filtriranje po lokaciji
            if (kriterij.lokacija && nekretnina.lokacija != kriterij.lokacija) {
                return false;
            }

            // Dodatno filtriranje po godini izgradnje
            if(kriterij.godina_izgradnje && nekretnina.godina_izgradnje != kriterij.godina_izgradnje) {
                return false;
            }

            // Dodatno filtriranje po datumu objave
            if(kriterij.datum_objave && nekretnina.datum_objave != kriterij.datum_objave) {
                return false;
            }

            // Dodatno filtriranje po opisu
            if(kriterij.opis && nekretnina.opis != kriterij.opis) {
                return false;
            }

            // Dodatno filtriranje po broju upita
            if(kriterij.broj_upita && nekretnina.upiti.length != kriterij.broj_upita) {
                return false;
            }

            return true;
        });
    }

    let ucitajDetaljeNekretnine = function (id) {
        return listaNekretnina.find(nekretnina => nekretnina.id === id) || null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};