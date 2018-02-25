import highlight from '../node_modules/highlight.js/lib/highlight';
import highlightHtml from '../node_modules/highlight.js/lib/languages/xml';
import highlightJs from '../node_modules/highlight.js/lib/languages/javascript';
import highlightCss from '../node_modules/highlight.js/lib/languages/css';
highlight.registerLanguage('html', highlightHtml);
highlight.registerLanguage('js', highlightJs);
highlight.registerLanguage('css', highlightCss);
highlight.initHighlightingOnLoad();