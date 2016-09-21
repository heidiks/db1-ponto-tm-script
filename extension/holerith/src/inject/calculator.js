refreshBox = function() {
    $("#horarioCumprido").text(pontoHoje.horaAtualTrabalhadas().format("HH:mm"));

    var porcentagem = pontoHoje.porcentagem_horaAtualTrabalhadas();
    $("#progress-bar").css("width", porcentagem + "%").text(parseInt(porcentagem) +"%");
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

$(".td_horas_trabalhadas").each(function(index) {
    //PINTAR linha :)
});

var today = $(".espelho_ponto_pontofopag.espelho_ponto_selecao tbody tr td:contains('" + moment().format("DD/MM/YYYY") +"')").parent()

var p1 = today.children().eq(3).text() === "--:--" ? "" : today.children().eq(3).text();
var p2 = today.children().eq(4).text() === "--:--" ? "" : today.children().eq(4).text();
var p3 = today.children().eq(5).text() === "--:--" ? "" : today.children().eq(5).text();
var p4 = today.children().eq(6).text() === "--:--" ? "" : today.children().eq(6).text();
var p5 = today.children().eq(7).text() === "--:--" ? "" : today.children().eq(7).text();
var p6 = today.children().eq(8).text() === "--:--" ? "" : today.children().eq(8).text();

pontoHoje = new PontoHoje(p1, p2, p3, p4, p5, p6);

if(pontoHoje.p1 != "") {

    function PontoBoxBuilder(pontoHoje) {
        this.box = "";

        this.getBox = function() {
            return this.box;
        };

        this.montaProgress = function() {
            var tempoString = pontoHoje.horaAtualTrabalhadas().isBefore(pontoHoje.diaBase + "01:00", 'time') ? "minutos": "horas";
            return "<h2>Voc&ecirc; j&aacute; cumpriu <strong><span id=\"horarioCumprido\">"+ pontoHoje.horaAtualTrabalhadas().format("HH:mm") +"</span></strong> "+ tempoString + "</h2>" +
                "<div class=\"progress\">" +
                    "<div id=\"progress-bar\" class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ pontoHoje.porcentagem_horaAtualTrabalhadas() + "%\">" +
                    parseInt(pontoHoje.porcentagem_horaAtualTrabalhadas()) +"%" +
                    "</div>" +
                "</div>";
        };

        this.montaPrevisaoHorarios = function() {
            if(pontoHoje.existePrevisao) {
                return "<h4>Jornada:</h4>\n" +
                    "<h4><span class=\"label label-success\" title=\"Hor&aacute;rio m&iacute;nimo para sa&iacute;da, com toler&acirc;ncia de -10 minutos totalizando 8 horas e 38 minutos.\">M&iacute;nima: " + pontoHoje.horaSaida().subtract(10, 'minutes').format("HH:mm") + "</span>\n" +
                    "<span class=\"label label-primary\" title=\"Hor&aacute;rio normal de sa&iacute;da, totalizando a jornada de 8 horas e 48 minutos.\">Normal: " + pontoHoje.horaSaida().format("HH:mm") + "</span>\n" +
                    "<span class=\"label label-warning\" title=\"Hor&aacute;rio para começar a contabilizar hora extra, +8 horas e 58 minutos.\">Extra: " + pontoHoje.horaSaida().add(10, 'minutes').format("HH:mm") + "</span> </h4>\n";
            } else {
                return "<h4>Jornada:</h4>\n<h4>" +
                    "<span style=\"font-size:35px\" class=\"label-inverse glyphicon glyphicon-exclamation-sign\" title=\"Sem previs&atilde;o para o estado atual.\"></span>" +
                    "</h4>\n";
            }
        };

        this.build = function() {
            this.box =
                "<div align=\"center\">" +
                    "<div class=\"btn btn-default pull-right glyphicon glyphicon-refresh\" onClick=\"refreshBox()\"></div>" +
                    "<div class=\"well well-lg\">" +
                        this.montaProgress() +
                        "\n" +
                        this.montaPrevisaoHorarios() +
                    "</div>" +
                "</div>";

            return this;
        };
    }

    pontoBox = new PontoBoxBuilder(pontoHoje).build();



    if (pontoHoje.horaSaida().isValid()) {
        $("#content").parent().append(
            pontoBox.getBox()
        );
    }

    //TODO fazer um método/modal 
    localStorage.setItem("minimumNotification", "S");
    var notified = false;
    if(localStorage.getItem("minimumNotification") != null && localStorage.getItem("minimumNotification") != "" && localStorage.getItem("minimumNotification") == "S") {
        var countdownLoop = setInterval(function () {
            if(notified)
                clearInterval(countdownLoop);
            else {
                if (Notification.permission === "granted" && pontoHoje.existePrevisao && DateUtil.criaMoment(moment().format("HH:mm")).isAfter(pontoHoje.horaSaida().subtract(10, 'minutes'))) {
                    createNotification("mínima", pontoHoje.horaSaida().subtract(10, 'minutes').format("HH:mm"));
                    notified = true;
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function (permission) {
                        if (permission === "granted" && pontoHoje.existePrevisao && DateUtil.criaMoment(moment().format("HH:mm")).isAfter(pontoHoje.horaSaida().subtract(10, 'minutes')))  {
                            createNotification("mínima", pontoHoje.horaSaida().subtract(10, 'minutes').format("HH:mm"));
                            notified = true;    
                        }
                    });
                }
            }
        }, 10000);
    }

    function createNotification(label, horario) {
        var options = {
            body:  moment().format("DD/MM/YYYY") + " - " + horario,
            icon: 'http://www.db1.com.br/assets/images/logo.png'
        }

        return new Notification("Jornada "+ label +" cumprida!", options);
    }

}

 

