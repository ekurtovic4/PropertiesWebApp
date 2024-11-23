StatistikaNekretnina = function(){
    let spisakNekretnina;

    let init = function(listaNekretnina, listaKorisnika){
        spisakNekretnina = SpisakNekretnina();
        spisakNekretnina.init(listaNekretnina, listaKorisnika);
    }

    let prosjecnaKvadratura = function(kriterij){
        if(!("tip_nekretnine" in kriterij || "min_kvadratura" in kriterij || "max_kvadratura" in kriterij || "min_cijena" in kriterij || "max_cijena" in kriterij)){
            return -1;
        }

        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);

        let suma = 0;
        for(nekretnina of filtriraneNekretnine){
            suma += nekretnina.kvadratura;
        }

        return suma / filtriraneNekretnine.length;
    }

    let outlier = function(kriterij, nazivSvojstva){
        if(!("tip_nekretnine" in kriterij || "min_kvadratura" in kriterij || "max_kvadratura" in kriterij || "min_cijena" in kriterij || "max_cijena" in kriterij) 
            || !(nazivSvojstva == "kvadratura" || nazivSvojstva == "cijena" || nazivSvojstva == "godina_izgradnje")){
            return null;
        }

        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);

        let prosjek = 0;
        for(nekretnina of filtriraneNekretnine){
            prosjek += nekretnina[nazivSvojstva];
        }
        prosjek /= filtriraneNekretnine.length;

        let outlier = { nekretnina: null, odstupanje: 0 };
        for(nekretnina of filtriraneNekretnine){
            if(Math.abs(nekretnina[nazivSvojstva] - prosjek) > outlier.odstupanje){
                outlier.nekretnina = nekretnina;
                outlier.odstupanje = Math.abs(nekretnina[nazivSvojstva] - prosjek);
            }
        }

        return outlier.nekretnina;
    }

    let mojeNekretnine = function(korisnik){
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine({}).filter(nekretnina => {
            return (nekretnina.upiti.some(upit => upit.korisnik_id == korisnik.id));
        });

        let sortiraneNekretnine = filtriraneNekretnine.sort((a, b) => b.upiti.length - a.upiti.length);
        return sortiraneNekretnine;
    }

    let histogramCijena = function(periodi, rasponiCijena){
        let sveNekretnine = spisakNekretnina.filtrirajNekretnine({});
        let povratniNiz = [];

        periodi.forEach((period, indeksPerioda) => {
            let filtriraneNekretninePeriod = sveNekretnine.filter(nekretnina => {
                let godinaObjave = nekretnina["datum_objave"].substring(6, 10);
                return (godinaObjave >= period.od && godinaObjave < period.do);
            });

            rasponiCijena.forEach((raspon, indeksRasponaCijena) => {
                let brojURasponu = 0;
                for(nekretnina of filtriraneNekretninePeriod){
                    if(nekretnina.cijena >= raspon.od && nekretnina.cijena < raspon.do){
                        brojURasponu++;
                    }
                }

                povratniNiz.push({
                    indeksPerioda: indeksPerioda,
                    indeksRasponaCijena: indeksRasponaCijena,
                    brojNekretnina: brojURasponu
                });
            });
        });

        return povratniNiz;
    }

    return {
        init: init,
        prosjecnaKvadratura: prosjecnaKvadratura,
        outlier: outlier,
        mojeNekretnine: mojeNekretnine,
        histogramCijena: histogramCijena
    }
}