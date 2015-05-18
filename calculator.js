var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();

if(manhaInicio == "" || manhaFim == "" || tardeInicio == "") {
    console.log("Dados Insuficientes!");
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

// gambeta para carregar css
if (!document.getElementById('myCss'))
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

if(manhaInicio != "" || manhaFim != "" || tardeInicio != "") {
	$("body").append (
		'<div id="dvCalculator"><span class="btn btn-lg btn-primary glyphicon glyphicon-ok" title="Hora minima de  sa&iacute;da"> Sa&iacute;da<br>&nbsp;'
		+ horaSaida.subtract(10, 'minutes').format("HH:mm:ss") +
		'&nbsp;</span><span class="btn btn-lg btn-warning glyphicon glyphicon-time" title="Hora extra m&iacute;nima"> Extra<br>&nbsp;'
		+ horaSaida.add(20, 'minutes').format("HH:mm:ss") +
		'&nbsp;</span></div>'
	);
}