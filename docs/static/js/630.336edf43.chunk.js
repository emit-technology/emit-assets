/*! For license information please see 630.336edf43.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemit_assets=self.webpackChunkemit_assets||[]).push([[630],{53630:(e,t,s)=>{s.r(t),s.d(t,{scopeCss:()=>B});const r="-shadowcsshost",o="-shadowcssslotted",n="-shadowcsscontext",c=")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)",l=new RegExp("(-shadowcsshost"+c,"gim"),i=new RegExp("(-shadowcsscontext"+c,"gim"),a=new RegExp("(-shadowcssslotted"+c,"gim"),h="-shadowcsshost-no-combinator",p=/-shadowcsshost-no-combinator([^\s]*)/,g=[/::shadow/g,/::content/g],u=/-shadowcsshost/gim,d=/:host/gim,m=/::slotted/gim,f=/:host-context/gim,x=/\/\*\s*[\s\S]*?\*\//g,$=/\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g,w=/(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g,_=/([{}])/g,b=/(^.*?[^\\])??((:+)(.*)|$)/,v="%BLOCK%",S=(e,t)=>{const s=O(e);let r=0;return s.escapedString.replace(w,(function(){const e=arguments.length<=2?void 0:arguments[2];let o="",n=arguments.length<=4?void 0:arguments[4],c="";n&&n.startsWith("{%BLOCK%")&&(o=s.blocks[r++],n=n.substring(v.length+1),c="{");const l={selector:e,content:o},i=t(l);return`${arguments.length<=1?void 0:arguments[1]}${i.selector}${arguments.length<=3?void 0:arguments[3]}${c}${i.content}${n}`}))},O=e=>{const t=e.split(_),s=[],r=[];let o=0,n=[];for(let c=0;c<t.length;c++){const e=t[c];"}"===e&&o--,o>0?n.push(e):(n.length>0&&(r.push(n.join("")),s.push(v),n=[]),s.push(e)),"{"===e&&o++}n.length>0&&(r.push(n.join("")),s.push(v));return{escapedString:s.join(""),blocks:r}},W=(e,t,s)=>e.replace(t,(function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];if(t[2]){const e=t[2].split(","),r=[];for(let o=0;o<e.length;o++){const n=e[o].trim();if(!n)break;r.push(s(h,n,t[3]))}return r.join(",")}return h+t[3]})),k=(e,t,s)=>e+t.replace(r,"")+s,j=(e,t,s)=>t.indexOf(r)>-1?k(e,t,s):e+t+s+", "+t+" "+e+s,C=(e,t)=>{const s=(e=>(e=e.replace(/\[/g,"\\[").replace(/\]/g,"\\]"),new RegExp("^("+e+")([>\\s~+[.,{:][\\s\\S]*)?$","m")))(t);return!s.test(e)},E=(e,t)=>e.replace(b,(function(e){let s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"";return s+t+r+o})),R=(e,t,s)=>{const r="."+(t=t.replace(/\[is=([^\]]*)\]/g,(function(e){return arguments.length<=1?void 0:arguments[1]}))),o=e=>{let o=e.trim();if(!o)return"";if(e.indexOf(h)>-1)o=((e,t,s)=>{if(u.lastIndex=0,u.test(e)){const t=`.${s}`;return e.replace(p,((e,s)=>E(s,t))).replace(u,t+" ")}return t+" "+e})(e,t,s);else{const t=e.replace(u,"");t.length>0&&(o=E(t,r))}return o},n=(e=>{const t=[];let s,r=0;return s=(e=e.replace(/(\[[^\]]*\])/g,((e,s)=>{const o=`__ph-${r}__`;return t.push(s),r++,o}))).replace(/(:nth-[-\w]+)(\([^)]+\))/g,((e,s,o)=>{const n=`__ph-${r}__`;return t.push(o),r++,s+n})),{content:s,placeholders:t}})(e);let c,l="",i=0;const a=/( |>|\+|~(?!=))\s*/g;let g=!((e=n.content).indexOf(h)>-1);for(;null!==(c=a.exec(e));){const t=c[1],s=e.slice(i,c.index).trim();g=g||s.indexOf(h)>-1;l+=`${g?o(s):s} ${t} `,i=a.lastIndex}const d=e.substring(i);return g=g||d.indexOf(h)>-1,l+=g?o(d):d,m=n.placeholders,l.replace(/__ph-(\d+)__/g,((e,t)=>m[+t]));var m},L=(e,t,s,r,o)=>S(e,(e=>{let o=e.selector,n=e.content;"@"!==e.selector[0]?o=((e,t,s,r)=>e.split(",").map((e=>r&&e.indexOf("."+r)>-1?e.trim():C(e,t)?R(e,t,s).trim():e.trim())).join(", "))(e.selector,t,s,r):(e.selector.startsWith("@media")||e.selector.startsWith("@supports")||e.selector.startsWith("@page")||e.selector.startsWith("@document"))&&(n=L(e.content,t,s,r));return{selector:o.replace(/\s{2,}/g," ").trim(),content:n}})),T=(e,t,s,c,p)=>{const u=((e,t)=>{const s="."+t+" > ",r=[];return e=e.replace(a,(function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];if(t[2]){const e=t[2].trim(),o=t[3],n=s+e+o;let c="";for(let s=t[4]-1;s>=0;s--){const e=t[5][s];if("}"===e||","===e)break;c=e+c}const l=c+n,i=`${c.trimRight()}${n.trim()}`;if(l.trim()!==i.trim()){const e=`${i}, ${l}`;r.push({orgSelector:l,updatedSelector:e})}return n}return h+t[3]})),{selectors:r,cssText:e}})(e=(e=>W(e,i,j))(e=(e=>W(e,l,k))(e=e.replace(f,n).replace(d,r).replace(m,o))),c);return e=(e=>g.reduce(((e,t)=>e.replace(t," ")),e))(e=u.cssText),t&&(e=L(e,t,s,c)),{cssText:(e=(e=e.replace(/-shadowcsshost-no-combinator/g,`.${s}`)).replace(/>\s*\*\s+([^{, ]+)/gm," $1 ")).trim(),slottedSelectors:u.selectors}},B=(e,t,s)=>{const r=t+"-h",o=t+"-s",n=e.match($)||[];e=(e=>e.replace(x,""))(e);const c=[];if(s){const t=e=>{const t=`/*!@___${c.length}___*/`,s=`/*!@${e.selector}*/`;return c.push({placeholder:t,comment:s}),e.selector=t+e.selector,e};e=S(e,(e=>"@"!==e.selector[0]?t(e):e.selector.startsWith("@media")||e.selector.startsWith("@supports")||e.selector.startsWith("@page")||e.selector.startsWith("@document")?(e.content=S(e.content,t),e):e))}const l=T(e,t,r,o);return e=[l.cssText,...n].join("\n"),s&&c.forEach((t=>{let{placeholder:s,comment:r}=t;e=e.replace(s,r)})),l.slottedSelectors.forEach((t=>{e=e.replace(t.orgSelector,t.updatedSelector)})),e}}}]);
//# sourceMappingURL=630.336edf43.chunk.js.map