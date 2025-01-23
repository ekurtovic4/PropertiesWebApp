let indeks = 0;
let sviElementi = [];
let idNekretnine = 0; 
let page = 0;
let dosloDoKraja = false;
let loggedInUserIsAdmin = false;

window.onload = async function() {
    let params = new URLSearchParams(window.location.search);
    if(params) {
        idNekretnine = params.get('id');
    }

    try {
        let nekretnina = await new Promise((resolve, reject) => {
            PoziviAjax.getNekretnina(idNekretnine, (error, data) => {
                if(data) resolve(data);
                else reject(error);
            });
        });

        //dodavanje u osnovno
        let osnovnoDiv = document.getElementById('osnovno');
        const nekretninaImg = document.createElement('img');
        nekretninaImg.src = `../Resources/${idNekretnine}.jpg`;
        nekretninaImg.alt = 'Nekretnina';
        osnovnoDiv.appendChild(nekretninaImg);

        const nazivP = document.createElement('p');
        nazivP.innerHTML = `<strong>Naziv:</strong> ${nekretnina.naziv}`;
        osnovnoDiv.appendChild(nazivP);

        const kvadraturaP = document.createElement('p');
        kvadraturaP.innerHTML = `<strong>Kvadratura:</strong> ${nekretnina.kvadratura}`;
        osnovnoDiv.appendChild(kvadraturaP);

        const cijenaP = document.createElement('p');
        cijenaP.innerHTML = `<strong>Cijena:</strong> ${nekretnina.cijena}`;
        osnovnoDiv.appendChild(cijenaP);

        //dodavanje u detalji
        //kolona1
        let kolona1Div = document.getElementById('kolona1');
        const grijanjeP = document.createElement('p');
        grijanjeP.innerHTML = `<strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja}`;
        kolona1Div.appendChild(grijanjeP);

        const lokacijaP = document.createElement('p');
        const strongLokacijaText = document.createElement('strong');
        strongLokacijaText.innerHTML = 'Lokacija: ';
        lokacijaP.appendChild(strongLokacijaText);
        
        const lokacijaLink = document.createElement('a');
        lokacijaLink.id = 'lokacijaLink';
        lokacijaLink.href = "#top5Main";
        lokacijaLink.innerText = nekretnina.lokacija;
        lokacijaLink.addEventListener('click', function(){ getTop5Nekretnina() });
        lokacijaP.appendChild(lokacijaLink);

        kolona1Div.appendChild(lokacijaP);

        //kolona2
        let kolona2Div = document.getElementById('kolona2');
        const godinaIzgradnjeP = document.createElement('p');
        godinaIzgradnjeP.innerHTML = `<strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje}`;
        kolona2Div.appendChild(godinaIzgradnjeP);

        const datumObjaveP = document.createElement('p');

        const datumObjave = new Date(nekretnina.datum_objave);
        const formatiranDatum = `${datumObjave.getDate().toString().padStart(2, '0')}.${(datumObjave.getMonth() + 1)
            .toString().padStart(2, '0')}.${datumObjave.getFullYear()}.`;

        datumObjaveP.innerHTML = `<strong>Datum objave oglasa:</strong> ${formatiranDatum}`;
        kolona2Div.appendChild(datumObjaveP);

        //opis
        let opisDiv = document.getElementById('opis');
        const opisP = document.createElement('p');
        opisP.innerHTML = `<strong>Opis:</strong> ${nekretnina.opis}`;
        opisDiv.appendChild(opisP);

        for(let upit of nekretnina.upiti) {
            try{
                let korisnik = await new Promise((resolve, reject) => {
                    PoziviAjax.getKorisnikById(upit.korisnik_id, (error, data) => {
                        if(data) resolve(data);
                        else reject(error);
                    });
                });
        
                let username = korisnik.username;
                let upitDiv = document.createElement('div');
                upitDiv.classList.add('upit');
                upitDiv.innerHTML = `
                    <p><strong>${username}:</strong></p>
                    <p>${upit.tekst}</p>
                `;
                sviElementi.push(upitDiv);

                setUpiti();
            }
            catch(error) {
                console.error("Greška prilikom učitavanja korisnika za upit");
            }
        }

        let dodavanjeInteresovanja = document.getElementById("dodavanjeInteresovanja");

        PoziviAjax.getKorisnik(function(err, data) {
            if(err){
                dodavanjeInteresovanja.style.display = 'none';
            }
            else{
                dodavanjeInteresovanja.style.display = 'block';
                let unosUpita = document.getElementById("unosUpita");
                let unosZahtjeva = document.getElementById("unosZahtjeva");
                let odgovorNaZahtjev = document.getElementById("odgovorNaZahtjev");
                let unosPonude = document.getElementById("unosPonude");
                let odgovorNakonPost = document.getElementById("odgovorNakonPost");
                let imaZahtjevaZaOdgovor = document.getElementById("imaZahtjevaZaOdgovor");
        
                unosUpita.style.display = 'block';
                unosZahtjeva.style.display = 'none';
                unosPonude.style.display = 'none';
                odgovorNaZahtjev.style.display = 'none';
                odgovorNakonPost.style.display = 'none';
                imaZahtjevaZaOdgovor.style.display = 'none';

                loggedInUserIsAdmin = data.admin;
            }
        });
    }
    catch(error) {
        console.error("Greška prilikom učitavanja nekretnine");
    }
}

