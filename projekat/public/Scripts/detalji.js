let indeks = 0;
let sviElementi = [];
let idNekretnine = 0; 
let page = 0;
let dosloDoKraja = false;

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
        datumObjaveP.innerHTML = `<strong>Datum objave oglasa:</strong> ${nekretnina.datum_objave}`;
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
                    <p>${upit.tekst_upita}</p>
                `;
                sviElementi.push(upitDiv);

                setUpiti();
            }
            catch(error) {
                console.error("Greška prilikom učitavanja korisnika za upit");
            }
        }
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
                    <p>${upit.tekst_upita}</p>
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