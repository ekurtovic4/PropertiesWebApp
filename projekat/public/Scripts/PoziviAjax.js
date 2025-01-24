const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    function ajaxRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback({ status: xhr.status, statusText: xhr.statusText }, null);
                }
            }
        };
        xhr.send(data ? JSON.stringify(data) : null);
    }

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback("error", null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/korisnik/", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }
        ajax.open("PUT", "http://localhost:3000/korisnik", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        forSend = JSON.stringify(noviPodaci)
        ajax.send(forSend)
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4 && ajax.status == 429) {
                fnCallback({ status: 429, statusText: "Već ste postavili maksimum od 3 upita za ovu nekretninu!" }, null);
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }
        ajax.open("POST", "http://localhost:3000/upit", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "nekretnina_id": nekretnina_id,
            "tekst_upita": tekst_upita
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_getNekretnine(fnCallback) {
        // Koristimo AJAX poziv da bismo dohvatili podatke s servera
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            // Ako se dogodi greška pri dohvaćanju podataka, proslijedi grešku kroz callback
            if (error) {
                fnCallback(error, null);
            } else {
                // Ako su podaci uspješno dohvaćeni, parsiraj JSON i proslijedi ih kroz callback
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    // Ako se dogodi greška pri parsiranju JSON-a, proslijedi grešku kroz callback
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }
        ajax.open("POST", "http://localhost:3000/login", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "username": username,
            "password": password
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback(ajax.statusText, null)
            }
        }
        ajax.open("POST", "http://localhost:3000/logout", true)
        ajax.send()
    }

    function getTop5Nekretnina(lokacija, fnCallback) {
        let lokacijaParam = encodeURIComponent(lokacija);
        
        ajaxRequest('GET', '/nekretnine/top5?lokacija=' + lokacijaParam, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const nekretnine = JSON.parse(data);
                    fnCallback(null, nekretnine);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function getMojiUpiti(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    try{
                        fnCallback(null, JSON.parse(ajax.responseText));
                    } catch (parseError) {
                        fnCallback(parseError, null);
                    } 
                } 
                else if (ajax.status == 401) {
                    fnCallback({ status: 401, statusText: 'Neautorizovan pristup!' }, null);
                } 
                else if(ajax.status == 404) {
                    fnCallback({ status: 404, statusText: 'Nema upita za ovog korisnika!' }, null);
                } 
                else {
                    fnCallback({ status: xhr.status, statusText: xhr.statusText }, null);                    
                }
            }
        };

        ajax.open("GET", "http://localhost:3000/upiti/moji", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function getNekretnina(nekretnina_id, fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    try{
                        fnCallback(null, JSON.parse(ajax.responseText));
                    } catch (parseError) {
                        fnCallback(parseError, null);
                    } 
                } 
                else if(ajax.status == 404) {
                    fnCallback({ status: 404, statusText: 'Nije pronađena nekretnina pod ovim id-em!' }, null);
                } 
                else {
                    fnCallback({ status: xhr.status, statusText: xhr.statusText }, null);                    
                }
            }
        };

        let idParam = encodeURIComponent(nekretnina_id);
        ajax.open("GET", "http://localhost:3000/nekretnina/" + idParam, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }

    function getNextUpiti(nekretnina_id, page, fnCallback) {        
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    try{
                        fnCallback(null, JSON.parse(ajax.responseText));
                    } catch (parseError) {
                        fnCallback(parseError, null);
                    } 
                } 
                else if(ajax.status == 404) {
                    fnCallback({ status: 404, statusText: 'Nema upita na traženom page-u!' }, null);
                } 
                else {
                    fnCallback({ status: xhr.status, statusText: xhr.statusText }, null);                    
                }
            }
        };

        let pageParam = encodeURIComponent(page);
        let idParam = encodeURIComponent(nekretnina_id);
        ajax.open("GET", "http://localhost:3000/next/upiti/nekretnina/" + idParam + "?page=" + pageParam, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
    }


    function impl_postZahtjev(nekretnina_id, tekst_zahtjeva, trazeni_datum, fnCallback) {
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4 && ajax.status == 404) {
                fnCallback({ status: 404, statusText: JSON.parse(ajax.response).greska }, null);
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }

        let idParam = encodeURIComponent(nekretnina_id);
        ajax.open("POST", "http://localhost:3000/nekretnina/" + idParam + "/zahtjev", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "tekst": tekst_zahtjeva,
            "trazeniDatum": trazeni_datum
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_postPonuda(nekretnina_id, tekst_ponude, cijena_ponude, datum_ponude, id_vezane_ponude, odbijena, fnCallback){
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4 && ajax.status == 400) {
                fnCallback({ status: 404, statusText: JSON.parse(ajax.response).greska }, null);
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }

        let idParam = encodeURIComponent(nekretnina_id);
        ajax.open("POST", "http://localhost:3000/nekretnina/" + idParam + "/ponuda", true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "tekst": tekst_ponude,
            "ponudaCijene": cijena_ponude,
            "datumPonude": datum_ponude,
            "odbijenaPonuda": odbijena,
            "idVezanePonude": id_vezane_ponude
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_putZahtjev(nekretnina_id, zahtjev_id, odobren, addToTekst, fnCallback){
        var ajax = new XMLHttpRequest()

        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response)
            }
            else if (ajax.readyState == 4) {
                //desio se neki error
                fnCallback({ status: ajax.status, statusText: ajax.statusText }, null);
            }
        }

        let idParam = encodeURIComponent(nekretnina_id);
        let zidParam = encodeURIComponent(zahtjev_id);
        ajax.open("PUT", "http://localhost:3000/nekretnina/" + idParam + "/zahtjev/" + zidParam, true)
        ajax.setRequestHeader("Content-Type", "application/json")
        var objekat = {
            "odobren": odobren,
            "addToTekst": addToTekst
        }
        forSend = JSON.stringify(objekat)
        ajax.send(forSend)
    }

    function impl_getInteresovanja(nekretnina_id, fnCallback) {
        let idParam = encodeURIComponent(nekretnina_id);

        ajaxRequest('GET', '/nekretnina/' + idParam + '/interesovanja', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const interesovanja = JSON.parse(data);
                    fnCallback(null, interesovanja);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    //dodano za potrebe detalji.js

    function getKorisnikById(korisnik_id, fnCallback) {
        let idParam = encodeURIComponent(korisnik_id);

        ajaxRequest('GET', '/korisnik/' + idParam, null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const korisnik = JSON.parse(data);
                    fnCallback(null, korisnik);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }


    function getPonudeForKorisnik(nekretnina_id, fnCallback){
        let idParam = encodeURIComponent(nekretnina_id);

        ajaxRequest('GET', '/nekretnina/' + idParam + '/ponude/korisnik', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const ponude = JSON.parse(data);
                    fnCallback(null, ponude);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function getZahtjeviForNekretnina(nekretnina_id, fnCallback){
        let idParam = encodeURIComponent(nekretnina_id);

        ajaxRequest('GET', '/nekretnina/' + idParam + '/zahtjevi', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    const ponude = JSON.parse(data);
                    fnCallback(null, ponude);
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    //============================

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina: getTop5Nekretnina,
        getMojiUpiti: getMojiUpiti,
        getNekretnina: getNekretnina,
        getNextUpiti: getNextUpiti,
        getKorisnikById: getKorisnikById,
        postZahtjev: impl_postZahtjev,
        postPonuda: impl_postPonuda,
        getPonudeForKorisnik: getPonudeForKorisnik,
        putZahtjev: impl_putZahtjev,
        getZahtjeviForNekretnina: getZahtjeviForNekretnina,
        getInteresovanja: impl_getInteresovanja
    };
})();