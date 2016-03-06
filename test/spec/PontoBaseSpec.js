describe("PontoBase", function() {

	var pontoBase;

	beforeEach(function() {
		pontoBase = new PontoBase();
	});

	it("Deve conter as variáveis básicas", function() {
		expect(pontoBase.diaBase).toEqual("2011-01-01 ");
		expect(pontoBase.jornadaExtra).toEqual("08:58:00");
		expect(pontoBase.jornadaNormal).toEqual("08:48:00");
		expect(pontoBase.jornadaMinima).toEqual("08:38:00");
	});

	it("Deve setar as horas trabalhadas", function() {
		pontoBase.setHorasTrabalhadas("05:31:14");

		expect(pontoBase.horasTrabalhadas).not.toBeNull();
		expect(pontoBase.horasTrabalhadas.format("05:31:14")).toEqual("05:31:14");
	});

});
