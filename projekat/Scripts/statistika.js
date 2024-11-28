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

let statistika = StatistikaNekretnina();
statistika.init(listaNekretnina, listaKorisnika);

let spisak = SpisakNekretnina();
spisak.init(listaNekretnina, listaKorisnika);

let periodi = [];
let rasponiCijena = [];

let kvadraturaKriterijOpcije = document.getElementById("kvadraturaKriterij").innerHTML;
let outlierKriterijOpcije = document.getElementById("outlierKriterij").innerHTML;

function dodajPeriod() {
    let odPeriod = parseInt(document.getElementById("odPeriod").value.trim());
    let doPeriod = parseInt(document.getElementById("doPeriod").value.trim());

    document.getElementById("odPeriod").value = "";
    document.getElementById("doPeriod").value = "";

    if(isNaN(odPeriod) || isNaN(doPeriod) || !(odPeriod <= doPeriod) || odPeriod < 0 || doPeriod < 0){
        alert("Unos granica vremenskog perioda nije validan!");
        return;
    }

    periodi.push({
        od: odPeriod,
        do: doPeriod
    });
}

function dodajRaspon() {
    let odCijena = parseInt(document.getElementById("odCijena").value.trim());
    let doCijena = parseInt(document.getElementById("doCijena").value.trim());

    document.getElementById("odCijena").value = "";
    document.getElementById("doCijena").value = "";

    if(isNaN(odCijena) || isNaN(doCijena) || !(odCijena <= doCijena) || odCijena < 0 || doCijena < 0){
        alert("Unos granica cjenovnog raspona nije validan!");
        return;
    }

    rasponiCijena.push({
        od: odCijena,
        do: doCijena
    });
}

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
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1 
                            }
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
        document.getElementById("kvadraturaKriterijMin").style.display = "none";
        document.getElementById("kvadraturaKriterijMax").style.display = "none";

        if(kriterij == "tip_nekretnine"){
            document.getElementById("tipNekretnineSelect").style.display = "inline";
        }
        else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
            document.getElementById("kvadraturaKriterijMin").style.display = "inline";
            document.getElementById("kvadraturaKriterijMax").style.display = "inline";
        }
        else{
            document.getElementById("kvadraturaKriterijVrijednost").style.display = "inline";
        }
    }
    else if(tip == 'outlier'){
        let kriterij = document.getElementById("outlierKriterij").value;
        document.getElementById("outlierTipNekretnineSelect").style.display = "none";
        document.getElementById("outlierKriterijVrijednost").style.display = "none";
        document.getElementById("outlierKriterijMin").style.display = "none";
        document.getElementById("outlierKriterijMax").style.display = "none";

        if(kriterij == "tip_nekretnine"){
            document.getElementById("outlierTipNekretnineSelect").style.display = "inline";
        }
        else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
            document.getElementById("outlierKriterijMin").style.display = "inline";
            document.getElementById("outlierKriterijMax").style.display = "inline";
        }
        else{
            document.getElementById("outlierKriterijVrijednost").style.display = "inline";
        }
    }
}

let kriterijiProsjecnaKvadratura = [];

