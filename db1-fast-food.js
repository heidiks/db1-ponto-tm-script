/**
 * Created by gabriel.amaral on 01/09/2015.
 */
if($(".tr_cont").length) {

    var cardapioVisivel = false;

    appendNewDiv = function (container, idNewDiv) {
        container.append("<div id=\"" +idNewDiv+ "\"></div>");
        return $("#"+idNewDiv);
    };

    //INIT
    var content = appendNewDiv($(".tr_cont").parent().parent(),"content");

    exibirCardapio = function() {
        if(!cardapioVisivel) {
            var divCardapio = appendNewDiv(content,"cardapio");
            divCardapio.append("<iframe width=\"100%\" height=\"100%\" src=\"http://www.gastronomiacolherdepau.com.br.usrfiles.com/html/36e98f_eb1aa3ea000108896b1ae72b4c069a5e.html\"></iframe>");
            cardapioVisivel = true;
        }
    };

    abrirPedido = function() {

    };

    // criando e adicionado os botoes
    var btnCardapio = "<button class=\"btn btn-default pull-right glyphicon glyphicon-lst-alt\" onClick=\"exibirCardapio()\">Cardápio do dia</button>";
    var btnPedido = "<button class=\"btn btn-default pull-right glyphicon glyphicon-clutery\" onClick=\"abrirPedido()\">Fazer Pedido</button>";
    var divBotoes = appendNewDiv(content, "botoes");
    divBotoes.append(btnCardapio).append(btnPedido);

}
