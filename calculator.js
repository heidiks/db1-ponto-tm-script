var manhaInicio = "08:17:24";
var manhaFim = "12:03:39";
var tardeInicio = "13:17:34";

/*var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();*/

if(manhaInicio == "" || manhaFim == "" || tardeInicio == "") 
    console.log("Dados Insuficientes!");
//else
//    console.log("manhainicio:" + manhaInicio + "<br>manhaFim:" + manhaFim + "<br>tardeInicio:" + tardeInicio);


var DIA_FICTICIO = "2011-01-01 ";
var JORNADA_TOTAL_SEGUNDOS = 31680;

var a = moment(DIA_FICTICIO + manhaInicio);
var b = moment(DIA_FICTICIO + manhaFim);

var periodoTrabalhadoManha = b.diff(a, 'second', true);

//console.log(b.diff(a, 'second', true));
//console.log(JORNADA_TOTAL_SEGUNDOS - periodoTrabalhadoManha);

var horaSaida = moment(DIA_FICTICIO + tardeInicio).add(JORNADA_TOTAL_SEGUNDOS - periodoTrabalhadoManha, "second");
console.log("Hora de saída: " + horaSaida.subtract(10, 'minutes').format("HH:mm:ss"));