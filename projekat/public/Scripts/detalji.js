let indeks = 0;
let sviElementi = [];

let idNekretnine = 2; //hardkodirano ***

function carousel(direction){
    let glavniElement = document.getElementById("upiti");
    let brojElemenata = sviElementi.length;
    let carouselFunkcija = postaviCarousel(glavniElement, sviElementi, indeks);

    if(direction == "left"){
        carouselFunkcija.fnLijevo();
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
    }
    else if(direction == "right"){
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

window.onload = async function() {
    let nekretnina = await new Promise((resolve, reject) => {
        PoziviAjax.getNekretnina(idNekretnine, (error, data) => {
            if(data) resolve(data);
            else reject(error);
        });
    });

    for(upit of nekretnina.upiti) {
        let korisnik = await new Promise((resolve, reject) => {
            PoziviAjax.getKorisnikById(upit.korisnik_id, (error, data) => {
                if(data) resolve(data);
                else reject(error);
            });
        });

        if(korisnik) {
            let username = korisnik.username;
            let upitDiv = document.createElement('div');
            upitDiv.classList.add('upit');
            upitDiv.innerHTML = `
                <p><strong>${username}:</strong></p>
                <p>${upit.tekst_upita}</p>
            `;
            sviElementi.push(upitDiv);
        }
    }

    setUpiti();
}