let indeks = 0;
let sviElementi = document.querySelectorAll(".upit");
let prviPoziv = true;

if(prviPoziv){
    setUpiti();
    prviPoziv = false;
} 

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

    if(window.innerWidth > 600){    
        for(element of sviElementi){
            htmlContent += "<div class=\"upit\">";
            htmlContent += element.innerHTML;
            htmlContent += "</div>";
        }
    }
    else{    
        htmlContent += "<div class=\"upit\">";
        htmlContent += sviElementi[indeks].innerHTML;
        htmlContent += "</div>";
    }

    let glavniElement = document.getElementById("upiti");
        glavniElement.innerHTML = htmlContent;
}

window.addEventListener('resize', () => { setUpiti(); });