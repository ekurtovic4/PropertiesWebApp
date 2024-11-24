const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 32000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2009.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2003.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Kuća",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

let periodi = [];
let rasponiCijena = [];

function dodajPeriod() {
    let odPeriod = parseInt(document.getElementById("odPeriod").value);
    let doPeriod = parseInt(document.getElementById("doPeriod").value);

    document.getElementById("odPeriod").value = "";
    document.getElementById("doPeriod").value = "";

    if(isNaN(odPeriod) || isNaN(doPeriod) || !(odPeriod <= doPeriod) || odPeriod <= 0 || doPeriod <= 0){
        alert("Unos granica vremenskog perioda nije validan!");
        return;
    }

    periodi.push({
        od: odPeriod,
        do: doPeriod
    });
}

function dodajRaspon() {
    let odCijena = parseInt(document.getElementById("odCijena").value);
    let doCijena = parseInt(document.getElementById("doCijena").value);

    document.getElementById("odCijena").value = "";
    document.getElementById("doCijena").value = "";

    if(isNaN(odCijena) || isNaN(doCijena) || !(odCijena <= doCijena) || odCijena <= 0 || doCijena <= 0){
        alert("Unos granica cjenovnog raspona nije validan!");
        return;
    }

    rasponiCijena.push({
        od: odCijena,
        do: doCijena
    });
}

let statistika = StatistikaNekretnina();
statistika.init(listaNekretnina, listaKorisnika);

function iscrtajHistogram(){
    let dataUkupno = statistika.histogramCijena(periodi, rasponiCijena);
    let htmlContent = "";
    let dataZaKreiranjeHistograma = [];

    periodi.forEach((period, indeksPerioda) => {
        let dataZaPeriod = dataUkupno.filter(element => {
            return element.indeksPerioda == indeksPerioda;
        });

        let labels = [];
        let data = [];

        for(element of dataZaPeriod){
            labels.push(rasponiCijena[element.indeksRasponaCijena].od + "-" + rasponiCijena[element.indeksRasponaCijena].do);
            data.push(element.brojNekretnina);
        }

        htmlContent += "<canvas id=\"histogram" + indeksPerioda + "\"></canvas>";
        
        dataZaKreiranjeHistograma.push({
            id: "histogram" + indeksPerioda,
            labels: labels,
            data: data,
            title: period.od + "-" + period.do
        });
    });

    document.getElementById("histogram").innerHTML = htmlContent;

    for(element of dataZaKreiranjeHistograma){
        let canvas = document.getElementById(element.id);

        if(canvas){
            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: element.labels,
                    datasets: [{
                        label: 'Broj nekretnina',
                        data: element.data,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: element.title,
                            font: {
                                size: 20
                            },
                            padding: {
                                top: 10,
                                bottom: 20
                            },
                            color: 'black'
                        }
                    }
                }
            });
        }
    }

    periodi.length = 0;
    rasponiCijena.length = 0;
}

function prikaziUnos(tip){
    if(tip == 'kvadratura'){
        let kriterij = document.getElementById("kvadraturaKriterij").value;
        document.getElementById("tipNekretnineSelect").style.display = "none";
        document.getElementById("kvadraturaKriterijVrijednost").style.display = "none";

        if(kriterij == "tip_nekretnine"){
            document.getElementById("tipNekretnineSelect").style.display = "inline";
        }
        else{
            document.getElementById("kvadraturaKriterijVrijednost").style.display = "inline";
        }
    }
    else if(tip == 'outlier'){
        let kriterij = document.getElementById("outlierKriterij").value;
        document.getElementById("outlierTipNekretnineSelect").style.display = "none";
        document.getElementById("outlierKriterijVrijednost").style.display = "none";

        if(kriterij == "tip_nekretnine"){
            document.getElementById("outlierTipNekretnineSelect").style.display = "inline";
        }
        else{
            document.getElementById("outlierKriterijVrijednost").style.display = "inline";
        }
    }
}

function prosjecnaKvadratura(){
    let kriterij = document.getElementById("kvadraturaKriterij").value;
    let vrijednost;

    if(kriterij != "tip_nekretnine"){
        vrijednost = parseInt(document.getElementById("kvadraturaKriterijVrijednost").value);
        if(vrijednost < 0){
            alert("Unesena vrijednost kriterija nije validna!");
            return;
        }
    }
    else{
        vrijednost = document.getElementById("tipNekretnineSelect").value;
    }

    let kriterijObjekat = {};
    kriterijObjekat[kriterij] = vrijednost;

    let result = statistika.prosjecnaKvadratura(kriterijObjekat);

    if(result != -1){
        document.getElementById("prosjecnaKvadraturaOdgovor").innerHTML = "<p>Prosječna kvadratura za zadani kriterij: " + result + "</p>";
    }
    else{
        document.getElementById("prosjecnaKvadraturaOdgovor").innerHTML = "<p>Greška pri izračunu!</p>";
    }
}

function outlier(){
    let kriterij = document.getElementById("outlierKriterij").value;
    let vrijednost;

    if(kriterij != "tip_nekretnine"){
        vrijednost = parseInt(document.getElementById("outlierKriterijVrijednost").value);
        if(vrijednost < 0){
            alert("Unesena vrijednost kriterija nije validna!");
            return;
        }
    }
    else{
        vrijednost = document.getElementById("outlierTipNekretnineSelect").value;
    }

    let kriterijObjekat = {};
    kriterijObjekat[kriterij] = vrijednost;
    let nazivSvojstva = document.getElementById("svojstvoSelect").value;

    let result = statistika.outlier(kriterijObjekat, nazivSvojstva);
    let htmlContent = "";

    if(result === null){
        htmlContent += "<p>Nema outliera za zadani kriterij!</p>"
    }
    else{
        htmlContent += "<p>Tip nekretnine: " + result.tip_nekretnine + "</p><p>Naziv: " + result.naziv + "</p><p>Kvadratura: " + result.kvadratura + "</p><p>Cijena: " + result.cijena + "</p>";
    }

    document.getElementById("outlierOdgovor").innerHTML = htmlContent;
}

function mojeNekretnine(){
    let idKorisnika = parseInt(document.getElementById("idUnos").value);
    let htmlContent = "";

    if(isNaN(idKorisnika)){
        alert("Uneseni ID korisnika nije validan!");
        return;
    }

    let korisnik = listaKorisnika.find(kor => kor.id == idKorisnika);
    if(korisnik){
        let resultList = statistika.mojeNekretnine(korisnik);
        if(resultList.length != 0){
            htmlContent += "<table><th>Tip</th><th>Naziv</th><th>Kvadratura</th><th>Cijena</th>";
            
            for(result of resultList){
                htmlContent += "<tr><td>" + result.tip_nekretnine + "</td><td>" + result.naziv + "</td><td>" + result.kvadratura + "</td><td>" + result.cijena + "</td></tr>";
            }
        }
        else{
            htmlContent += "Nema rezultata za traženog korisnika!";
        }
    }
    else{
        htmlContent += "Traženi korisnik ne postoji!"
    }  

    document.getElementById("mojeNekretnineOdgovor").innerHTML = htmlContent;
}
