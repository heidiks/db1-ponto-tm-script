// ==UserScript==
// @name         DB1 ponto calculator
// @namespace    https://github.com/heidiks/db1-ponto-tm-script
// @version      0.3.3
// @description  DB1 ponto calculator 
// @author       Heidi Kussakawa
// @match        http://ponto.db1.com.br/ponto/*
// @match        http://ponto2.db1.com.br/ponto/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

$.getScript( "http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js" ).done(function() {
    $.getScript("https://cdn.rawgit.com/heidiks/db1-ponto-tm-script/428bdeced14f13dae991eeea5ea8095e5b723db1/db1-calculator.js");
});