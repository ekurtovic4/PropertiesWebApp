window.onload =function(){
    var username=document.getElementById("username")
    var password=document.getElementById("password")
    
    let dugme=document.getElementById("dugme")
    
    dugme.onclick = function(){
        
        PoziviAjax.postLogin(username.value,password.value,function(err,data){
            if(err != null){
                if(err.status == 429) {
                    var divElement=document.getElementById("areaBelow");
                    divElement.innerHTML="<h2>Previše neuspješnih pokušaja! Pokušajte ponovo za 1 minutu.</h2>"; 
                }
                window.alert(err.statusText);
            }
            else{
                var message=JSON.parse(data)
                if(message.poruka=="Neuspješna prijava"){
                    var divElement=document.getElementById("areaBelow")
                    divElement.innerHTML="<h2>Neispravni podaci</h2>"
                }else{
                    window.location.href="http://localhost:3000/nekretnine.html"
                }
            }
        })
    }
}