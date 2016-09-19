class DateUtil {

    static criaMoment(hora) {
        return moment('2011-01-01 ' + hora);
    }

    static calculaDiferenca(horaA, horaB) {
        let momentA = DateUtil.criaMoment(horaA);
        let momentB = DateUtil.criaMoment(horaB);

        return momentA.diff(momentB, 'second', true);
    }

}

class PontoBase {

    constructor() {
        this.diaBase = "2011-01-01 ";
        this.jornadaExtra = "08:58";
        this.jornadaNormal = "08:48";
        this.jornadaMinima = "08:38";
        this.horasTrabalhadas = {};
    }

    setHorasTrabalhadas(horas) {
        this.horasTrabalhadas = moment(this.diaBase + horas);
    }

}

class PontoSaldo extends PontoBase {

    calculaSaldoHHMMSS(diaUtil) {
        let day = moment(this.diaBase);
        if(diaUtil) 
            return day.add(DateUtil.calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal), "second").format("HH:mm");

        return this.horasTrabalhadas.format("HH:mm");
    }

    calculaSaldoNegativoHHMMSS() {
        let day = moment(this.diaBase);
        return day.subtract(DateUtil.calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal), "second").format("HH:mm");
    }

    calculaSaldo() {
        return DateUtil.calculaDiferenca(this.horasTrabalhadas.format("HH:mm"),  this.jornadaNormal);
    }

    isHoraExtra() {
        return !this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaExtra, 'time');
    }

    isJornadaAbaixo() {
        return this.horasTrabalhadas.isBefore(this.diaBase + this.jornadaMinima, 'time');
    }

}

class PontoHoje extends PontoBase {
    constructor(p1, p2, p3, p4, p5, p6) {
        super();
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.p5 = p5;
        this.p6 = p6;
        this.jornadaMinimaTotalSegundos = 31680;
        this.existePrevisao = false;
        this.periodoTrabalhadoManha = "";
    }

    timeNow() {
        return moment().format("HH:mm");
    }

    periodoTrabalhado() {
        if(this.isTerceiroPeriodo() && this.p6 != "")
            return DateUtil.calculaDiferenca(this.p2, this.p1) + DateUtil.calculaDiferenca(this.p4, this.p3) + DateUtil.calculaDiferenca(p6, p5);
        else if (this.isTerceiroPeriodo() && this.p6 == "") {
            this.existePrevisao = true;
            this.periodoTrabalhadoManha = DateUtil.calculaDiferenca(this.p2, this.p1) + DateUtil.calculaDiferenca(this.p4, this.p3);

            return this.periodoTrabalhadoManha + DateUtil.calculaDiferenca(this.timeNow(), this.p5);
        }

        if(this.isSegundoPeriodo() && this.p4 != "")
            return DateUtil.calculaDiferenca(this.p2, this.p1) + DateUtil.calculaDiferenca(this.p4, this.p3);
        else if(this.isSegundoPeriodo() & this.p4 == "") {
            this.existePrevisao = true;
            this.periodoTrabalhadoManha = DateUtil.calculaDiferenca(this.p2, this.p1);
            return this.periodoTrabalhadoManha + DateUtil.calculaDiferenca(this.timeNow(), this.p3);
        }

        if(this.p1 != "" && this.p2 != "")
            return DateUtil.calculaDiferenca(this.p2, this.p1);
        else 
            return DateUtil.calculaDiferenca(this.timeNow(), this.p1);
    }

    horaAtualTrabalhadas() {
        return moment(this.diaBase).add(this.periodoTrabalhado(), "second");
    }

    porcentagem_horaAtualTrabalhadas() {
        return this.periodoTrabalhado() * 100 / this.jornadaMinimaTotalSegundos;
    }

    isTerceiroPeriodo() {
        return this.p5 != "" && this.p4 != "" && this.p3 != "";
    }

    isSegundoPeriodo() {
        return this.p1 != "" && this.p2 != "" && this.p3 != "" && this.p5 == "" && this.p6 == "";
    }

    ultimoPonto() {
        if(this.isTerceiroPeriodo())
            return this.p5;

        return this.p3;
    }

    horaSaida() {
        return DateUtil.criaMoment(this.ultimoPonto()).add(pontoHoje.jornadaMinimaTotalSegundos - pontoHoje.periodoTrabalhadoManha, "second");
    }

}

class PontoConferencia extends PontoBase {

    constructor() {
        super();
        this.relatorio = "";
        this.REL_CONFERENCIA_HORAS = "REL_CONFERENCIA_HORAS";
        this.tempoParaAjuste = "03:00";
    }

    setRelatorio() {
        this.relatorio = this.REL_CONFERENCIA_HORAS;
    }

    isRelatorioConferenciaTask() {
        return this.relatorio == this.REL_CONFERENCIA_HORAS;
    }

    isAjustavel(diferenca) {
        return DateUtil.criaMoment(diferenca.replace("-","")).isAfter(this.diaBase + this.tempoParaAjuste, 'time');
    }
}

