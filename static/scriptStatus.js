$(document).ready(function(){

    var url = $("#url").text();
    console.log("url: "+url);
    $.get(url);

    var ip = $("#ip").text();
    ip = ip.split(":")[0];
    console.log("IP: "+ip);
    
    var activatedItems = $("#activatedItems").find(".itemSelected");
    console.log("Activated elements:");
    console.log(activatedItems);

    totalItems = 0;

    var activatedIds = [];
    if(activatedItems[totalItems]){
        while(activatedItems[totalItems]){
            console.log("Element: "+totalItems);
            console.log(activatedItems[totalItems]);
            console.log("Id elemento activado: "+activatedItems[totalItems].id);
            activatedIds[totalItems] = ""+activatedItems[totalItems].id;
            totalItems++;
        }
    }

    console.log("total items: "+totalItems);

    var columns = "";
    var offset = "s0";

    switch(totalItems){
        case 1:
            columns = "s10";
            offset = "s1";
            break;
        
        case 2:
            columns = "s5";
            offset = "s1";
            break;

        case 3:
            columns = "s4";
            break;

        default:
            columns = "s"+Math.floor(12/totalItems);
            break;
    }

    $("#information").html("");
    $("#information").html(
    '<div class="center-align" style="margin: auto;">'
    +'    <div class="preloader-wrapper big active">'
    +'    <div class="spinner-layer spinner-blue">'
    +'        <div class="circle-clipper left">'
    +'        <div class="circle"></div>'
    +'        </div><div class="gap-patch">'
    +'        <div class="circle"></div>'
    +'        </div><div class="circle-clipper right">'
    +'        <div class="circle"></div>'
    +'        </div>'
    +'    </div>'
    +'    <div class="spinner-layer spinner-red">'
    +'        <div class="circle-clipper left">'
    +'        <div class="circle"></div>'
    +'        </div><div class="gap-patch">'
    +'        <div class="circle"></div>'
    +'        </div><div class="circle-clipper right">'
    +'        <div class="circle"></div>'
    +'        </div>'
    +'    </div>'
    +'    <div class="spinner-layer spinner-yellow">'
    +'        <div class="circle-clipper left">'
    +'        <div class="circle"></div>'
    +'        </div><div class="gap-patch">'
    +'        <div class="circle"></div>'
    +'        </div><div class="circle-clipper right">'
    +'        <div class="circle"></div>'
    +'        </div>'
    +'    </div>'
    +'    <div class="spinner-layer spinner-green">'
    +'        <div class="circle-clipper left">'
    +'        <div class="circle"></div>'
    +'        </div><div class="gap-patch">'
    +'        <div class="circle"></div>'
    +'        </div><div class="circle-clipper right">'
    +'        <div class="circle"></div>'
    +'        </div>'
    +'    </div>'
    +'    </div>'
    +'</div>');

    console.log("activatedIds");
    console.log(activatedIds);

    for(i = 0; i<totalItems; i++){
        switch(activatedIds[i]){
            case 'firewall':
                console.log("firewall encontrado");
                url = "http://"+ip+":8080/firewall/module/status";
                setTimeout(function(){
                    $.getJSON("http://"+ip+":8080/firewall/module/status", function(data){
                        console.log(data);
                        $("#information").html("");
                        var listFw =
                            '<ul id="listFw" class="collapsible popout" data-collapsible="accordion">'
                            +'   <li>'
                            +'    <div class="collapsible-header active"><i class="material-icons">view_column</i>Firewall</div>'
                            +'    <div class="collapsible-body center-align"><span>';
                        var check = "";
                        data.forEach(function(element) {
                            switchID = element.switch_id;
                            status = element.status;
                            console.log("status: "+status);
                            if(status === "enable"){
                                check = "checked";
                            } else {
                                check = "";
                            }
                            listFw = listFw +
                            '    <b>Switch '+switchID+': </b>'+status+'. '
                            +'<div class="switch"><label>Off'
                            +'<input type="checkbox" '+check+'>'
                            +'<span class="lever"></span>On</label></div>'
                            +'</br>';
                        }, this);
                        listFw = listFw +
                            '     </span></div>'
                            +'    </li>'
                            +'</ul>';

                        $("#information").append(listFw);
                        $("#listFw").addClass("col");
                        $("#listFw").addClass(columns);
                        $("#listFw").addClass("offset-"+offset);
                        $('.collapsible').collapsible({accordion: true});

                    }).fail(function(){Materialize.toast("Timeout", 3000);});
                }, 5000);
                break;
            case 'loadBalancer':
                console.log("Load balancer encontrado");
                break;
            case 'router':
                console.log("Proxy encontrado");
                break;
            default:
                console.log(activatedIds[i]+" encontrado");
                break;
        }
    }

    function ajaxRequest(mUrl, mType, mData, msgSuccess, msgError){
        csrftoken = Cookies.get('csrftoken');
        $.ajax({
            url: mUrl,
            type: mType,
            data: mData,
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                console.log("SUCCESS");
                console.log(result);
                //Materialize.toast(msgSuccess, 3000);
            },
            error: function(result){
                console.log("ERROR");
                console.log(result);
                //Materialize.toast(msgError, 3000);
            }
        });
    }

});