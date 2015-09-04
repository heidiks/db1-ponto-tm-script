function PontoBox(pontoHoje) {
    this.box = "";

    this.getBox() {
        return this.box;
    };

    this.montaProgress() {
        return 
            "<h2>Voc&ecirc; j&aacute; cumpriu <strong><span id=\"horarioCumprido\">"+ pontoHoje.horaAtualTrabalhadas().format("HH:mm") +"</span></strong> horas</h2>" +
            "<div class=\"progress\">" +
                "<div id=\"progress-bar\" class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+ pontoHoje.porcentagem_horaAtualTrabalhadas() + "%\">" +
                parseInt(pontoHoje.porcentagem_horaAtualTrabalhadas()) +"%" +
                "</div>" +
            "</div>";

    }

    this.montaHorarios() {
        if(true)
            return 
                "<h4>Jornada:</h4>\n" +
                "<h4><span class=\"label label-success\">M&iacute;nima: " + horaSaida.subtract(10, 'minutes').format("HH:mm") + "</span>\n" +
                "<span class=\"label label-primary\">Normal: " + horaSaida.add(10, 'minutes').format("HH:mm") + "</span>\n" +
                "<span class=\"label label-warning\">Extra: " + horaSaida.add(10, 'minutes').format("HH:mm") + "</span> </h4>\n";
        else
            return
                "<h4>Jornada:</h4>\n<h4>" +
                "<span class=\"label label-default\">Dados insuficientes para calculo de jornada!</span>"
                "</h4>\n";
    }

    this.build() {
        this.box =
            "<div align=\"center\">" +
                "<button class=\"btn btn-default pull-right glyphicon glyphicon-refresh\" onClick=\"refresh()\"></button>" +
                "<div class=\"well well-lg\">" +
                    this.montaProgress() +
                    this.montaHorarios() +
                "</div>" +
            "</div>";
    }

}