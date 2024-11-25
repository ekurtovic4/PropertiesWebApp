let indeks = 0;
let prviPoziv = true;

function carousel(direction){
    let glavniElement = document.getElementById("upiti");

    if(prviPoziv){
        document.querySelector(".upit-prikazi").classList.remove(".upit-prikazi");
        prviPoziv = false;
    }
    
    let sviElementi = document.querySelectorAll(".upit");
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