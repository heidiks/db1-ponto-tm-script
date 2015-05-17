var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();

if(manhaInicio == "" || manhaFim == "" || tardeInicio == "") {
    console.log("Dados Insuficientes!");
	return;
} 

var calculaDiferenca = function(horaA, horaB) {
	var momentA = criaMoment(horaA);
	var momentB = criaMoment(horaB);

	return momentA.diff(momentB, 'second', true);
}

var criaMoment = function(hora) {
	return moment(DIA_FICTICIO + hora);
}

var DIA_FICTICIO = "2011-01-01 ";
var JORNADA_TOTAL_SEGUNDOS = 31680;

var periodoTrabalhadoManha = calculaDiferenca(manhaFim, manhaInicio);

var horaSaida = criaMoment(tardeInicio).add(JORNADA_TOTAL_SEGUNDOS - periodoTrabalhadoManha, "second");
console.log("Hora de saída: " + horaSaida.subtract(10, 'minutes').format("HH:mm:ss"));
console.log("Hora extra: " + horaSaida.add(20, 'minutes').format("HH:mm:ss"));