(()=>{"use strict";class e{constructor(){this.setHeight()}setHeight=()=>{let e=document.getElementById("header"),t=document.getElementById("iframe-main");if(null===e||null===t)return;let n=()=>{t.style.height=window.innerHeight-e.offsetHeight+"px"};n(),window.addEventListener("resize",n)}}window.App=new class{constructor(){this.Pdf=(t={})=>{new e(t)}}}})();