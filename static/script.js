$(document).ready(function(){

    var ip = "";
    var switchID;
    var totalItems;
    var content;

    $("#firewall").tooltip({delay: 10, tooltip: "Firewall", position: 'right'});
    $("#loadBalancer").tooltip({delay: 10, tooltip: "Load Balancer", position: 'right'});
    $("#router").tooltip({delay: 10, tooltip: "Router", position: 'right'});

    $(".item").draggable({ helper: 'clone', scroll: false });
    $("#board").droppable({
        accept: ".item",
        scroll: false,
        containment: "parent",
        drop: function(e, ui){
            var droppedItem = $(ui.draggable).clone();
            droppedItem.attr('draggable', false);
            var itemID = droppedItem.attr('id');
            droppedItem.attr('id', itemID+"_OnBoard");
            droppedItem.removeClass('c_move');
            var connector = "<img id='arrow' src='/static/images/arrow.png' style='vertical-align: top; margin-top: 50px;'/>";
            $(this).append(connector);
            $(this).append(droppedItem);
        }
    });

    /*$("#board").on("click", "#firewall_OnBoard", function(){
        $("#modal_title").text("Firewall Configuration");
        $.getJSON("http://"+ip+"/firewall/module/status", function(data){
            switchID = data[0].switch_id;
            $("#modal_var_1").text("Switch ID: "+data[0].switch_id+" | Status: "+data[0].status);
        });
        $('.modal').modal();
        $('#modal_config').modal('open');
    });*/

    $("#btn_restart").on("click", function(){
        $("#board").html('<br/><h4 class="center-align">Chains Constructor</h4><br/>');
    });

    $("#btn_delete").on("click", function(){
        $('.modal').modal();
        $('#modal_delete').modal('open');
    });

    $("#btn_config").on("click", function(){
        $("#modal_title").text("Configuration");
        var input_ip = $("#input_ip");
        if (!input_ip.length) {
            $("#modal_config_body").append('<input id="input_ip" type="text" name="ip" placeholder="Controller IP">');
        }
        $('.modal').modal();
        $('#modal_config').modal('open');
    });

    $("#btn_saveConfig").on("click", function(){
        console.log("text: "+$("#input_ip").val());
        $("#ip").text($("#input_ip").val());
    });

    $("#btn_save").on("click", function(){
        $('.modal').modal();
        items = $("#board").find(".item");
        if (items[0]) {
            $('#modal_save').modal('open');
            //totalItems = items[0].src;
            totalItems = 0;
            content = "{";
            while(items[totalItems]){
                if (totalItems>0) {content = content+","}
                content = content+'"'+totalItems+'":"'+items[totalItems].id.split('_')[0]+'"';
                totalItems++;
            }
            content = content+"}";
            console.log("content: "+content);
            console.log("totalItems: "+totalItems);
        } else {
            Materialize.toast("Error: Board empty!", 3000);
        }
    });

    $("#btn_saveChain").on("click", function(){
        name = $("#name").val();
        description = $("#description").val();
        console.log("NAME: "+name+" DES: "+description);
        Materialize.toast("Saving chain..", 3000, 'rounded');
        url = '/ide/chain/save/'
        type = 'POST'
        data = { name: name, description: description, html: content, size: totalItems }
        msgSuccess = "Chain saved!";
        msgError = "Error saving chain!";
        ajaxRequest(url, type, data, msgSuccess, msgError);
    });

    $("#btn_run").on("click", function(){
        ip = $("#ip").text();
        console.log("IP: "+ip);
        items = $("#board").find(".item");
        totalItems = 0;
        ids = [];
        if (items[0]) {
            while(items[totalItems]){
                itemID = items[totalItems].id.split('_')[0];
                console.log("item id: "+itemID);
                ids[totalItems] = itemID;
                totalItems++;
            }
            //ajaxRequest('/ide/run/','POST', {"chain[]": ids, "ip": ip}, "Chain executed!", "Error executing chain..");
            //$.get('http://'+ip+'/launcher?f='+ids);
            console.log("get pass");
            window.location.replace('/ide/status/?ip='+ip+'&funcs='+ids);
        } else {
            Materialize.toast("Error: Board empty!", 3000);
        }
    });

    /*$("#btn_run").on("click", function(){
        Materialize.toast("Enabling Firewall..", 3000, 'rounded');
        $.ajax({
            url: 'http://'+ip+'/firewall/module/enable/'+switchID,
            type: 'PUT',
            success: function(result){
                Materialize.toast("Firewall enabled!", 3000);
                setTimeout(function(){
                    window.location.replace('/ide/status/?ip='+ip+'&id='+switchID);
                }, 3000);
            },
            error: function(result){
                Materialize.toast("Error! Imposible iniciar", 4000);
            }
        });
    });*/

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
                Materialize.toast(msgSuccess, 3000);
            },
            error: function(result){
                console.log("ERROR");
                Materialize.toast(msgError, 3000);
            }
        });
    }

});