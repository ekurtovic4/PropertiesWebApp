function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    const fnDesno = function(){
        indeks = (indeks + 1) % brojElemenata;
        glavniElement.innerHTML = sviElementi[indeks].innerHTML;
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}