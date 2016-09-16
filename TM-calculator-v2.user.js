// ==UserScript==
// @name         DB1 ponto calculator
// @namespace    https://github.com/heidiks/db1-ponto-tm-script
// @version      0.3.3
// @description  DB1 ponto calculator 
// @author       Heidi Kussakawa
// @match        https://prd.meuholerite.com.br/Ponto*
// @match        http://ponto2.db1.com.br/ponto/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

$.getScript( "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js" ).done(function() {
    $.getScript("https://cdn.rawgit.com/heidiks/db1-ponto-tm-script/91d614533665beb488ed002f4f5bcea28191ac91/db1-calculator-v2.js");
});