async function carousel(direction){
    let glavniElement = document.getElementById("upiti");
    let brojElemenata = sviElementi.length;
    let carouselFunkcija = postaviCarousel(glavniElement, sviElementi, indeks);

    if(direction == "left"){
        carouselFunkcija.fnLijevo();
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
    }
    else if(direction == "right"){
        if(!dosloDoKraja && indeks + 1 == sviElementi.length){
            page += 1;
            await getNextUpiti();
            brojElemenata = sviElementi.length;
            carouselFunkcija = postaviCarousel(glavniElement, sviElementi, indeks);
        }

        carouselFunkcija.fnDesno();
        indeks = (indeks + 1) % brojElemenata;
    }
}

function setUpiti(){
    let htmlContent = "";
    htmlContent += "<div class=\"upit\">";
    htmlContent += sviElementi[indeks].innerHTML;
    htmlContent += "</div>";

    let glavniElement = document.getElementById("upiti");
    glavniElement.innerHTML = htmlContent;
}

async function getNextUpiti() {
    try{
        let upiti = await new Promise((resolve, reject) => {
            PoziviAjax.getNextUpiti(idNekretnine, page, (error, data) => {
                if(data) resolve(data);
                else reject(error);
            });
        });

        for(let upit of upiti) {
            try{
                let korisnik = await new Promise((resolve, reject) => {
                    PoziviAjax.getKorisnikById(upit.korisnik_id, (error, data) => {
                        if(data) resolve(data);
                        else reject(error);
                    });
                });
        
                let username = korisnik.username;
                let upitDiv = document.createElement('div');
                upitDiv.classList.add('upit');
                upitDiv.innerHTML = `
                    <p><strong>${username}:</strong></p>
                    <p>${upit.tekst}</p>
                `;
                sviElementi.push(upitDiv);
            }
            catch(error) {
                console.error("Error fetching username for korisnik_id");
            }
        }
    }
    catch(error) {
        dosloDoKraja = true;
    }
}

function getTop5Nekretnina(){
    let lokacijaLink = document.getElementById("lokacijaLink");
    const lokacija = lokacijaLink.innerText;

    PoziviAjax.getTop5Nekretnina(lokacija, (error, nekretnine) => {
        let top5MainDiv = document.getElementById('top5Main');
        const top5Heading = document.createElement('h3');
        top5Heading.innerHTML = `TOP 5 NEKRETNINA ZA LOKACIJU ${lokacija}`;
        top5MainDiv.appendChild(top5Heading);

        let top5Div = document.createElement('div');
        top5Div.id = 'top5';
        top5MainDiv.appendChild(top5Div);

        if(error) {
            const errorP = document.createElement('p');
            errorP.innerHTML = "Greška pri dobavljanju nekretnina za traženu lokaciju!";
            top5Div.appendChild(errorP);
        }
        else{
            for(let nekretnina of nekretnine) {
                const nekretninaElement = document.createElement('div');
                if (nekretnina.tip_nekretnine === "Stan") {
                    nekretninaElement.classList.add('nekretnina', 'stan');
                    nekretninaElement.id = `${nekretnina.id}`;
                }
                else if (nekretnina.tip_nekretnine === "Kuća") {
                    nekretninaElement.classList.add('nekretnina', 'kuca');
                    nekretninaElement.id = `${nekretnina.id}`;
                }
                else {
                    nekretninaElement.classList.add('nekretnina', 'pp');
                    nekretninaElement.id = `${nekretnina.id}`;
                }

                const slikaElement = document.createElement('img');
                slikaElement.classList.add('slika-nekretnine');
                slikaElement.src = `../Resources/${nekretnina.id}.jpg`;
                slikaElement.alt = nekretnina.naziv;
                nekretninaElement.appendChild(slikaElement);

                const detaljiElement = document.createElement('div');
                detaljiElement.classList.add('detalji-nekretnine');
                detaljiElement.innerHTML = `
                    <h3>${nekretnina.naziv}</h3>
                    <p>Kvadratura: ${nekretnina.kvadratura} m²</p>
                `;
                nekretninaElement.appendChild(detaljiElement);

                const cijenaElement = document.createElement('div');
                cijenaElement.classList.add('cijena-nekretnine');
                cijenaElement.innerHTML = `<p>Cijena: ${nekretnina.cijena} BAM</p>`;
                nekretninaElement.appendChild(cijenaElement);

                const detaljiDugme = document.createElement('a');
                detaljiDugme.href = '/detalji.html?id=' + nekretnina.id; 
                detaljiDugme.classList.add('detalji-dugme');
                detaljiDugme.textContent = 'Detalji';
                nekretninaElement.appendChild(detaljiDugme);

                top5Div.appendChild(nekretninaElement);
            }
        }
    });
}

