function resizeIframeToFitContent( iframe ) {
    iframe.width  = iframe.contentWindow.document.body.scrollWidth;
    iframe.height = iframe.contentWindow.document.body.scrollHeight;
}

window.addEventListener('DOMContentLoaded', function(e) {
    var iframes = document.querySelectorAll("iframe");
    for( var i = 0; i < iframes.length; i++) {
        resizeIframeToFitContent( iframes[i] );
    }
} );