//prepare for orinting
var winQR, winBC;

function printIt(printThis) {
    var htmlString = '';
    htmlString += '<html><head>\n';
    htmlString += '<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>\n';
    htmlString += '<script>\n';
    htmlString += 'var beforePrint = function() {\n';
    htmlString += '};\n';
    htmlString += 'var afterPrint = function() {\n';
    htmlString += '   window.close();\n';
    htmlString += '};\n';
    htmlString += 'var is_chrome = function () { return Boolean(window.chrome); }\n';
    htmlString += 'if(is_chrome()){\n';
    htmlString += '   window.matchMedia(\'print\').addListener(function(media) {\n';
    htmlString += '      if (media.matches) {\n';
    htmlString += '         beforePrint();\n';
    htmlString += '      } else {\n';
    htmlString += '         $(document).one(\'mouseover\', afterPrint);\n';
    htmlString += '      }\n';
    htmlString += '   });\n';
    htmlString += '} else {\n';
    htmlString += '   $(window).on(\'beforeprint\', beforePrint);\n';
    htmlString += '   $(window).on(\'afterprint\', afterPrint);\n';
    htmlString += '}\n';
    htmlString += '$(window).load(function() {\n';
    htmlString += '   window.print();\n';
    htmlString += '});\n';
    htmlString += '</script>\n';
    htmlString += '<style>body, td { font-family: Verdana; font-size: 10pt; padding:10px; }</style>\n';
    htmlString += '</head><body>\n';

    if (printThis.toString().indexOf("QR") != -1) {
        if (winQR) {
            winQR.close();
            winQR = null;
        }
        winQR = window.open();
        self.focus();
        winQR.document.open();
        winQR.document.write(htmlString);
        winQR.document.write(printThis + '\n');
        winQR.document.write('</br></body></html>\n');
        winQR.document.close();
    } else {
        if (winBC) {
            winBC.close();
            winBC = null;
        }
        winBC = window.open();
        self.focus();
        winBC.document.open();
        winBC.document.write(htmlString);
        winBC.document.write(printThis);
        winBC.document.write('</br></body></html>');
        winBC.document.close();
    }
}

$(window).on('beforeunload', function () {
    if (winBC) {
        winBC.close();
        winBC = null;
    }
    if (winQR) {
        winQR.close();
        winQR = null;
    }
});