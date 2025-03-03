function postaviCarousel(glavniElement, sviElementi, indeks = 0){
    if(glavniElement == null || glavniElement == undefined || !(indeks >= 0 && indeks < sviElementi.length)){
        return null;
    }

    let brojElemenata = sviElementi.length;

    const fnLijevo = function(){
        indeks = (indeks - 1 + brojElemenata) % brojElemenata;
        let htmlContent = '';
        let interesovanje = sviElementi[indeks];

        if(interesovanje.classList.contains('upit')){
            htmlContent += "<div class=\"upit\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }
        else if(interesovanje.classList.contains('ponuda')){
            htmlContent += "<div class=\"ponuda\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }
        else{
            htmlContent += "<div class=\"zahtjev\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }

        glavniElement.innerHTML = htmlContent;
    }

    const fnDesno = function(){
        indeks = (indeks + 1) % brojElemenata;
        let htmlContent = '';
        let interesovanje = sviElementi[indeks];

        if(interesovanje.classList.contains('upit')){
            htmlContent += "<div class=\"upit\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }
        else if(interesovanje.classList.contains('ponuda')){
            htmlContent += "<div class=\"ponuda\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }
        else{
            htmlContent += "<div class=\"zahtjev\">";
            htmlContent += interesovanje.innerHTML;
            htmlContent += "</div>";
        }

        glavniElement.innerHTML = htmlContent;
    }

    return {
        fnLijevo: fnLijevo,
        fnDesno: fnDesno
    }
}