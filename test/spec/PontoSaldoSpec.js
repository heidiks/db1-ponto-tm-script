describe("PontoSaldo", function() {

	var pontoSaldo;

	beforeEach(function() {
		pontoSaldo = new PontoSaldo();

	    criaMoment = function(hora) {
        	return moment('2011-01-01 ' + hora);
    	};
	});

	it("Deve verificar que é hora extra", function() {
		pontoSaldo.setHorasTrabalhadas("09:00:00");

		expect(pontoSaldo.isHoraExtra()).toBeTruthy();
	});

	it("Deve verificar que NÃO é hora extra", function() {
		pontoSaldo.setHorasTrabalhadas("08:48:00");

		expect(pontoSaldo.isHoraExtra()).not.toBeTruthy();
	});

	it("Deve verificar que jornada trabalhada foi abaixo de 08:38:00", function() {
		pontoSaldo.setHorasTrabalhadas("08:37:00");

		expect(pontoSaldo.isJornadaAbaixo()).toBeTruthy();
	});

	it("Deve verificar que jornada trabalhada NÃO foi abaixo de 08:38:00", function() {
		pontoSaldo.setHorasTrabalhadas("08:39:00");

		expect(pontoSaldo.isJornadaAbaixo()).not.toBeTruthy();
	});

	it("Deve calcular saldo de hora extra para dia útil", function() {
		pontoSaldo.setHorasTrabalhadas("09:11:10");

		expect(pontoSaldo.calculaSaldoHHMMSS(true)).toEqual("00:23:10");
	});

	it("Deve calcular saldo de hora extra para dia NÃO útil", function() {
		pontoSaldo.setHorasTrabalhadas("04:00:00");

		expect(pontoSaldo.calculaSaldoHHMMSS(false)).toEqual("04:00:00");
	});

	it("Deve calcular saldo de hora negativa", function() {
		pontoSaldo.setHorasTrabalhadas("04:00:00");

		expect(pontoSaldo.calculaSaldoNegativoHHMMSS()).toEqual("04:48:00");
	});

});