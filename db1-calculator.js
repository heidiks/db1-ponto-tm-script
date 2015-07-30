function PontoBase() {
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

    this.setHorasTrabalhadas = function(horas) {
        this.horasTrabalhadas = moment(this.diaBase + horas);
    };
}

function PontoSaldo() {
    this.calculaSaldoHHMMSS = function() {
        var day = moment(this.diaBase);
        return day.add(calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00'), "second").format("HH:mm:ss");
    };

    this.calculaSaldoNegativoHHMMSS = function() {
        var day = moment(this.diaBase);
        return day.subtract(calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00'), "second").format("HH:mm:ss");
    };

    this.calculaSaldo = function() {
        return calculaDiferenca(this.horasTrabalhadas.format("HH:mm:ss"), '08:48:00');
    };

    this.isHoraExtra = function() {
        return !this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaExtra, 'time'));
    };

    this.isJornadaAbaixo = function () {
        return this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaMinima, 'time');
    };

}

PontoSaldo.prototype = new PontoBase();

function PontoHoje(manhaInicio, manhaFim, tardeInicio, tardeFim) {
    this.manhaInicio = manhaInicio;
    this.manhaFim = manhaFim;
    this.tardeInicio = tardeInicio;
    this.tardeFim = tardeFim;
    this.jornadaMinimaTotalSegundos = 31680;

    this.timeNow = function() {
        return moment().format("HH:mm:ss");
    };

    this.periodoTrabalhadoManha = function() {
        return calculaDiferenca(this.manhaFim, this.manhaInicio);
    };

    this.horaAtualTrabalhadas = function() {
        return moment(this.diaBase).add(periodoTrabalhadoManha() + calculaDiferenca(timeNow(), this.tardeInicio), "second");
    };

    this.porcentagem_horaAtualTrabalhadas = function() {
        return (periodoTrabalhadoManha() + calculaDiferenca(timeNow(), this.tardeInicio)) * 100 / this.jornadaMinimaTotalSegundos;
    };

    this.horaSaida = criaMoment(this.tardeInicio).add(this.jornadaMinimaTotalSegundos - periodoTrabalhadoManha(), "second");

}

PontoHoje.prototype = new PontoBase();


if($(".tabExterna").length) {

    criaMoment = function(hora) {
        return moment('08:58:00' + hora);
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
    };

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

        isDiaUtil = function(elemento) {
            return elemento.parent().children().first().text().indexOf("Sab.") < 0 && elemento.parent().children().first().text().indexOf("Dom.") < 0;
        };

        var jornada = new PontoSaldo();
        jornada.setHorasTrabalhadas($(this).text());

        if((jornada.horasTrabalhadas.isValid() && jornada.isHoraExtra() || (!isDiaUtil($(this)) && jornada.horasTrabalhadas.isAfter(jornada.diaBase + '00:00:01', 'time'))))
            $(this).append("&nbsp;<span class=\"label label-warning\" style=\"font-size:9px\" title=\"Hora extra\" onClick=\"enviarDadosBanco("+ jornada.calculaSaldo() + ",'"+$(this).parent().children().first().text().slice(0,5).concat("/").concat(new Date().getFullYear()).replace("/", "-").replace("/", "-").trim() + "') \">+"+ jornada.calculaSaldoHHMMSS() + "</span>");
        else if(jornada.horasTrabalhadas.isValid() && jornada.isJornadaAbaixo() && !jornada.horasTrabalhadas.isSame(jornada.diaBase + '00:00:00', 'time'))
            $(this).append("&nbsp;<span class=\"label label-danger\" style=\"font-size:9px\" title=\"Jornada abaixo\" onClick=\"enviarDadosBanco("+ jornada.calculaSaldo() + ",'" + $(this).parent().children().first().text().slice(0,5).concat("/").concat(new Date().getFullYear()).replace("/", "-").replace("/", "-").trim() + "')\">-" + jornada.calculaSaldoNegativoHHMMSS() + "</span>");
        else if(jornada.horasTrabalhadas.isSame(jornada.diaBase + '00:00:00', 'time'))
            $(this).parent().addClass("info");
    });

    var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
    var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
    var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();
    var tardeFim = $('.tabExterna tr').last().children().eq(4).html();

    if(manhaInicio != "" && manhaFim != "" && tardeInicio != "" && tardeFim == "") {
        var pontoHoje = new PontoHoje(manhaInicio, manhaFim, tardeInicio, tardeFim);

        refresh = function() {
            $("#horarioCumprido").text(pontoHoje.horaAtualTrabalhadas().format("HH:mm"));

            var porcentagem = parseInt(pontoHoje.porcentagem_horaAtualTrabalhadas());
            $("#progress-bar").css("width", porcentagem + "%").text(parseInt(porcentagem) +"%");
        };


        if (typeof pontoHoje.manhaInicio != 'undefined' && typeof pontoHoje.manhaFim != 'undefined' && typeof pontoHoje.tardeInicio != 'undefined' && pontoHoje.horaSaida.isValid()) {
            $(".tabExterna").parent().prepend(
                "<div align=\"center\">" +
                "<button class=\"btn btn-default pull-right glyphicon glyphicon-refresh\" onClick=\"refresh()\"></button>" +
                "<div class=\"well well-lg\">" +
                "<h2>Voc&ecirc; j&aacute; cumpriu <strong><span id=\"horarioCumprido\">"+ pontoHoje.horaAtualTrabalhadas().format("HH:mm") +"</span></strong> horas</h2>" +
                "<div class=\"progress\">" +
                "<div id=\"progress-bar\" class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ pontoHoje.porcentagem_horaAtualTrabalhadas() + "%\">" +
                parseInt(pontoHoje.porcentagem_horaAtualTrabalhadas()) +"%" +
                "</div>" +
                "</div>" +
                "<h4>Jornada:</h4>\n" +
                "<h4><span class=\"label label-success\">M&iacute;nima: " + pontoHoje.horaSaida.subtract(10, 'minutes').format("HH:mm") + "</span>\n" +
                "<span class=\"label label-primary\">Normal: " + pontoHoje.horaSaida.add(10, 'minutes').format("HH:mm") + "</span>\n" +
                "<span class=\"label label-warning\">Extra: " + pontoHoje.horaSaida.add(10, 'minutes').format("HH:mm") + "</span> </h4>\n" +
                "</div>\n" +
                "</div>"
            );
        }
    }
}   