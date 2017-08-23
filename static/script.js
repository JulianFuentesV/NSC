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

    $("#board").on("click", "#firewall_OnBoard", function(){
        // Setea los modals de configuracion de las NF a partir de la topologia elegida
        setModalsConfig();
        $('.modal').modal();
        $('#modal_firewall_config').modal('open');
    });

    $("#board").on("click", "#loadBalancer_OnBoard", function(){
        // Setea los modals de configuracion de las NF a partir de la topologia elegida
        setModalsConfig();
        $('.modal').modal();
        $('#modal_loadBalancer_config').modal('open');
    });

    $("#board").on("click", "#router_OnBoard", function(){
        // Setea los modals de configuracion de las NF a partir de la topologia elegida
        setModalsConfig();
        $('.modal').modal();
        $('#modal_router_config').modal('open');
    });

    $("#resources").on("click", ".chain", function(){
        $('.chainDetail').addClass("display-none");
        var id = '#info_'+this.id;
        $(id).removeClass("display-none");
        showChainDetailModal(this.id);
    });

    $("#board").on("click", ".chain", function(){
        $('.chainDetail').addClass("display-none");
        var id = '#info_'+this.id.split('_')[0];
        $(id).removeClass("display-none");
        showChainDetailModal(this.id);
    });

    function showChainDetailModal(idChain){
        $('.modal').modal();
        $('#modal_chainsDetail').modal('open');
        
    }

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
            $("#modal_config_body").append('<div class="input-field inline"><input id="input_ip" type="text" name="ip" placeholder="Controller IP"></div>');
        }
        var topo_select = $("#topo_select");
        if(!topo_select.length) {
            $("#modal_config_body_sec").append('<div class="input-field inline"><select id="topo_select">'
            +'<option value="Tree2/2" selected>Tree 2/2</option>'
            +'<option value="Tree4/2">Tree 4/2</option>'
            +'</select><label>Topology type</label></div>');
            $('select').material_select();
        }
        /*var topo_params = $("#topo_params");
        if(!topo_params.length) {
            $("#modal_config_body_sec_2").append('<div class="input-field inline"><input id="topo_param1" type="text" name="topo_param1" placeholder="First Topology Parameter"></div><div class="input-field inline"><input id="topo_param2" type="text" name="topo_param2" placeholder="Second Topology Parameter"></div>');
        }*/
        $('.modal').modal();
        $('#modal_config').modal('open');
    });

    $("#btn_saveConfig").on("click", function(){
        console.log("text: "+$("#input_ip").val());
        $("#ip").text($("#input_ip").val());
        var topo = $("#topo_select").val();
        if(topo == "Tree2/2"){
            $("#topo_type").text("Tree");
            $("#topo_p1").text("2");
            $("#topo_p2").text("2");
        }
        if(topo == "Tree4/2"){
            $("#topo_type").text("Tree");
            $("#topo_p1").text("4");
            $("#topo_p2").text("2");
        }
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
        var topo_p1 = $("#topo_p1").text();
        var topo_p2 = $("#topo_p2").text();
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
            var tp1 = $("#topo_p1").text();
            var tp2 = $("#topo_p2").text();
            window.location.replace('/ide/status/?ip='+ip+'&funcs='+ids+'&topop1='+tp1+'&topop2='+tp2);
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

    ruleCount = 1;

    $("#newRulesFw").on("click", "#btn_addrule", function(){
        var source = $("#source").val();
        var destination = $("#destination").val();
        var protocol = $("#protocol").val();
        var actions = $("#actions").val();
        var priority = $("#priority").val();

        if($("#confirmedFw").find('#default').length > 0 || $("#confirmedFw").html() == ""){
            $("#confirmedFw").html("");
            ruleCount = 1;
        }
        $("#confirmedFw").append('<p id="ruleFw_'+ruleCount+'">'+ruleCount+'. '
        +'Source: '+source+', Destination: '+destination+', '
        +'Protocol: '+protocol+', Action: '+actions+', '
        +'Priority: '+priority
        +"<button id='btnDelete_"+ruleCount+"' class='del_confirmed_fw' style='color: #ff0000; background: transparent !important; border: none;'><i class='material-icons left' style='font-size: 20px; height: 17px;'>delete</i></button></p>");
        ruleCount += 1;
    });

    $("#newRulesFw").on("change", ".checkFw", function(){
        if($("#confirmedFw").find('#default').length > 0 || $("#confirmedFw").html() == ""){
            $("#confirmedFw").html("");
            ruleCount = 1;
        }
        var state = "Off";
        if($("#"+this.id).is(":checked") == true){
            state = "On";
        }
        $("#confirmedFw").append('<p id="ruleFw_'+ruleCount+'">'+ruleCount+'. '
        +'Switch '+this.id.split('_')[1]+': '+state
        +"<button id='btnDelete_"+ruleCount+"' class='del_confirmed_fw' style='color: #ff0000; background: transparent !important; border: none;'><i class='material-icons left' style='font-size: 20px; height: 17px;'>delete</i></button>"
        +'<span class="rcFw">{"switch":"'+this.id.split('_')[1]+'","state":"'+state+'"}</span>'
        +"</p>");
        ruleCount += 1;
        console.log($("#"+this.id).is(":checked"));
    });

    $("#confirmedFw").on("click", ".del_confirmed_fw", function(){
        var idConfirmedRule = this.id.split('_')[1];
        $("#ruleFw_"+idConfirmedRule).remove();
    });

    function setModalsConfig(){
        var topo = $("#topo_type").text();
        var topo_p1 = parseInt($("#topo_p1").text());
        var topo_p2 = parseInt($("#topo_p2").text());
        var s = 0; // total switchs
        var h = 0; // total hosts
        //Case 1: If topo == tree => topo_p1: depth & topo_p2: fanout
        if(topo == "Tree"){
            for(var n = 0; n < topo_p1; n++){
                s += Math.pow(topo_p2,n);
            }
            h = Math.pow(topo_p2,topo_p1);
            console.log("# Switch: "+s);
            console.log("# Host: "+h);
        }

        //Config FIREWALL Modal
        $("#newRulesFw").text("");
        for(var e = 1; e <= s; e++){
            $("#newRulesFw").append('<div class="col s6 display-inline">'
            + ' <p class="center-align">Switch '+e+'</p>'
            + ' <div class="switch center-align">'
            + '     <label>'
            + '         Off'
            + '         <input id="checkFw_'+e+'" type="checkbox" class="checkFw">'
            + '         <span class="lever"></span>'
            + '         On'
            + '     </label>'
            + ' </div>'
            + '</div>');
        }
        var addRulesFwHTML = '<div class="col s12"><br><hr><h6 class="center-align">Add rule</h6><hr><br></div>'
            +'<div class="input-field col s12">'
            +'<select>'
            +'  <option value="" disabled selected>Choose your option</option>';
        for(var e = 1; e <= s; e++){
            addRulesFwHTML += '<option value="'+e+'">Switch '+e+'</option>';
        }
        addRulesFwHTML +=
            '</select>'
            +'<label>Choose your switch</label>'
            +"</div>";
        addRulesFwHTML += '<div class="center-align">'
        +'<div class="input-field inline">'
        +'    <input id="source" type="text" class="validate" required>'
        +'    <label for="source" data-error="wrong" data-success="right">Source</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="destination" type="text" class="validate" required>'
        +'    <label for="destination" data-error="wrong" data-success="right">Destination</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="protocol" type="text" class="validate">'
        +'    <label for="protocol" data-error="wrong" data-success="right">Protocol</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="actions" type="text" class="validate">'
        +'    <label for="actions" data-error="wrong" data-success="right">Action</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="priority" type="text" class="validate">'
        +'    <label for="priority" data-error="wrong" data-success="right">Priority</label>'
        +'</div><br>'
        +'<button id="btn_addrule" class="btn waves-effect waves-light" name="action" style="margin: 10px 0 10px 0;">Add rule'
        +'    <i class="material-icons right">send</i>'
        +'</button></div>';
        $("#newRulesFw").append(addRulesFwHTML);
        $('select').material_select();

        //Config ROUTER Modal
        $("#newRulesR").text("");
        var addRulesRHTML = ''
            +'<div class="input-field col s12">'
            +'<select>'
            +'  <option value="" disabled selected>Choose your option</option>';
        for(var e = 1; e <= s; e++){
            addRulesRHTML += '<option value="'+e+'">Switch '+e+'</option>';
        }
        addRulesRHTML +=
            '</select>'
            +'<label>Choose your switch</label>'
            +"</div>";
        addRulesRHTML += '<div class="center-align">'
        +'<div class="input-field inline">'
        +'    <input id="address" type="text" class="validate" required>'
        +'    <label for="address" data-error="wrong" data-success="right">Address</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="destination" type="text" class="validate" required>'
        +'    <label for="destination" data-error="wrong" data-success="right">Destination</label>'
        +'</div>'
        +'<div class="input-field inline">'
        +'    <input id="gateway" type="text" class="validate">'
        +'    <label for="gateway" data-error="wrong" data-success="right">Gateway</label>'
        +'</div>'
        +'<button id="btn_addrule" class="btn waves-effect waves-light" name="action" style="margin: 10px 0 10px 0;">Add rule'
        +'    <i class="material-icons right">send</i>'
        +'</button></div>';
        $("#newRulesR").append(addRulesRHTML);
        $('select').material_select();
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
                Materialize.toast(msgSuccess, 3000);
                window.location.replace('/ide/');
            },
            error: function(result){
                console.log("ERROR");
                Materialize.toast(msgError, 3000);
            }
        });
    }

});