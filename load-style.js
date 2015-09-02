/**
 * Created by gabriel.amaral on 01/09/2015.
 */
// gambeta para carregar css
var cssId = 'myCss';
if (!document.getElementById(cssId))
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