function prikaziPoljaZaUnos(){
    let tip = document.getElementById("tipSelect").value;
    let unosUpita = document.getElementById("unosUpita");
    let unosZahtjeva = document.getElementById("unosZahtjeva");
    let odgovorNaZahtjev = document.getElementById("odgovorNaZahtjev");
    let unosPonude = document.getElementById("unosPonude");
    let odgovorNakonPost = document.getElementById("odgovorNakonPost");
    let imaZahtjevaZaOdgovor = document.getElementById("imaZahtjevaZaOdgovor");

    unosUpita.style.display = 'none';
    unosZahtjeva.style.display = 'none';
    odgovorNaZahtjev.style.display = 'none';
    unosPonude.style.display = 'none';
    odgovorNakonPost.style.display = 'none';
    imaZahtjevaZaOdgovor.style.display = 'none';

    if(tip == "upit"){
        unosUpita.style.display = 'block';
    }
    else if(tip == "zahtjev"){
        if(loggedInUserIsAdmin){
            updateZahtjevi();
        }
        else{
            unosZahtjeva.style.display = 'block';
        }
    }
    else{
        updatePonude();
        unosPonude.style.display = 'block';
    }
}

function updatePonude(){
    PoziviAjax.getPonudeForKorisnik(idNekretnine, function(err, data){
        if(err){
            if(err.status == 404){
                document.getElementById("idVezanePonudeSelect").disabled = true;
            }
            else{
                let odgovorNakonPost = document.getElementById("odgovorNakonPost");
                odgovorNakonPost.innerHTML = `<h2>Greška: ${err.statusText}</h2>`;
                odgovorNakonPost.display.style = 'block';
            }
        }
        else{
            let idVezanePonudeSelect = document.getElementById("idVezanePonudeSelect");
            idVezanePonudeSelect.innerHTML = '';

            data.forEach(p => {
                const idPonudeOption = document.createElement("option");
                idPonudeOption.value = p.id;
                idPonudeOption.textContent = p.id;
                idVezanePonudeSelect.appendChild(idPonudeOption);
            });

            idVezanePonudeSelect.disabled = false;
        }
    });
}


let postUpitButton = document.getElementById("postUpitButton");
postUpitButton.onclick = function(){
    let tekstUpita = document.getElementById("tekstUpita").value;
    let odgovorNakonPost = document.getElementById("odgovorNakonPost");

    PoziviAjax.postUpit(idNekretnine, tekstUpita, function(err, data){
        if(err){
            odgovorNakonPost.innerHTML = `<h2>Greška: ${err.statusText}</h2>`  
        }
        else{
            odgovorNakonPost.innerHTML = '<h2>Uspješno postavljen upit!</h2>'
        }

        odgovorNakonPost.style.display = 'block';
        document.getElementById("tekstUpita").value = '';
    });
}

let postZahtjevButton = document.getElementById("postZahtjevButton");
postZahtjevButton.onclick = function(){
    let tekstZahtjeva = document.getElementById("tekstZahtjeva").value;
    let datumZahtjeva = document.getElementById("datumZahtjeva").value;
    let odgovorNakonPost = document.getElementById("odgovorNakonPost");

    if(new Date(datumZahtjeva) < Date.now()){
        odgovorNakonPost.innerHTML = `<h2>Datum ne može biti raniji od današnjeg! Odaberite drugi datum.</h2>`;
        odgovorNakonPost.style.display = 'block';
        return;
    }

    PoziviAjax.postZahtjev(idNekretnine, tekstZahtjeva, datumZahtjeva, function(err, data){
        if(err){
            odgovorNakonPost.innerHTML = `<h2>Greška: ${err.statusText}</h2>` 
        }
        else{
            odgovorNakonPost.innerHTML = '<h2>Uspješno poslan zahtjev!</h2>'
        }

        odgovorNakonPost.style.display = 'block';
        document.getElementById("tekstZahtjeva").value = '';
        document.getElementById("datumZahtjeva").value = '';
    })
}

