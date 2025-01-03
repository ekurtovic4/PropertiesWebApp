window.onload = function() {
    PoziviAjax.getMojiUpiti(function(error, data) {
        if(data) {
            let htmlContent = "";

            for(upit of data) {
                htmlContent += "<div class=\"upit\">";
                htmlContent += "<p> ID nekretnine: " + upit.id_nekretnine + "</p>";
                htmlContent += "<p> Upit: " + upit.tekst_upita + "</p>";
                htmlContent += "</div>";
            }

            document.getElementById("upiti").innerHTML = htmlContent;
        }
        else{
            document.getElementById("upiti").innerHTML = "<p>" + error.statusText + "</p>"
        }
    });
}