$(document).ready(function(){

    var ip = "192.168.0.26:8080"

    var board;
    var element;
    window.addEventListener('load', init);
    function init(){
        var items = document.getElementsByClassName("item");
        board = document.getElementById("board");

        board.addEventListener('dragover', dragOver, false);
        board.addEventListener('dragleave', dragLeave, false);
        board.addEventListener('drop', dropStart, false);

        //board.addEventListener('click', onClick, false);

        for(var i in items){
            items[i].addEventListener('dragstart', dragStart, false);
            items[i].addEventListener('dragend', dragEnd, false);
            items[i].addEventListener('mouseover', onMouseOver, false);
            items[i].addEventListener('mouseout', onMouseOut, false);
        }
    }

    function dragStart(e){
        //this.style.backgroundColor = "blue";
        /*element = this;
        var dad = document.createElement("p");
        var child = this.cloneNode(true);
        dad.appendChild(child);*/
        e.dataTransfer.setData("id_element", e.target.id);
    }

    function dragOver(e){
        e.preventDefault();
        //this.style.backgroundColor = "yellow";
    }

    function dragLeave(e){
        //this.style.backgroundColor = "green";
    }

    function dragEnd(e){
        //this.style.backgroundColor = "red";
    }

    function dropStart(e){
        e.preventDefault();
        var connector = "<img id='arrow' src='/static/images/arrow.png' style='vertical-align: top; margin-top: 55px;'/>";
        var data = e.dataTransfer.getData("id_element");
        //var elem = document.getElementById(data); //JS
        var $elem = $("#"+data); //jQuery
        //var clone = elem.cloneNode(true); //JS
        var $clone = $elem.clone();
        //clone.setAttribute('draggable', false);
        $clone.attr('draggable', false);
        $clone.attr('id', data+"_OnBoard");
        $clone.removeClass('c_move');
        this.innerHTML += connector;
        //this.innerHTML += data;
        //e.target.appendChild(connector);
        //e.target.appendChild($clone);
        $clone.appendTo(e.target);
        $clone.click(function(){
            switch($clone.attr("id")){
                case 'firewall_OnBoard':
                    $("#modal_title").text("Firewall Configuration");
                    $.getJSON("http://"+ip+"/firewall/module/status", function(data){
                        $("#modal_var_1").text("Status: "+data[0].status);
                    });
                    /*$.ajax({
                        url: "http://192.168.0.22:8080/firewall/module/status",
                        dataType: 'jsonp',
                        crossDomain: true,
                        success:function(json){
                            console.log("Success: "+json);
                        },
                        error:function(json){
                            console.log("Error: "+json.status);
                        }
                    });*/
            }
            $('.modal').modal();
            $('#modal_config').modal('open');
        });
        console.log("CON: "+connector);
        console.log("DAT: "+data);
        //element.parentNode.removeChild(element);
    }

    function onClick(e){
        console.log("clickkkedddd!");
    }

    function onMouseOver(e){
        console.log("onMouseOver!");
    }

    function onMouseOut(e){
        console.log("onMouseOUT!");
    }

    function cleanBoard(){
        board.innerHTML = "";
    }
});

/* ------ TODO:
    items tooltip (materializecss)
    btn restart with cleanBoard()
*/