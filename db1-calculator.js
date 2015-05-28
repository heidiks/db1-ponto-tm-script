if($(".tabExterna")) {
    $.getScript("http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js");
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.js ");

    DIA_FICTICIO = "2011-01-01 ";

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

    if($("#impRelIndividual")) {
        $("#impRelIndividual").attr("align", "center");
        $("#impRelIndividual").css("width", "60%");
    }

    $(".tabExterna th:last-child, .tabExterna td:last-child").each(function(index) {
        if(index == 0 && $(this).text() != "Total Horas")
            return false;

        var horasTrabalhadas = moment(DIA_FICTICIO + $(this).text());
        if(horasTrabalhadas.isValid() && !horasTrabalhadas.isBefore(DIA_FICTICIO + '08:58:00', 'time')) 
            $(this).append("&nbsp;<span class=\"label label-warning\">Hora extra!</span>");
        else if(horasTrabalhadas.isValid() && horasTrabalhadas.isBefore(DIA_FICTICIO + '08:38:00', 'time') && !horasTrabalhadas.isSame(DIA_FICTICIO + '00:00:00', 'time')) 
            $(this).append("&nbsp;<span class=\"label label-danger\">Jornada abaixo!</span>");
    });


    var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
    var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
    var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();


    if(manhaInicio != "" && manhaFim != "" && tardeInicio != "") {
        var calculaDiferenca = function(horaA, horaB) {
            var momentA = criaMoment(horaA);
            var momentB = criaMoment(horaB);

            return momentA.diff(momentB, 'second', true);
        };

        var criaMoment = function(hora) {
            return moment(DIA_FICTICIO + hora);
        };

        var montaTooltip = function() {
            return "Manh&atilde;: " + manhaInicio + " ~ " + manhaFim + "&#013;Tarde: " + tardeInicio;   
        };

        var JORNADA_TOTAL_SEGUNDOS = 31680;

        var periodoTrabalhadoManha = calculaDiferenca(manhaFim, manhaInicio);

        var horaSaida = criaMoment(tardeInicio).add(JORNADA_TOTAL_SEGUNDOS - periodoTrabalhadoManha, "second");

        if (typeof manhaInicio != 'undefined' && typeof manhaFim != 'undefined' && typeof tardeInicio != 'undefined' && horaSaida.isValid()) {
            $(".tabExterna").parent().prepend(
                "<div id=\"dvCalculator\" class=\"panel panel-primary\" style=\"width:100%\">" +
                    "<div class=\"panel-heading\">" +
                        "<h3 class=\"panel-title\" id=\"panel-title\">Informa&ccedil;&otilde;es<a class=\"anchorjs-link\" href=\"#panel-title\"><span class=\"anchorjs-icon\"></span></a></h3>" +
                    "</div>" +
                    "<div class=\"panel-body\">" +
                        "<span class=\"btn btn-lg btn-success btn-block glyphicon glyphicon-ok\" title=\"" + montaTooltip() + "\"> Saída:" + horaSaida.subtract(10, 'minutes').format("HH:mm:ss") + "</span>" +
                        "<span class=\"btn btn-lg btn-default btn-block glyphicon glyphicon-time\" title=\"" + montaTooltip() + "\"> Extra:" + horaSaida.add(20, 'minutes').format("HH:mm:ss") + "</span>" +
                    "</div>"+
                "</div>"
            );
        }
    } 
}