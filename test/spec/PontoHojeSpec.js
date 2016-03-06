describe("PontoHoje", function() {

	var pontoHoje;

	beforeEach(function() {
		pontoHoje = new PontoHoje("08:29:38", "11:58:25", "13:08:33", "18:40:53", "", "");

	    criaMoment = function(hora) {
        	return moment('2011-01-01 ' + hora);
    	};
	});

	it("Deve calcular as horas trabalhadas", function() {
		expect(pontoHoje.horaAtualTrabalhadas().format("HH:MM:SS")).toEqual(criaMoment("09:01:07").format("HH:MM:SS"));
	});

});