function dodajKriterijProsjecnaKvadratura(){
    let kriterij = document.getElementById("kvadraturaKriterij").value;

    if(kriterij == "tip_nekretnine"){
        let kriterijObjekat = {};
        kriterijObjekat[kriterij] = document.getElementById("tipNekretnineSelect").value;
        kriterijiProsjecnaKvadratura.push(kriterijObjekat);
    }
    else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
        let minVr = parseInt(document.getElementById("kvadraturaKriterijMin").value.trim());
        let maxVr = parseInt(document.getElementById("kvadraturaKriterijMax").value.trim());

        if(isNaN(minVr) || isNaN(maxVr) || !(minVr <= maxVr) || minVr < 0 || maxVr < 0){
            alert("Unos granica raspona nije validan!");
            return;
        }

        let kriterijObjekat = {};
        if(kriterij == "raspon_kvadrature"){
            kriterijObjekat["min_kvadratura"] = minVr;
        }
        else{
            kriterijObjekat["min_cijena"] = minVr;
        }
        kriterijiProsjecnaKvadratura.push(kriterijObjekat);

        kriterijObjekat = {};
        if(kriterij == "raspon_kvadrature"){
            kriterijObjekat["max_kvadratura"] = maxVr;
        }
        else{
            kriterijObjekat["max_cijena"] = maxVr;
        }
        kriterijiProsjecnaKvadratura.push(kriterijObjekat);

        document.getElementById("kvadraturaKriterijMin").value = "";
        document.getElementById("kvadraturaKriterijMax").value = "";
    }
    else{
        let kriterijObjekat = {};
        let vrijednost = document.getElementById("kvadraturaKriterijVrijednost").value.trim();

        if(vrijednost == ""){
            alert("Unos vrijednosti kriterija nije validan!");
            return;
        }

        if(kriterij == "id" || kriterij == "godina_izgradnje" || kriterij == "broj_upita"){
            if(parseInt(vrijednost) < 0){
                alert("Unos vrijednosti kriterija nije validan!");
                return;
            }
        }

        if(kriterij == "datum_objave"){
            const regex = /^\d{2}\.\d{2}\.\d{4}\.$/;
            if(!regex.test(vrijednost)){
                alert("Format unesene vrijednosti kriterija nije validan!");
                return;
            }
        }

        if(kriterij == "godina_izgradnje"){
            const regex = /^\d{4}$/;
            if(!regex.test(vrijednost)){
                alert("Format unesene vrijednosti kriterija nije validan!");
                return;
            }
        }

        kriterijObjekat[kriterij] = vrijednost;
        kriterijiProsjecnaKvadratura.push(kriterijObjekat);
        document.getElementById("kvadraturaKriterijVrijednost").value = "";
    }

    ukloniKriterijProsjecnaKvadratura(kriterij);
}

function ukloniKriterijProsjecnaKvadratura(kriterij){
    let kriteriji = document.getElementById("kvadraturaKriterij");
    for(let i = 0; i < kriteriji.options.length; i++){
        if(kriteriji.options[i].value == kriterij){
            kriteriji.remove(i);
            break;
        }
    }

    if(kriterij == "tip_nekretnine"){
        document.getElementById("tipNekretnineSelect").style.display = "none";
    }
    else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
        document.getElementById("kvadraturaKriterijMin").style.display = "none";
        document.getElementById("kvadraturaKriterijMax").style.display = "none";
    }
    else{
        document.getElementById("kvadraturaKriterijVrijednost").style.display = "none";
    }
}

function resetProsjecnaKvadratura(){
    kriterijiProsjecnaKvadratura.length = 0;
    document.getElementById("prosjecnaKvadraturaOdgovor").innerHTML = "";
    document.getElementById("kvadraturaKriterij").innerHTML = kvadraturaKriterijOpcije;
    
    document.getElementById("tipNekretnineSelect").style.display = "inline";
    document.getElementById("kvadraturaKriterijVrijednost").style.display = "none";
    document.getElementById("kvadraturaKriterijMin").style.display = "none";
    document.getElementById("kvadraturaKriterijMax").style.display = "none";
}

function prosjecnaKvadratura(){
    let filtriraneNekretnine = listaNekretnina;

    for(kriterij of kriterijiProsjecnaKvadratura){
        filtriraneNekretnine = spisak.filtrirajNekretnine(kriterij);
        spisak.init(filtriraneNekretnine, listaKorisnika);
    }

    statistika.init(filtriraneNekretnine, listaKorisnika);
    let result = statistika.prosjecnaKvadratura({});

    if(result != -1){
        document.getElementById("prosjecnaKvadraturaOdgovor").innerHTML = "<p>Prosječna kvadratura za zadani kriterij: " + result + "</p>";
    }
    else{
        document.getElementById("prosjecnaKvadraturaOdgovor").innerHTML = "<p>Greška pri izračunu!</p>";
    }

    kriterijiProsjecnaKvadratura.length = 0;
    document.getElementById("kvadraturaKriterij").innerHTML = kvadraturaKriterijOpcije;
}

let kriterijiOutlier = [];

