function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
        let htmlContent = "<div class=\"upit\">";
        htmlContent += sviElementi[indeks].innerHTML;
        htmlContent += "</div>";
        glavniElement.innerHTML = htmlContent;
    }

    const fnDesno = function(){
        indeks = (indeks + 1) % brojElemenata;
        let htmlContent = "<div class=\"upit\">";
        htmlContent += sviElementi[indeks].innerHTML;
        htmlContent += "</div>";
        glavniElement.innerHTML = htmlContent;
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}