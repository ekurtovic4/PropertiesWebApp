function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        indeks--;
        if(indeks == -1){
            indeks = brojElemenata - 1;
        }
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    const fnDesno = function(){
        indeks++;
        if(indeks == brojElemenata){
            indeks = 0;
        }
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}