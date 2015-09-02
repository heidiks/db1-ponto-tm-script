/**
 * Created by gabriel.amaral on 01/09/2015.
 */
if($(".tr_cont").length) {

    var cardapioVisivel = false;

    appendNewDiv = function (container, idNewDiv) {
        var newDiv = "<div id=\"" +idNewDiv+ "\"></div>";
        container.append(newDiv);
        return $("#"+idNewDiv);
    };

    //INIT
    var content = appendNewDiv($(".tr_cont").parent().parent().parent(),"content");

    exibirCardapio = function() {
        if(!cardapioVisivel) {
            var divCardapio = appendNewDiv(content,"cardapio");
            var iframe ="<iframe width=\"100%\" height=\"100%\" src=\"http://www.gastronomiacolherdepau.com.br.usrfiles.com/html/36e98f_eb1aa3ea000108896b1ae72b4c069a5e.html\"></iframe>";
            divCardapio.append(iframe);
            cardapioVisivel = true;
        }
    };

    // criando e adicionado os botoes
    var btnCardapio = "<button class=\"btn btn-default pull-right btn-info\" onClick=\"exibirCardapio()\">Cardápio do dia</button>";
    //var btnCardapio = "<a class='btn btn-default pull-right btn-info' href='http://www.gastronomiacolherdepau.com.br.usrfiles.com/html/36e98f_eb1aa3ea000108896b1ae72b4c069a5e.html' target='_blank'>Cardápio do dia</a>";
    var btnPedido = "<a class='btn btn-default pull-right btn-success' href='https://docs.google.com/forms/d/1rwyNOuUcu4E2xO3gslohyvfQLrVIR_NkTGAmJOyabbk/viewform?embedded=true' target='_blank' >Fazer Pedido</button>";
    var divBotoes = appendNewDiv(content, "botoes");
    divBotoes.append(btnCardapio).append(btnPedido);

}
