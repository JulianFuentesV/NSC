$(document).ready(function(){

    var ip = "192.168.0.22:8080";
    var switchID;

    $("#firewall").tooltip({delay: 10, tooltip: "Firewall", position: 'right'});
    $("#loadBalancer").tooltip({delay: 10, tooltip: "Load Balancer", position: 'right'});

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
        $("#modal_title").text("Firewall Configuration");
        $.getJSON("http://"+ip+"/firewall/module/status", function(data){
            switchID = data[0].switch_id;
            $("#modal_var_1").text("Switch ID: "+data[0].switch_id+" | Status: "+data[0].status);
        });
        $('.modal').modal();
        $('#modal_config').modal('open');
    });

    $("#btn_run").on("click", function(){
        Materialize.toast("Habilitando Firewall..", 3000, 'rounded');
        $.ajax({
            url: 'http://'+ip+'/firewall/module/enable/'+switchID,
            type: 'PUT',
            /*beforeSend: function(xhr) {
                xhr.setRequestHeader('Access-Control-Request-Method','PUT');
            },*/
            success: function(result){
                Materialize.toast("Firewall habilitado!", 4000, 'rounded');
                window.location.href="/ide/status";
            },
            error: function(result){
                Materialize.toast("Error! Imposible iniciar", 4000, 'rounded');
            }
        });
    });
});

/* ------ TODO:
    items tooltip (materializecss)
    btn restart with cleanBoard()
*/