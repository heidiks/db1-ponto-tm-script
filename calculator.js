var manhaInicio = $('.tabExterna tr').last().children().eq(1).html();
var manhaFim = $('.tabExterna tr').last().children().eq(2).html();
var tardeInicio = $('.tabExterna tr').last().children().eq(3).html();

if(manhaInicio == "" || manhaFim == "" || tardeInicio == "") 
    console.log("Dados Insuficientes!");
else
    console.log("manhainicio:" + manhaInicio + "<br>manhaFim:" + manhaFim + "<br>tardeInicio:" + tardeInicio);