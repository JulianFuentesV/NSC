$(document).ready(function(){

    $('.collapsible').collapsible({accordion: true});

    var ip = $("#ip").text();
    ip = ip.split(":")[0];
    console.log("IP: "+ip);
    
    var activatedItems = $("#activatedItems").find(".itemSelected");
    console.log("Activated elements:");
    console.log(activatedItems);

    totalItems = 0;

    if(activatedItems[totalItems]){
        while(activatedItems[totalItems]){
            console.log("Element: "+totalItems);
            console.log(activatedItems[totalItems]);
            console.log("Id elemento activado: "+activatedItems[totalItems].id);
            totalItems++;
        }
    }

});