function dodajKriterijOutlier(){
    let kriterij = document.getElementById("outlierKriterij").value;

    if(kriterij == "tip_nekretnine"){
        let kriterijObjekat = {};
        kriterijObjekat[kriterij] = document.getElementById("outlierTipNekretnineSelect").value;
        kriterijiOutlier.push(kriterijObjekat);
    }
    else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
        let minVr = parseInt(document.getElementById("outlierKriterijMin").value.trim());
        let maxVr = parseInt(document.getElementById("outlierKriterijMax").value.trim());

        if(isNaN(minVr) || isNaN(maxVr) || !(minVr <= maxVr) || minVr < 0 || maxVr < 0){
            alert("Unos granica raspona nije validan!");
            return;
        }

        let kriterijObjekat = {};
        if(kriterij == "raspon_kvadrature"){
            kriterijObjekat["min_kvadratura"] = minVr;
        }
        else{
            kriterijObjekat["min_cijena"] = minVr;
        }
        kriterijiOutlier.push(kriterijObjekat);

        kriterijObjekat = {};
        if(kriterij == "raspon_kvadrature"){
            kriterijObjekat["max_kvadratura"] = maxVr;
        }
        else{
            kriterijObjekat["max_cijena"] = maxVr;
        }
        kriterijiOutlier.push(kriterijObjekat);

        document.getElementById("outlierKriterijMin").value = "";
        document.getElementById("outlierKriterijMax").value = "";
    }
    else{
        let kriterijObjekat = {};
        let vrijednost = document.getElementById("outlierKriterijVrijednost").value.trim();
        
        if(vrijednost == ""){
            alert("Unos vrijednosti kriterija nije validan!");
            return;
        }

        if(kriterij == "id" || kriterij == "godina_izgradnje" || kriterij == "broj_upita"){
            if(parseInt(vrijednost) < 0){
                alert("Unos vrijednosti kriterija nije validan!");
                return;
            }
        }

        if(kriterij == "datum_objave"){
            const regex = /^\d{2}\.\d{2}\.\d{4}\.$/;
            if(!regex.test(vrijednost)){
                alert("Format unesene vrijednosti kriterija nije validan!");
                return;
            }
        }

        if(kriterij == "godina_izgradnje"){
            const regex = /^\d{4}$/;
            if(!regex.test(vrijednost)){
                alert("Format unesene vrijednosti kriterija nije validan!");
                return;
            }
        }

        kriterijObjekat[kriterij] = vrijednost;
        kriterijiOutlier.push(kriterijObjekat);
        document.getElementById("outlierKriterijVrijednost").value = "";
    }

    ukloniKriterijOutlier(kriterij);
}

function ukloniKriterijOutlier(kriterij){
    let kriteriji = document.getElementById("outlierKriterij");
    for(let i = 0; i < kriteriji.options.length; i++){
        if(kriteriji.options[i].value == kriterij){
            kriteriji.remove(i);
            break;
        }
    }

    if(kriterij == "tip_nekretnine"){
        document.getElementById("outlierTipNekretnineSelect").style.display = "none";
    }
    else if(kriterij == "raspon_kvadrature" || kriterij == "raspon_cijene"){
        document.getElementById("outlierKriterijMin").style.display = "none";
        document.getElementById("outlierKriterijMax").style.display = "none";
    }
    else{
        document.getElementById("outlierKriterijVrijednost").style.display = "none";
    }        
}

function resetOutlier(){
    kriterijiOutlier.length = 0;
    document.getElementById("outlierOdgovor").innerHTML = "";
    document.getElementById("outlierKriterij").innerHTML = outlierKriterijOpcije;

    document.getElementById("outlierTipNekretnineSelect").style.display = "inline";
    document.getElementById("outlierKriterijVrijednost").style.display = "none";
    document.getElementById("outlierKriterijMin").style.display = "none";
    document.getElementById("outlierKriterijMax").style.display = "none";
}

function outlier(){     
    let filtriraneNekretnine = listaNekretnina;

    for(kriterij of kriterijiProsjecnaKvadratura){
        filtriraneNekretnine = spisak.filtrirajNekretnine(kriterij);
        spisak.init(filtriraneNekretnine, listaKorisnika);
    }

    statistika.init(filtriraneNekretnine, listaKorisnika);

    let nazivSvojstva = document.getElementById("svojstvoSelect").value;
    let result = statistika.outlier({}, nazivSvojstva);

    let htmlContent = "";

    if(result === null){
        htmlContent += "<p>Nema outliera za zadane kriterije!</p>"
    }
    else{
        htmlContent += "<p>Tip nekretnine: " + result.tip_nekretnine + "</p><p>Naziv: " + result.naziv + "</p><p>Kvadratura: " + result.kvadratura + "</p><p>Cijena: " + result.cijena + "</p>";
    }

    document.getElementById("outlierOdgovor").innerHTML = htmlContent;
    kriterijiOutlier.length = 0;
    document.getElementById("outlierKriterij").innerHTML = outlierKriterijOpcije;
}

function mojeNekretnine(){
    let username = document.getElementById("username").value.trim();
    let htmlContent = "";

    let korisnik = listaKorisnika.find(kor => kor.username == username);
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