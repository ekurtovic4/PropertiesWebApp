let indeks = 0;

function carousel(direction){
    let glavniElement = document.querySelector("#glavniUpit");
    glavniElement.classList.add("glavni-upit");

    document.querySelector(".upit-prikazi").style.display = "none";

    let sviElementi = document.querySelectorAll(".upit");
    let brojElemenata = sviElementi.length;
    let carouselFunkcija = postaviCarousel(glavniElement, sviElementi, indeks);

    if(direction == "left"){
        carouselFunkcija.fnLijevo();
        indeks--;
        if(indeks == -1){
            indeks = brojElemenata - 1;
        }
    }
    else if(direction == "right"){
        carouselFunkcija.fnDesno();
        indeks++;
        if(indeks == brojElemenata){
            indeks = 0;
        }
    }
}