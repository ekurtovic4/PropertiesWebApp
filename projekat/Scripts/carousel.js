function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        glavniElement.children[indeks].style.display = "none"; 
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
        glavniElement.children[indeks].style.display = "block"; 
    }

    const fnDesno = function(){
        glavniElement.children[indeks].style.display = "none"; 
        indeks = (indeks + 1) % brojElemenata;
        glavniElement.children[indeks].style.display = "block"; 
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}