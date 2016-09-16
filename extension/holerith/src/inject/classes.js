//EC6 TODO classes
calculaDiferenca = function(horaA, horaB) {
    var momentA = criaMoment(horaA);
    var momentB = criaMoment(horaB);

    return momentA.diff(momentB, 'second', true);
};

function PontoBase() {
    this.diaBase = "2011-01-01 ";
    this.jornadaExtra = "08:59";
    this.jornadaNormal = "08:49";
    this.jornadaMinima = "08:39";
    this.horasTrabalhadas = {};

    this.setHorasTrabalhadas = function(horas) {
        this.horasTrabalhadas = moment(this.diaBase + horas);
    };

}

function PontoSaldo() {
    this.calculaSaldoHHMMSS = function(diaUtil) {
        var day = moment(this.diaBase);
        if(diaUtil) 
            return day.add(calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal), "second").format("HH:mm");

        return this.horasTrabalhadas.format("HH:mm");
    };

    this.calculaSaldoNegativoHHMMSS = function() {
        var day = moment(this.diaBase);
        return day.subtract(calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal), "second").format("HH:mm");
    };

    this.calculaSaldo = function() {
        return calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal);
    };

    this.isHoraExtra = function() {
        return !this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaExtra, 'time');
    };

    this.isJornadaAbaixo = function () {
        return this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaMinima, 'time');
    };

}

PontoSaldo.prototype = new PontoBase();

function PontoHoje(p1, p2, p3, p4, p5, p6) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
    this.p5 = p5;
    this.p6 = p6;
    this.jornadaMinimaTotalSegundos = 31680;
    this.existePrevisao = false;
    this.periodoTrabalhadoManha = "";

    this.timeNow = function() {
        return moment().format("HH:mm");
    };

    this.periodoTrabalhado = function() {
        if(this.isTerceiroPeriodo() && this.p6 != "")
            return calculaDiferenca(this.p2, this.p1) + calculaDiferenca(this.p4, this.p3) + calculaDiferenca(p6, p5);
        else if (this.isTerceiroPeriodo() && this.p6 == "") {
            this.existePrevisao = true;
            this.periodoTrabalhadoManha = calculaDiferenca(this.p2, this.p1) + calculaDiferenca(this.p4, this.p3);

            return this.periodoTrabalhadoManha + calculaDiferenca(this.timeNow(), this.p5);
        }

        if(this.isSegundoPeriodo() && this.p4 != "")
            return calculaDiferenca(this.p2, this.p1) + calculaDiferenca(this.p4, this.p3);
        else if(this.isSegundoPeriodo() & this.p4 == "") {
            this.existePrevisao = true;
            this.periodoTrabalhadoManha = calculaDiferenca(this.p2, this.p1);
            return this.periodoTrabalhadoManha + calculaDiferenca(this.timeNow(), this.p3);
        }

        if(this.p1 != "" && this.p2 != "")
            return calculaDiferenca(this.p2, this.p1);
        else 
            return calculaDiferenca(this.timeNow(), this.p1);
    };

    this.horaAtualTrabalhadas = function() {
        return moment(this.diaBase).add(this.periodoTrabalhado(), "second");
    };

    this.porcentagem_horaAtualTrabalhadas = function() {
        return this.periodoTrabalhado() * 100 / this.jornadaMinimaTotalSegundos;
    };

    this.isTerceiroPeriodo = function() {
        return this.p5 != "" && this.p4 != "" && this.p3 != "";
    };

    this.isSegundoPeriodo = function() {
        return this.p1 != "" && this.p2 != "" && this.p3 != "" && this.p5 == "" && this.p6 == "";
    };

    this.ultimoPonto = function() {
        if(this.isTerceiroPeriodo())
            return this.p5;

        return this.p3;
    };

    this.horaSaida = function() {
        return criaMoment(this.ultimoPonto()).add(pontoHoje.jornadaMinimaTotalSegundos - pontoHoje.periodoTrabalhadoManha, "second");
    };

}

PontoHoje.prototype = new PontoBase();

function PontoConferencia() {
    this.relatorio = "";
    this.REL_CONFERENCIA_HORAS = "REL_CONFERENCIA_HORAS";
    this.tempoParaAjuste = "03:00";

    this.setRelatorio = function() {
        this.relatorio = this.REL_CONFERENCIA_HORAS;
    };

    this.isRelatorioConferenciaTask = function() {
        return this.relatorio == this.REL_CONFERENCIA_HORAS;
    };

    this.isAjustavel = function(diferenca) {
        return criaMoment(diferenca.replace("-","")).isAfter(this.diaBase + this.tempoParaAjuste, 'time'); 
    };
}

PontoConferencia.prototype = new PontoBase();