let postPonudaButton = document.getElementById("postPonudaButton");
postPonudaButton.onclick = function(){
    let tekstPonude = document.getElementById("tekstPonude").value;
    let cijenaPonude = document.getElementById("cijenaPonude").value;
    let idVezanePonude = document.getElementById("idVezanePonudeSelect").value;
    let odbijenaPonuda = document.querySelector('input[name="odbijenaPonuda"]:checked')?.value;
    let odgovorNakonPost = document.getElementById("odgovorNakonPost");

    if(cijenaPonude < 0){
        odgovorNakonPost.innerHTML = `<h2>Ponuđena cijena ne može biti negativna! Ponovite unos.</h2>`;
        odgovorNakonPost.style.display = 'block';
        return;
    }

    if(idVezanePonude == ''){
        idVezanePonude = null;
    }

    PoziviAjax.postPonuda(idNekretnine, tekstPonude, cijenaPonude, Date.now(), idVezanePonude, odbijenaPonuda === "true", function(err, data){
        if(err){
            odgovorNakonPost.innerHTML = `<h2>Greška: ${err.statusText}</h2>`
        }
        else{
            odgovorNakonPost.innerHTML = '<h2>Uspješno poslana ponuda!</h2>'
            updatePonude();
        }

        odgovorNakonPost.style.display = 'block';
        document.getElementById("tekstPonude").value = '';
        document.getElementById("cijenaPonude").value = '';
        document.getElementById("datumPonude").value = '';
        document.getElementById("idVezanePonudeSelect").value = '';
        let odbijenaPonudaRadio = document.querySelectorAll('input[name="odbijenaPonuda"]');
        odbijenaPonudaRadio.forEach(radio => radio.checked = false);
    });
}

function updateZahtjevi(){
    PoziviAjax.getZahtjeviForNekretnina(idNekretnine, function(err, data){
        let odgovorNaZahtjev = document.getElementById("odgovorNaZahtjev");
        let imaZahtjevaZaOdgovor = document.getElementById("imaZahtjevaZaOdgovor");

        if(err){
            if(err.status == 404){
                imaZahtjevaZaOdgovor.innerHTML = `<h2>Nema novih zahtjeva na koje je moguće odgovoriti!</h2>`;
            }
            else{
                imaZahtjevaZaOdgovor.innerHTML = `<h2>Greška: ${err.statusText}</h2>`;
            }
            imaZahtjevaZaOdgovor.style.display = 'block';
            odgovorNaZahtjev.style.display = 'none';
        }
        else{
            let idVezanogZahtjevaSelect = document.getElementById("idVezanogZahtjevaSelect");
            idVezanogZahtjevaSelect.innerHTML = '';

            data.forEach(z => {
                const idZahtjevaOption = document.createElement("option");
                idZahtjevaOption.value = z.id;
                idZahtjevaOption.textContent = z.id;
                idVezanogZahtjevaSelect.appendChild(idZahtjevaOption);
            });

            imaZahtjevaZaOdgovor.style.display = 'none';
            odgovorNaZahtjev.style.display = 'block';
        }
    });
}

let putZahtjevButton = document.getElementById("putZahtjevButton");
putZahtjevButton.onclick = function(){
    let idVezanogZahtjeva = document.getElementById("idVezanogZahtjevaSelect").value;
    let odobren = document.querySelector('input[name="odobrenZahtjev"]:checked')?.value === "true";
    let addToTekst = document.getElementById("addToTekst").value;

    if(addToTekst == ''){
        addToTekst = null;
    }

    if(!odobren && addToTekst == null){
        odgovorNakonPost.innerHTML = `<h2>Potrebno je dodati tekst ukoliko se odbija zahtjev.</h2>`;
        odgovorNakonPost.style.display = 'block';
        return;
    }

    PoziviAjax.putZahtjev(idNekretnine, idVezanogZahtjeva, odobren, addToTekst, function(err, data){
        if(err){
            odgovorNakonPost.innerHTML = `<h2>Greška: ${err.statusText}</h2>`;
        }
        else{
            odgovorNakonPost.innerHTML = '<h2>Uspješno izmijenjen zahtjev!</h2>';
            updateZahtjevi();
        }

        odgovorNakonPost.style.display = 'block';
        document.getElementById("addToTekst").value = '';
        let odobrenZahtjevRadio = document.querySelectorAll('input[name="odobrenZahtjev"]');
        odobrenZahtjevRadio.forEach(radio => radio.checked = false);
    });
}