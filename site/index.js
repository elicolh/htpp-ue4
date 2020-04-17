var envoie = document.getElementById("envoi")
var pseudoField = document.getElementById("pseudo")
var mdpField = document.getElementById("mdp")


envoie.addEventListener("click",function(){
    fetch("http://77.151.84.172:2832/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({pseudo:pseudoField.value,mdp:mdp.value})
    })
})