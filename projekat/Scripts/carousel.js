function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        glavniElement.children[indeks].classList.remove("upit-prikazi");
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
        glavniElement.children[indeks].classList.add("upit-prikazi");
    }

    const fnDesno = function(){
        glavniElement.children[indeks].classList.remove("upit-prikazi");
        indeks = (indeks + 1) % brojElemenata;
        glavniElement.children[indeks].classList.add("upit-prikazi");
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}