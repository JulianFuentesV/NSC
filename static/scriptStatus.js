$(document).ready(function(){

    var url = $("#url").text();
    //console.log("url: "+url);
    //$.get(url);

    var ip = $("#ip").text();
    ip = ip.split(":")[0];
    //console.log("IP: "+ip);
    
    var activatedItems = $("#activatedItems").find(".itemSelected");
    //console.log("Activated elements:");
    //console.log(activatedItems);

    totalItems = 0;

    var activatedIds = [];
    if(activatedItems[totalItems]){
        while(activatedItems[totalItems]){
            //console.log("Element: "+totalItems);
            //console.log(activatedItems[totalItems]);
            //console.log("Id elemento activado: "+activatedItems[totalItems].id);
            activatedIds[totalItems] = ""+activatedItems[totalItems].id;
            totalItems++;
        }
    }

    //console.log("total items: "+totalItems);

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
    showLoadingMask();
    if($("#type").text() == "old"){
        console.log("old");
        loadingView();
    } else if($("#type").text() == "new") {
        console.log("new");
        $.get(url);
        controllerChecker(applyRules);
    } else {
        alert("Error type");
    }
    
    //console.log("activatedIds");
    //console.log(activatedIds);

    var swIds = []; //usado por el firewall
    var idsSw = []; //usado por el proxy

    function loadingView(){
        for(i = 0; i<totalItems; i++){
            switch(activatedIds[i]){
                case 'firewall':
                    //console.log("firewall encontrado");
                    url = "http://"+ip+":8080/firewall/module/status";
                    setTimeout(function(){
                        $.getJSON("http://"+ip+":8080/firewall/module/status", function(data){
                            //console.log(data);
                            hideLoadingMask();
                            //$("#information").html("");
                            var listFw =
                                '<ul id="listFw" class="collapsible popout" data-collapsible="accordion">'
                                +'   <li id="itemFw">'
                                +'    <div class="collapsible-header active"><i class="material-icons">view_column</i>Firewall Status</div>'
                                +'    <div id="bodyFw" class="collapsible-body center-align"><span>';
                            var check = "";
                            data.forEach(function(element) {
                                switchID = element.switch_id;
                                swIds.push(switchID);
                                status = element.status;
                                //console.log("status: "+status);
                                if(status === "enable"){
                                    check = "checked";
                                } else {
                                    check = "";
                                }
                                listFw = listFw +
                                //'    <b>Switch '+switchID+': </b>'+status+'. '
                                '    <b>Switch '+switchID+' </b>'
                                +'<div class="switch"><label>Off'
                                +'<input id="cb_'+switchID+'" type="checkbox" class="cb_fw" '+check+'>'
                                +'<span class="lever"></span>On</label></div>'
                                +'</br>';
                            }, this);
                            listFw = listFw +
                                '     </span></div>'
                                +'    </li>'
                                +'    <li id="itemRulesFw"><div id="headerRulesFw" class="collapsible-header"><i class="material-icons">view_column</i>Firewall Rules</div>'
                                +'      <div id="bodyRulesFw" class="collapsible-body center-align"><span>'
                                +'      </span></div></li>'
                                +'</ul>';

                            $("#information").append(listFw);
                            $("#listFw").addClass("col");
                            $("#listFw").addClass(columns);
                            $("#listFw").addClass("offset-"+offset);
                            $('.collapsible').collapsible({accordion: true});
                        }).fail(function(){Materialize.toast("Timeout", 3000);});
                    }, 1500);
                    break;
                case 'loadBalancer':
                    //console.log("Load balancer encontrado");
                    //hideLoadingMask();
                    var listLb = '<ul id="listLb" class="collapsible popout" data-collapsible="accordion">'
                                +'  <li id="itemLb">'
                                +'    <div class="collapsible-header active"><i class="material-icons">swap_calls</i>Load Balancer</div>'
                                +'    <div id="bodyLb" class="collapsible-body center-align"><span>'
                                +'      <div class="input-field inline">'
                                +'          <input id="virtualIP" type="text" class="validate">'
                                +'          <label for="virtualIP" data-error="wrong" data-success="right">Virtual IP</label>'
                                +'      </div>'
                                +'      <button id="btn_createlb" class="btn waves-effect waves-light" name="action" style="margin: 10px 0 10px 0;">Create Load Balancer'
                                +'          <i class="material-icons left">launch</i>'
                                +'      </button>'
                                +'      <button id="btn_deletelb" class="btn waves-effect waves-light" name="action" style="margin: 10px 0 10px 0;">Delete Load Balancer'
                                +'          <i class="material-icons left">delete</i>'
                                +'      </button>'
                                +'    </span></div>'
                                +'  </li>'
                                +'</ul>';
                    $("#information").append(listLb);
                    $("#listLb").addClass("col");
                    $("#listLb").addClass(columns);
                    $("#listLb").addClass("offset-"+offset);
                    $('.collapsible').collapsible({accordion: true});
                    break;
                case 'router':
                    //console.log("Proxy encontrado");
                    setTimeout(function(){
                        $.getJSON("http://"+ip+":8080/router/all",function(response){
                            hideLoadingMask();
                            //console.log("router response");
                            //console.log(response);
                            response.forEach(function(element){
                                var idsw = element.switch_id;
                                var in_net = element.internal_network;
                                idsSw.push(idsw);
                                //console.log(idsw);
                                //console.log(in_net);
                                $("#bodyR").append("<br><p style='margin: 0 14px; padding: 0;'><b>"+idsw+"</b></p><br>");
                                $("#select_r").append("<option value='"+idsw+"'>Switch "+idsw+"</option>");
                                // condicional in_net
                                if(in_net[0].address){
                                    in_net[0].address.forEach(function(ad){
                                        $("#bodyR").append("<p style='margin: 0 14px; padding: 0;'>"+ad.address_id+": "+ad.address+"<button id='btn_"+idsw+"_"+ad.address_id+"' class='delete_data_r' style='color: #ff0000; background: transparent !important; border: none;'><i class='material-icons left' style='font-size: 20px; height: 17px;'>delete</i></button></p>");
                                    },this);
                                }else{
                                    $("#bodyR").append("<p style='margin: 0 14px; padding: 0;'>Data not found.</p>");
                                }
                                $("#bodyR").append("<br>");
                            },this);
                            $("#select_r").material_select();
                        }).fail(function(){Materialize.toast("Timeout", 3000);});
                        var listR = '<ul id="listR" class="collapsible popout" data-collapsible="accordion">'
                                    +'  <li id="itemR">'
                                    +'    <div class="collapsible-header active"><i class="material-icons">group_work</i>Router</div>'
                                    +'    <div id="bodyR" class="collapsible-body center-align"><span>'
                                    +'    </span></div>'
                                    +'  </li>'
                                    +'  <li id="dataR">'
                                    +'    <div class="collapsible-header active"><i class="material-icons">group_work</i>Routing data</div>'
                                    +'    <div id="dataBodyR" class="collapsible-body center-align">'
                                    +'      <div class="input-field inline" style="width: 200px;">'
                                    +'          <select id="select_r" style="width: 200px;" class="center-align">'
                                    +'              <option value="" disabled selected>Choose your switch</option>'
                                    +'          </select>'
                                    +'      </div>'
                                    +'      <div class="input-field inline">'
                                    +'          <input id="address_r" type="text" class="validate">'
                                    +'          <label for="address_r" data-error="wrong" data-success="right">Address</label>'
                                    +'      </div>'
                                    +'      <div class="input-field inline">'
                                    +'          <input id="destination_r" type="text" class="validate">'
                                    +'          <label for="destination_r" data-error="wrong" data-success="right">Destination</label>'
                                    +'      </div>'
                                    +'      <div class="input-field inline">'
                                    +'          <input id="gateway_r" type="text" class="validate">'
                                    +'          <label for="gateway_r" data-error="wrong" data-success="right">Gateway</label>'
                                    +'      </div><br>'
                                    +'      <button id="btn_saveR" class="btn waves-effect waves-light" name="action" style="margin: 10px 0 10px 0;">Save'
                                    +'          <i class="material-icons right">send</i>'
                                    +'      </button>'
                                    +'    </div>'
                                    +'  </li>'
                                    +'</ul>';
                        $("#information").append(listR);
                        $("#listR").addClass("col");
                        $("#listR").addClass(columns);
                        $("#listR").addClass("offset-"+offset);
                        $('.collapsible').collapsible({accordion: true});
                    }, 1500);
                    break;
                default:
                    //console.log(activatedIds[i]+" encontrado");
                    break;
            }
        }
    }

    $("#information").on("click",".cb_fw",function(){
        // Mascara para no permitir mas clicks
        showLoadingMask();
        // Hacer peticion
        var idClicked = this.id.split("_")[1]; //id switch clickeado
        //console.log(idClicked);
        var isChecked = this.checked;
        //console.log(isChecked);
        var csrftoken = Cookies.get('csrftoken');
        var mUrl = "http://"+ip+":8080/firewall/module/";
        if(isChecked){
            $.ajax({
                url: mUrl+"enable/"+idClicked,
                type: "PUT",
                crossDomain: true,
                success: function(result){
                    hideLoadingMask();
                    Materialize.toast("Switch enabled", 3000);
                },
                error: function(result){
                    $("#cb_"+idClicked).prop( "checked", false );
                    hideLoadingMask();
                    console.log("ERROR");
                    console.log(result);
                    Materialize.toast("Error", 3000);
                }
            });
        } else {
            $.ajax({
                url: mUrl+"disable/"+idClicked,
                type: "PUT",
                crossDomain: true,
                success: function(result){
                    hideLoadingMask();
                    Materialize.toast("Switch disabled", 3000);
                },
                error: function(result){
                    $("#cb_"+idClicked).prop( "checked", false );
                    hideLoadingMask();
                    console.log("ERROR");
                    console.log(result);
                    Materialize.toast("Error", 3000);
                }
            });
        }
    });

    $("#information").on("click","#btn_createlb",function(){
        //console.log("create lb");
        var virtualIP = $("#virtualIP").val();
        //console.log(virtualIP);
        $.ajax({
            url: "http://"+ip+":8080/v1.0/loadbalancer/create",
            type: "POST",
            data: '{"virtual_ip":"'+virtualIP+'","rewrite_ip":1,"servers":[]}',
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
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
    });

    $("#information").on("click","#btn_deletelb",function(){
        //console.log("delete lb");
        var virtualIP = $("#virtualIP").val();
        //console.log(virtualIP);
        $.ajax({
            url: "http://"+ip+":8080/v1.0/loadbalancer/delete",
            type: "POST",
            data: '{"virtual_ip":"'+virtualIP+'","rewrite_ip":1,"servers":[]}',
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                //console.log("SUCCESS");
                //console.log(result);
                //Materialize.toast(msgSuccess, 3000);
            },
            error: function(result){
                console.log("ERROR");
                console.log(result);
                //Materialize.toast(msgError, 3000);
            }
        });
    });

    $("#information").on("click","#btn_saveR", function(){
        showLoadingMask();
        //console.log("save R");
        var select_r = $("#select_r").val();
        var address_r = $("#address_r").val();
        var destination_r = $("#destination_r").val();
        var gateway_r = $("#gateway_r").val();
        var d = "{";
        if(address_r != ""){d = d + '"address": "' + address_r + '",'; }
        if(destination_r != ""){ d = d + '"destination": "' + destination_r + '",'; }
        if(gateway_r != ""){ d = d + '"gateway": "' + gateway_r + '",'; }
        d = d.slice(0, -1);
        d = d + "}";

        $.ajax({
            url: "http://"+ip+":8080/router/"+select_r,
            type: "POST",
            data: d,
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                hideLoadingMask();
                //console.log("SUCCESS");
                //console.log(result);
                Materialize.toast("Data saved!", 3000);
            },
            error: function(result){
                hideLoadingMask();
                console.log("ERROR");
                console.log(result);
                Materialize.toast("Incorrect data.", 3000);
            }
        });
        
    });

    //$("#information").on("click",".lever",function(){console.log("lever");});

    $("#information").on("click","#headerRulesFw",function(){
        if($("#headerRulesFw").hasClass("active")){
            // Open tab
            showLoadingMask();
            $("#bodyRulesFw").html("");
            var bodyRules = "";
            swIds.forEach(function(sid){
                bodyRules = bodyRules + "<p style='margin: 14px; padding: 0;'><b>Switch "+sid+"</b></p><div id='rules_"+sid+"'></div>";
                $.getJSON("http://"+ip+":8080/firewall/rules/"+sid, function(response){
                    //console.log("response rules");
                    //console.log(response);
                    var acl = response[0].access_control_list;
                    if(acl[0]){
                        $("#rules_"+sid).html();
                        var cont = "";
                        for(i = 0; i < acl[0].rules.length; i++){
                            var rules = acl[0].rules[i];
                            //<button id='btn_"+sid+"_"+rules.rule_id+"' class='delete_rule' style='background: #FF2200; color: #fff; border: 1px solid #fff; border-radius: 10px;'>Delete</button>
                            cont = cont + "<p style='margin: 0 14px; padding: 0; text-align: left;'>"+rules.rule_id+". Source: "+rules.nw_src+" - Destination: "+rules.nw_dst+" - Protocol: "+rules.nw_proto
                            +" - Actions: "+rules.actions+" - Priority: "+rules.priority+" - Type: "+rules.dl_type+". <button id='btn_"+sid+"_"+rules.rule_id+"' class='delete_rule' style='color: #ff0000; background: transparent !important; border: none;'><i class='material-icons left' style='font-size: 20px; height: 17px;'>delete</i></button></p>";
                        }
                        $("#rules_"+sid).html(cont);
                    } else {
                        $("#rules_"+sid).html("Rules not found.");
                    }
                    //console.log(response[0]);
                    //console.log("p");
                    //console.log(response[0].access_control_list[0]);
                }).fail(function(){Materialize.toast("Timeout", 3000);});
            },this);
            bodyRules = bodyRules + "<br><hr><h5>New Rule</h5>"
            + '<div class="input-field" style="padding: 0px 20px; max-width: 240px; margin: 0 auto;"><select id="select_fw" class = "center-align">'
            + '<option value="" disabled selected>Choose your switch</option>';
            swIds.forEach(function(sid){
                bodyRules = bodyRules + "<option value='"+sid+"'>Switch "+sid+"</option>";
            },this);
            bodyRules = bodyRules + "</select></div>";
            bodyRules= bodyRules
            +'<div class="input-field inline">'
            +'    <input id="source" type="text" class="validate" required>'
            +'    <label for="source" data-error="wrong" data-success="right">Source</label>'
            +'</div>'
            +'<div class="input-field inline">'
            +'    <input id="destination" type="text" class="validate" required>'
            +'    <label for="destination" data-error="wrong" data-success="right">Destination</label>'
            +'</div><br>'
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
            +'</button>';
            $("#bodyRulesFw").html(bodyRules);
            $('#select_fw').material_select();
            hideLoadingMask();
        } else {
            // Close tab
        }
    });

    $("#information").on("click","#btn_addrule",function(){
        showLoadingMask();
        csrftoken = Cookies.get('csrftoken');
        /*console.log("CLICK ADD RULE");
        console.log($("#select_fw").val());
        console.log($("#source").val());
        console.log($("#destination").val());
        console.log($("#protocol").val());
        console.log($("#actions").val());
        console.log($("#priority").val());*/

        var rule = "{";
        if($("#source").val() != ""){rule = rule+'"nw_src": "'+$("#source").val()+'",';}
        if($("#destination").val() != ""){rule = rule+'"nw_dst": "'+$("#destination").val()+'",';}
        if($("#protocol").val() != ""){rule = rule+'"nw_proto": "'+$("#protocol").val()+'",';}
        if($("#actions").val() != ""){rule = rule+'"actions": "'+$("#actions").val()+'",';}
        if($("#priority").val() != ""){rule = rule+'"priority": "'+$("#priority").val()+'",';}
        rule = rule.slice(0, -1);
        rule = rule + "}";

        $.ajax({
            url: 'http://'+ip+':8080/firewall/rules/'+$("#select_fw").val(),
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            data: rule,
            //data: JSON.stringify({"nw_src": $("#source").val(), "nw_dst": $("#destination").val(), "nw_proto": $("#protocol").val(), "actions": $("#actions").val(), "priority": $("#priority").val()}),
            //data: JSON.stringify({ "nw_src": "10.0.0.2", "nw_dst": "10.0.0.3", "nw_proto": "ICMP", "actions": "DENY", "priority": "10" }),
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
                xhr.setRequestHeader("Content-Type","application/json");
            },
            success: function(result){
                hideLoadingMask();
                //console.log("SUCCESS");
                //console.log(result);
                //$('.collapsible').collapsible('close',1);
                closeCollapsible("#itemRulesFw", "#headerRulesFw", "#bodyRulesFw");
                Materialize.toast("Rule added.", 3000);
            },
            error: function(result){
                hideLoadingMask();
                console.log("ERROR");
                console.log(result);
                Materialize.toast("Incorrect data.", 3000);
            }
        });
    });

    $("#information").on("click",".delete_rule", function(){
        //console.log("Delete rule");
        var btn_id = this.id.split("_");
        var swid = btn_id[1];
        var ruleid = btn_id[2];
        //console.log(swid+"|"+ruleid);
        $.ajax({
            url: "http://"+ip+":8080/firewall/rules/"+swid,
            type: "DELETE",
            data: '{"rule_id": '+ruleid+'}',
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                //console.log("SUCCESS");
                //console.log(result);
                //$('.collapsible').collapsible('close', 1);
                closeCollapsible("#itemRulesFw", "#headerRulesFw", "#bodyRulesFw");
                Materialize.toast("Rule deleted.", 3000);
            },
            error: function(result){
                console.log("ERROR");
                console.log(result);
                Materialize.toast("Error, try again.", 3000);
            }
        });

    });

    $("#information").on("click",".delete_data_r", function(){
        //console.log("Delete data r");
        var btn_id = this.id.split("_");
        var swid = btn_id[1];
        var dataid = btn_id[2];
        //console.log(swid+"|"+dataid);
        $.ajax({
            url: "http://"+ip+":8080/router/"+swid+"/delete",
            type: "POST",
            data: '{"address_id": '+dataid+'}',
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                //console.log("SUCCESS");
                //console.log(result);
                //$('.collapsible').collapsible('close', 1);
                Materialize.toast("Data deleted.", 3000);
            },
            error: function(result){
                console.log("ERROR");
                console.log(result);
                Materialize.toast("Error, try again.", 3000);
            }
        });

    });

    $("#btn_stop").on("click", function(){
        $("#msjLoadMask").text("Stopping...");
        showLoadingMask();
        $.get("http://"+ip+":8081/stop", function(response){
            if(response == "stopped"){
                var idExec = $("#idExec").text();
                $.get("/ide/offExec?idExec="+idExec, function(response){
                    if(response == "off"){
                        hideLoadingMask();
                        window.location.replace('/ide/');
                    } else {
                        hideLoadingMask();
                        Materialize.toast("Error[2], try again.", 3000); //state dont changed in DB
                    }
                });
            }else{
                hideLoadingMask();
                Materialize.toast("Error[1], try again.", 3000); //not stopped
            }
        });
    });

    function controllerChecker(callback){
        $("#msjLoadMask").text("Launching...");
        if(activatedIds.indexOf('firewall') != -1){
            var i=0;
            var interval = setInterval(function(){
                if(i>8){
                    clearInterval(interval);
                    callback(false, 'firewall');
                } else {
                    $.ajax({
                        url: "http://"+ip+":8080/firewall/module/status",
                        success: function(response){
                            //console.log(i+response);
                            clearInterval(interval);
                            callback(true, 'firewall', response);
                        },
                        error: function(response){
                            //console.log(response.statusText);
                            i++;
                        },
                        timeout: 1000,
                    });
                }
            }, 5000);
        }
    }

    function applyRules(controllerState, nf, status){
        status = JSON.parse(status);
        if(controllerState){
            $("#msjLoadMask").text("Configuring...");
            if(nf == "firewall"){
                var rfw = $("#rfw").text();
                rfw = JSON.parse(rfw);
                rfw.forEach(function(r){
                    console.log(r); //r.type = s (switch on or off) || r (rule)
                    if(r.type == "s"){
                        var mUrl = "http://"+ip+":8080/firewall/module/";
                        var index = parseInt(r.switch) - 1;
                        if(r.state == "On"){
                            $.ajax({
                                url: mUrl+"enable/"+status[index].switch_id,
                                type: "PUT",
                                crossDomain: true,
                                success: function(result){},
                                error: function(result){}
                            });
                        } else {
                            $.ajax({
                                url: mUrl+"disable/"+r.switch,
                                type: "PUT",
                                crossDomain: true,
                                success: function(result){},
                                error: function(result){}
                            });
                        }
                    }
                    if(r.type == "r"){
                        var rule = "{";
                        if(r.s != ""){rule = rule+'"nw_src": "'+r.s+'",';}
                        if(r.d != ""){rule = rule+'"nw_dst": "'+r.d+'",';}
                        if(r.p != ""){rule = rule+'"nw_proto": "'+r.p+'",';}
                        if(r.a != ""){rule = rule+'"actions": "'+r.a+'",';}
                        if(r.pri != ""){rule = rule+'"priority": "'+r.pri+'",';}
                        rule = rule.slice(0, -1);
                        rule = rule + "}";

                        $.ajax({
                            url: 'http://'+ip+':8080/firewall/rules/'+status[parseInt(r.sw) - 1].switch_id,
                            type: 'POST',
                            crossDomain: true,
                            dataType: "json",
                            data: rule,
                            beforeSend: function(xhr, settings) {
                                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
                                xhr.setRequestHeader("Content-Type","application/json");
                            },
                            success: function(result){},
                            error: function(result){}
                        });
                    }
                });
            }
            loadingView();
        } else {
            //TODO: Error page (controller off)
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

    function openCollapsible(listItemID, headerID, bodyID){
        $(listItemID).addClass("active");
        $(headerID).addClass("active");
        $(bodyID).prop("style","display: block;");
    }

    function closeCollapsible(listItemID, headerID, bodyID){
        $(listItemID).removeClass("active");
        $(headerID).removeClass("active");
        $(bodyID).prop("style","display: none;");
    }

    function showLoadingMask(){
        var body = document.body, html = document.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        $("#loading_mask").prop("style","position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: "+height+"px; background-color: rgba(0,0,0,0.15);");
        $("#loading_mask").removeClass("display-none");
    }

    function hideLoadingMask(){
        $("#loading_mask").addClass("display-none");
    }

});