/*******************************************************
 * Copyright (C) 2019-2022 Kévin Zarshenas
 * kevin.zarshenas@gmail.com
 * 
 * This file is part of LuckyPHP.
 * 
 * This code can not be copied and/or distributed without the express
 * permission of Kévin Zarshenas @kekefreedog
 *******************************************************/

/* Import JS */
window.$ = window.jQuery = require('jquery/dist/jquery.js');
window.PerfectScrollbar = require('perfect-scrollbar').default;
window.hljs = require("highlight.js");
require("jquery-validation/dist/jquery.validate.js")
require('materialize-css/dist/js/materialize.js')
require('Kmaterialize/src/js/plugins.js');
require("Kmaterialize/src/js/search.js");

/* Import Prism */
/* Fix #33 */
require('prismjs');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-docker');
require('prismjs/components/prism-git');
require('prismjs/components/prism-php');
require('prismjs/components/prism-json');
require('prismjs/components/prism-mel');
require('prismjs/components/prism-yaml');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-regex');
require('prismjs/components/prism-python');
require('prismjs/components/prism-markdown');
require('prismjs/components/prism-markup-templating');
require('prismjs/components/prism-mongodb');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-css');
require('prismjs/components/prism-xml-doc');
require('prismjs/components/');
const loadLanguages = require('prismjs/components/');
window.Prism.manual = true;
jQuery(function () {
    // Wrap the code inside the required <code> tag, when needed:
    jQuery('pre[class*="language-"], pre[class*="lang-"]').each(function () {
        if (1 !== jQuery(this).children('code').length) {
            jQuery(this).wrapInner('<code>');
        }
    });

    // Highlight code, when the page finished loading (using jQuery here)
    Prism.highlightAll()
});
/* End Fix #33 */