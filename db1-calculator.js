if($(".tabExterna").length) {
    function Ponto() {
        this.diaBase = "2011-01-01 ";
        this.jornadaExtra = "08:58:00";
        this.jornadaNormal = "08:48:00";
        this.jornadaMinima = "08:38:00";
        this.horasTrabalhadas = {};

        this.calculaDiferenca = function(horaA, horaB) {
            var momentA = criaMoment(horaA);
            var momentB = criaMoment(horaB);

            return momentA.diff(momentB, 'second', true);
        };

        this.calculaSaldoHHMMSS = function() {
            var day = moment(this.diaBase);
            return day.add(calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00'), "second").format("HH:mm:ss");
        };        

        this.calculaSaldoNegativoHHMMSS = function() {
            var day = moment(this.diaBase);
            return day.subtract(calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00'), "second").format("HH:mm:ss");
        };

        this.setHorasTrabalhadas = function(horas) {
            this.horasTrabalhadas = moment(this.diaBase + horas); 
        }

        this.calculaSaldo = function() {
            return calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00');
        }
    }

    DIA_FICTICIO = "2011-01-01 ";

    criaMoment = function(hora) {
        return moment(DIA_FICTICIO + hora);
    };

    calculaDiferenca = function(horaA, horaB) {
        var momentA = criaMoment(horaA);
        var momentB = criaMoment(horaB);

        return momentA.diff(momentB, 'second', true);
    };

    enviarDadosBanco = function save(tempo, dataBanco) {
        var myAPIKey = "mcuYk7MMzXmVENumYTvTSeHXRm5GNQT3";
        
        var dataAdicao = new Date();
        var url = "https://api.mongolab.com/api/1/databases/db1_banco_horas/collections/banco?apiKey="+myAPIKey;
        var data = JSON.stringify({"dataAdicao": dataAdicao, "tempo" : tempo,  "dataBanco": dataBanco,}); 
         
        $.ajax(
          { url: url,
                data: data,
              type: "POST",
              contentType: "application/json" 
          });
    }

    // gambeta para carregar css
    var cssId = 'myCss';
    if (!document.getElementById(cssId))
    {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css';
        link.media = 'all';
        head.appendChild(link);
    }

    $(".tabExterna").addClass(" table table-striped table-bordered table-hover");
    $(".tabExterna").parent().parent().next().children().addClass("alert alert-warning");

    if($("#impRelIndividual")) {
        $("#impRelIndividual").attr("align", "center");
        $("#impRelIndividual").css("width", "55%");
    }

    $(".tabExterna th:last-child, .tabExterna td:last-child").each(function(index) {
        if((index == 0 && $(this).text() != "Total Horas"))
            return false;

        var JORNADA_NORMAL = '08:58:00';
        isDiaUtil = function(elemento) {
            return elemento.parent().children().first().text().indexOf("Sab.") < 0 && elemento.parent().children().first().text().indexOf("Dom.") < 0;
        }

        var jornada = new Ponto();
        jornada.setHorasTrabalhadas($(this).text());

        if((jornada.horasTrabalhadas.isValid() && !jornada.horasTrabalhadas.isBefore(DIA_FICTICIO + JORNADA_NORMAL, 'time')) || (!isDiaUtil($(this)) && jornada.horasTrabalhadas.isAfter(DIA_FICTICIO + '00:00:01', 'time'))) 
            $(this).append("&nbsp;<span class=\"label label-warning\" style=\"font-size:9px\" title=\"Hora extra\" onClick=\"enviarDadosBanco("+ jornada.calculaSaldo() + ",'"+$(this).parent().children().first().text().slice(0,5).concat("/").concat(new Date().getFullYear()).replace("/", "-").replace("/", "-").trim() + "') \">+"+ jornada.calculaSaldoHHMMSS() + "</span>");
        else if(jornada.horasTrabalhadas.isValid() && jornada.horasTrabalhadas.isBefore(DIA_FICTICIO + '08:38:00', 'time') && !jornada.horasTrabalhadas.isSame(DIA_FICTICIO + '00:00:00', 'time')) 
            $(this).append("&nbsp;<span class=\"label label-danger\" style=\"font-size:9px\" title=\"Jornada abaixo\" onClick=\"enviarDadosBanco("+ jornada.calculaSaldo() + ",'" + $(this).parent().children().first().text().slice(0,5).concat("/").concat(new Date().getFullYear()).replace("/", "-").replace("/", "-").trim() + "')\">-" + jornada.calculaSaldoNegativoHHMMSS() + "</span>");
        else if(jornada.horasTrabalhadas.isSame(DIA_FICTICIO + '00:00:00', 'time'))
            $(this).parent().addClass("info");
    });

    var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
    var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
    var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();
    var tardeFim = $('.tabExterna tr').last().children().eq(4).html();

    if(manhaInicio != "" && manhaFim != "" && tardeInicio != "" && tardeFim == "") {
        var JORNADA_MINIMA_TOTAL_SEGUNDOS = 31680;

        var timeNow = function() {
            return moment().format("HH:mm:ss");
        };

        var periodoTrabalhadoManha = function() {
            return calculaDiferenca(manhaFim, manhaInicio);
        };

        var horaAtualTrabalhadas = function() {
            return moment(DIA_FICTICIO).add(periodoTrabalhadoManha() + calculaDiferenca(timeNow(), tardeInicio), "second");
        };

        var porcentagem_horaAtualTrabalhadas = function() {
            return (periodoTrabalhadoManha() + calculaDiferenca(timeNow(), tardeInicio)) * 100 / JORNADA_MINIMA_TOTAL_SEGUNDOS;
        };

        refresh = function() {
            $("#horarioCumprido").text(horaAtualTrabalhadas().format("HH:mm"));
            
            var porcentagem = parseInt(porcentagem_horaAtualTrabalhadas());
            $("#progress-bar").css("width", porcentagem + "%").text(parseInt(porcentagem) +"%");
        };

        var horaSaida = criaMoment(tardeInicio).add(JORNADA_MINIMA_TOTAL_SEGUNDOS - periodoTrabalhadoManha(), "second");

        if (typeof manhaInicio != 'undefined' && typeof manhaFim != 'undefined' && typeof tardeInicio != 'undefined' && horaSaida.isValid()) {
            $(".tabExterna").parent().prepend(
                "<div align=\"center\">" +
                    "<button class=\"btn btn-default pull-right glyphicon glyphicon-refresh\" onClick=\"refresh()\"></button>" +
                    "<div class=\"well well-lg\">" +
                        "<h2>Voc&ecirc; j&aacute; cumpriu <strong><span id=\"horarioCumprido\">"+ horaAtualTrabalhadas().format("HH:mm") +"</span></strong> horas</h2>" +
                            "<div class=\"progress\">" +
                                "<div id=\"progress-bar\" class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ porcentagem_horaAtualTrabalhadas() + "%\">" +
                                    parseInt(porcentagem_horaAtualTrabalhadas()) +"%" + 
                                "</div>" +
                            "</div>" +
                        "<h4>Jornada:</h4>\n" +
                         "<h4><span class=\"label label-success\">M&iacute;nima: " + horaSaida.subtract(10, 'minutes').format("HH:mm") + "</span>\n" +
                        "<span class=\"label label-primary\">Normal: " + horaSaida.add(10, 'minutes').format("HH:mm") + "</span>\n" + 
                        "<span class=\"label label-warning\">Extra: " + horaSaida.add(10, 'minutes').format("HH:mm") + "</span> </h4>\n" +
                    "</div>\n" +
                "</div>"
            );
        }
    } 
}   