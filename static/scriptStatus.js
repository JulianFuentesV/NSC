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

    var swIds = [];

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
                            +'   <li id="itemFw">'
                            +'    <div class="collapsible-header active"><i class="material-icons">view_column</i>Firewall Status</div>'
                            +'    <div id="bodyFw" class="collapsible-body center-align"><span>';
                        var check = "";
                        data.forEach(function(element) {
                            switchID = element.switch_id;
                            swIds.push(switchID);
                            status = element.status;
                            console.log("status: "+status);
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

    $("#information").on("click",".cb_fw",function(){
        // Mascara para no permitir mas clicks
        showLoadingMask();
        // Hacer peticion
        var idClicked = this.id.split("_")[1]; //id switch clickeado
        console.log(idClicked);
        var isChecked = this.checked;
        console.log(isChecked);
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
                    console.log("response rules");
                    console.log(response);
                    var acl = response[0].access_control_list;
                    if(acl[0]){
                        $("#rules_"+sid).html();
                        var cont = "";
                        for(i = 0; i < acl[0].rules.length; i++){
                            var rules = acl[0].rules[i];
                            cont = cont + "<p style='margin: 0 14px; padding: 0; text-align: left;'>"+rules.rule_id+". Source: "+rules.nw_src+" - Destination: "+rules.nw_dst+" - Protocol: "+rules.nw_proto
                            +" - Actions: "+rules.actions+" - Priority: "+rules.priority+" - Type: "+rules.dl_type+". <button id='btn_"+sid+"_"+rules.rule_id+"' class='delete_rule' style='background: #FF2200; color: #fff; border: 1px solid #fff; border-radius: 10px;'>Delete</button></p>";
                        }
                        $("#rules_"+sid).html(cont);
                    } else {
                        $("#rules_"+sid).html("Rules not found.");
                    }
                    console.log(response[0]);
                    console.log("p");
                    console.log(response[0].access_control_list[0]);
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
            $('select').material_select();
            hideLoadingMask();
        } else {
            // Close tab
        }
    });

    $("#information").on("click","#btn_addrule",function(){
        showLoadingMask();
        csrftoken = Cookies.get('csrftoken');
        console.log("CLICK ADD RULE");
        console.log($("#select_fw").val());
        console.log($("#source").val());
        console.log($("#destination").val());
        console.log($("#protocol").val());
        console.log($("#actions").val());
        console.log($("#priority").val());

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
                console.log("SUCCESS");
                console.log(result);
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
        console.log("Delete rule");
        var btn_id = this.id.split("_");
        var swid = btn_id[1];
        var ruleid = btn_id[2];
        console.log(swid+"|"+ruleid);
        $.ajax({
            url: "http://"+ip+":8080/firewall/rules/"+swid,
            type: "DELETE",
            data: '{"rule_id": '+ruleid+'}',
            beforeSend: function(xhr, settings) {
                //xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(result){
                console.log("SUCCESS");
                console.log(result);
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

    /*function setLoadingMask(cont){
        $(cont).append('<div id="loading_mask" style="position: relative; background: rgba(0,0,0,0.25);">'
                +' <div class="preloader-wrapper big active">'
                +'     <div class="spinner-layer spinner-blue">'
                +'         <div class="circle-clipper left">'
                +'         <div class="circle"></div>'
                +'         </div><div class="gap-patch">'
                +'         <div class="circle"></div>'
                +'         </div><div class="circle-clipper right">'
                +'         <div class="circle"></div>'
                +'         </div>'
                +'     </div>'
                +'     <div class="spinner-layer spinner-red">'
                +'         <div class="circle-clipper left">'
                +'         <div class="circle"></div>'
                +'         </div><div class="gap-patch">'
                +'         <div class="circle"></div>'
                +'         </div><div class="circle-clipper right">'
                +'         <div class="circle"></div>'
                +'         </div>'
                +'     </div>'
                +'     <div class="spinner-layer spinner-yellow">'
                +'         <div class="circle-clipper left">'
                +'         <div class="circle"></div>'
                +'         </div><div class="gap-patch">'
                +'         <div class="circle"></div>'
                +'         </div><div class="circle-clipper right">'
                +'         <div class="circle"></div>'
                +'         </div>'
                +'     </div>'
                +'    <div class="spinner-layer spinner-green">'
                +'        <div class="circle-clipper left">'
                +'        <div class="circle"></div>'
                +'        </div><div class="gap-patch">'
                +'        <div class="circle"></div>'
                +'        </div><div class="circle-clipper right">'
                +'        <div class="circle"></div>'
                +'        </div>'
                +'    </div>'
                +'</div>'
            +'</div>');
    }*/

});