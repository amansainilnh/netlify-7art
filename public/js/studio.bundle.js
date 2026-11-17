/* === js/vendor/qrcode.min.js === */
var qrcode=function(){function i(t,r){function a(t,r){g=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(l=4*u+17),e(0,0),e(l-7,0),e(0,l-7),i(),o(),v(t,r),7<=u&&h(t),null==n&&(n=w(u,f,c)),d(n,r)}var u=t,f=y[r],g=null,l=0,n=null,c=[],s={},e=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||l<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||l<=r+n||(g[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},o=function(){for(var t=8;t<l-8;t+=1)null==g[t][6]&&(g[t][6]=t%2==0);for(var r=8;r<l-8;r+=1)null==g[6][r]&&(g[6][r]=r%2==0)},i=function(){for(var t=B.getPatternPosition(u),r=0;r<t.length;r+=1)for(var e=0;e<t.length;e+=1){var n=t[r],o=t[e];if(null==g[n][o])for(var i=-2;i<=2;i+=1)for(var a=-2;a<=2;a+=1)g[n+i][o+a]=-2==i||2==i||-2==a||2==a||0==i&&0==a}},h=function(t){for(var r=B.getBCHTypeNumber(u),e=0;e<18;e+=1){var n=!t&&1==(r>>e&1);g[Math.floor(e/3)][e%3+l-8-3]=n}for(e=0;e<18;e+=1){n=!t&&1==(r>>e&1);g[e%3+l-8-3][Math.floor(e/3)]=n}},v=function(t,r){for(var e=f<<3|r,n=B.getBCHTypeInfo(e),o=0;o<15;o+=1){var i=!t&&1==(n>>o&1);o<6?g[o][8]=i:o<8?g[o+1][8]=i:g[l-15+o][8]=i}for(o=0;o<15;o+=1){i=!t&&1==(n>>o&1);o<8?g[8][l-o-1]=i:o<9?g[8][15-o-1+1]=i:g[8][15-o-1]=i}g[l-8][8]=!t},d=function(t,r){for(var e=-1,n=l-1,o=7,i=0,a=B.getMaskFunction(r),u=l-1;0<u;u-=2)for(6==u&&(u-=1);;){for(var f=0;f<2;f+=1)if(null==g[n][u-f]){var c=!1;i<t.length&&(c=1==(t[i]>>>o&1)),a(n,u-f)&&(c=!c),g[n][u-f]=c,-1==(o-=1)&&(i+=1,o=7)}if((n+=e)<0||l<=n){n-=e,e=-e;break}}},w=function(t,r,e){for(var n=b.getRSBlocks(t,r),o=M(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=C(i[u],l.getLength()-1).mod(l);a[u]=new Array(l.getLength()-1);for(g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=0<=s?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};s.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=x(t);break;case"Alphanumeric":e=m(t);break;case"Byte":e=L(t);break;case"Kanji":e=D(t);break;default:throw"mode:"+r}c.push(e),n=null},s.isDark=function(t,r){if(t<0||l<=t||r<0||l<=r)throw t+","+r;return g[t][r]},s.getModuleCount=function(){return l},s.make=function(){if(u<1){for(var t=1;t<40;t++){for(var r=b.getRSBlocks(t,f),e=M(),n=0;n<c.length;n++){var o=c[n];e.put(o.getMode(),4),e.put(o.getLength(),B.getLengthInBits(o.getMode(),t)),o.write(e)}var i=0;for(n=0;n<r.length;n++)i+=r[n].dataCount;if(e.getLengthInBits()<=8*i)break}u=t}a(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){a(!0,e);var n=B.getLostPoint(s);(0==e||n<t)&&(t=n,r=e)}return r}())},s.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<s.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<s.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=s.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},s.createSvgTag=function(t,r,e,n){var o={};"object"==typeof t&&(t=(o=t).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,f,c=s.getModuleCount()*t+2*r,g="";for(f="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",g+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',g+=o.scalable?"":' width="'+c+'px" height="'+c+'px"',g+=' viewBox="0 0 '+c+" "+c+'" ',g+=' preserveAspectRatio="xMinYMin meet"',g+=n.text||e.text?' role="img" aria-labelledby="'+p([n.id,e.id].join(" ").trim())+'"':"",g+=">",g+=n.text?'<title id="'+p(n.id)+'">'+p(n.text)+"</title>":"",g+=e.text?'<description id="'+p(e.id)+'">'+p(e.text)+"</description>":"",g+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',g+='<path d="',a=0;a<s.getModuleCount();a+=1)for(u=a*t+r,i=0;i<s.getModuleCount();i+=1)s.isDark(a,i)&&(g+="M"+(i*t+r)+","+u+f);return g+='" stroke="transparent" fill="black"/>',g+="</svg>"},s.createDataURL=function(o,t){o=o||2,t=void 0===t?4*o:t;var r=s.getModuleCount()*o+2*t,i=t,a=r-t;return I(r,r,function(t,r){if(i<=t&&t<a&&i<=r&&r<a){var e=Math.floor((t-i)/o),n=Math.floor((r-i)/o);return s.isDark(n,e)?0:1}return 1})},s.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=s.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=s.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=p(e),o+='"'),o+="/>"};var p=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return s.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*s.getModuleCount()+2*t,u=t,f=a-t,c={"██":"█","█ ":"▀"," █":"▄","  ":" "},g={"██":"▀","█ ":"▀"," █":" ","  ":" "},l="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<f&&u<=r&&r<f&&s.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<f&&u<=r+1&&r+1<f&&s.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",l+=t<1&&f<=r+1?g[i]:c[i];l+="\n"}return a%2&&0<t?l.substring(0,l.length-a-1)+Array(1+a).join("▀"):l.substring(0,l.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=s.getModuleCount()*t+2*r,u=r,f=a-r,c=Array(t+1).join("██"),g=Array(t+1).join("  "),l="",h="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),h="",n=0;n<a;n+=1)i=1,u<=n&&n<f&&u<=e&&e<f&&s.isDark(o,Math.floor((n-u)/t))&&(i=0),h+=i?c:g;for(o=0;o<t;o+=1)l+=h+"\n"}return l.substring(0,l.length-1)},s.renderTo2dContext=function(t,r){r=r||2;for(var e=s.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=s.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},s}i.stringToBytes=(i.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,i.createStringToBytes=function(u,f){var i=function(){function t(){var t=r.read();if(-1==t)throw"eof";return t}for(var r=S(u),e=0,n={};;){var o=r.read();if(-1==o)break;var i=t(),a=t()<<8|t();n[String.fromCharCode(o<<8|i)]=a,e+=1}if(e!=f)throw e+" != "+f;return n}(),a="?".charCodeAt(0);return function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);if(n<128)r.push(n);else{var o=i[t.charAt(e)];"number"==typeof o?(255&o)==o?r.push(o):(r.push(o>>>8),r.push(255&o)):r.push(a)}}return r}};var r,t,a=1,u=2,o=4,f=8,y={L:1,M:0,Q:3,H:2},e=0,n=1,c=2,g=3,l=4,h=5,s=6,v=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],(t={}).getBCHTypeInfo=function(t){for(var r=t<<10;0<=d(r)-d(1335);)r^=1335<<d(r)-d(1335);return 21522^(t<<10|r)},t.getBCHTypeNumber=function(t){for(var r=t<<12;0<=d(r)-d(7973);)r^=7973<<d(r)-d(7973);return t<<12|r},t.getPatternPosition=function(t){return r[t-1]},t.getMaskFunction=function(t){switch(t){case e:return function(t,r){return(t+r)%2==0};case n:return function(t,r){return t%2==0};case c:return function(t,r){return r%3==0};case g:return function(t,r){return(t+r)%3==0};case l:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case h:return function(t,r){return t*r%2+t*r%3==0};case s:return function(t,r){return(t*r%2+t*r%3)%2==0};case v:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},t.getErrorCorrectPolynomial=function(t){for(var r=C([1],0),e=0;e<t;e+=1)r=r.multiply(C([1,w.gexp(e)],0));return r},t.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case o:case f:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case o:return 16;case f:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case o:return 16;case f:return 12;default:throw"mode:"+t}}},t.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);5<i&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},t);function d(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r}var w=function(){for(var r=new Array(256),e=new Array(256),t=0;t<8;t+=1)r[t]=1<<t;for(t=8;t<256;t+=1)r[t]=r[t-4]^r[t-5]^r[t-6]^r[t-8];for(t=0;t<255;t+=1)e[r[t]]=t;var n={glog:function(t){if(t<1)throw"glog("+t+")";return e[t]},gexp:function(t){for(;t<0;)t+=255;for(;256<=t;)t-=255;return r[t]}};return n}();function C(n,o){if(void 0===n.length)throw n.length+"/"+o;var r=function(){for(var t=0;t<n.length&&0==n[t];)t+=1;for(var r=new Array(n.length-t+o),e=0;e<n.length-t;e+=1)r[e]=n[e+t];return r}(),i={getAt:function(t){return r[t]},getLength:function(){return r.length},multiply:function(t){for(var r=new Array(i.getLength()+t.getLength()-1),e=0;e<i.getLength();e+=1)for(var n=0;n<t.getLength();n+=1)r[e+n]^=w.gexp(w.glog(i.getAt(e))+w.glog(t.getAt(n)));return C(r,0)},mod:function(t){if(i.getLength()-t.getLength()<0)return i;for(var r=w.glog(i.getAt(0))-w.glog(t.getAt(0)),e=new Array(i.getLength()),n=0;n<i.getLength();n+=1)e[n]=i.getAt(n);for(n=0;n<t.getLength();n+=1)e[n]^=w.gexp(w.glog(t.getAt(n))+r);return C(e,0).mod(t)}};return i}function p(){var e=[],o={writeByte:function(t){e.push(255&t)},writeShort:function(t){o.writeByte(t),o.writeByte(t>>>8)},writeBytes:function(t,r,e){r=r||0,e=e||t.length;for(var n=0;n<e;n+=1)o.writeByte(t[n+r])},writeString:function(t){for(var r=0;r<t.length;r+=1)o.writeByte(t.charCodeAt(r))},toByteArray:function(){return e},toString:function(){var t="";t+="[";for(var r=0;r<e.length;r+=1)0<r&&(t+=","),t+=e[r];return t+="]"}};return o}var k,A,b=(k=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],(A={}).getRSBlocks=function(t,r){var e=function(t,r){switch(r){case y.L:return k[4*(t-1)+0];case y.M:return k[4*(t-1)+1];case y.Q:return k[4*(t-1)+2];case y.H:return k[4*(t-1)+3];default:return}}(t,r);if(void 0===e)throw"bad rs block @ typeNumber:"+t+"/errorCorrectionLevel:"+r;for(var n,o,i=e.length/3,a=[],u=0;u<i;u+=1)for(var f=e[3*u+0],c=e[3*u+1],g=e[3*u+2],l=0;l<f;l+=1)a.push((n=g,o=void 0,(o={}).totalCount=c,o.dataCount=n,o));return a},A),M=function(){var e=[],n=0,o={getBuffer:function(){return e},getAt:function(t){var r=Math.floor(t/8);return 1==(e[r]>>>7-t%8&1)},put:function(t,r){for(var e=0;e<r;e+=1)o.putBit(1==(t>>>r-e-1&1))},getLengthInBits:function(){return n},putBit:function(t){var r=Math.floor(n/8);e.length<=r&&e.push(0),t&&(e[r]|=128>>>n%8),n+=1}};return o},x=function(t){var r=a,n=t,e={getMode:function(){return r},getLength:function(t){return n.length},write:function(t){for(var r=n,e=0;e+2<r.length;)t.put(o(r.substring(e,e+3)),10),e+=3;e<r.length&&(r.length-e==1?t.put(o(r.substring(e,e+1)),4):r.length-e==2&&t.put(o(r.substring(e,e+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return e},m=function(t){var r=u,n=t,e={getMode:function(){return r},getLength:function(t){return n.length},write:function(t){for(var r=n,e=0;e+1<r.length;)t.put(45*o(r.charAt(e))+o(r.charAt(e+1)),11),e+=2;e<r.length&&t.put(o(r.charAt(e)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return e},L=function(t){var r=o,e=i.stringToBytes(t),n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=0;r<e.length;r+=1)t.put(e[r],8)}};return n},D=function(t){var r=f,e=i.stringToBytesFuncs.SJIS;if(!e)throw"sjis not supported.";!function(){var t=e("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=e(t),n={getMode:function(){return r},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return n},S=function(t){var e=t,n=0,o=0,i=0,r={read:function(){for(;i<8;){if(n>=e.length){if(0==i)return-1;throw"unexpected end of file./"+i}var t=e.charAt(n);if(n+=1,"="==t)return i=0,-1;t.match(/^\s$/)||(o=o<<6|a(t.charCodeAt(0)),i+=6)}var r=o>>>i-8&255;return i-=8,r}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return r},I=function(t,r,e){for(var n=function(t,r){var n=t,o=r,l=new Array(t*r),e={setPixel:function(t,r,e){l[r*n+t]=e},write:function(t){t.writeString("GIF87a"),t.writeShort(n),t.writeShort(o),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(n),t.writeShort(o),t.writeByte(0);var r=i(2);t.writeByte(2);for(var e=0;255<r.length-e;)t.writeByte(255),t.writeBytes(r,e,255),e+=255;t.writeByte(r.length-e),t.writeBytes(r,e,r.length-e),t.writeByte(0),t.writeString(";")}},i=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,o=h(),i=0;i<r;i+=1)o.add(String.fromCharCode(i));o.add(String.fromCharCode(r)),o.add(String.fromCharCode(e));var a=p(),u=function(t){var e=t,n=0,o=0,r={write:function(t,r){if(t>>>r!=0)throw"length over";for(;8<=n+r;)e.writeByte(255&(t<<n|o)),r-=8-n,t>>>=8-n,n=o=0;o|=t<<n,n+=r},flush:function(){0<n&&e.writeByte(o)}};return r}(a);u.write(r,n);var f=0,c=String.fromCharCode(l[f]);for(f+=1;f<l.length;){var g=String.fromCharCode(l[f]);f+=1,o.contains(c+g)?c+=g:(u.write(o.indexOf(c),n),o.size()<4095&&(o.size()==1<<n&&(n+=1),o.add(c+g)),c=g)}return u.write(o.indexOf(c),n),u.write(e,n),u.flush(),a.toByteArray()},h=function(){var r={},e=0,n={add:function(t){if(n.contains(t))throw"dup key:"+t;r[t]=e,e+=1},size:function(){return e},indexOf:function(t){return r[t]},contains:function(t){return void 0!==r[t]}};return n};return e}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=p();n.write(a);for(var u=function(){function e(t){a+=String.fromCharCode(r(63&t))}var n=0,o=0,i=0,a="",t={},r=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return t.writeByte=function(t){for(n=n<<8|255&t,o+=8,i+=1;6<=o;)e(n>>>o-6),o-=6},t.flush=function(){if(0<o&&(e(n<<6-o),o=n=0),i%3!=0)for(var t=3-i%3,r=0;r<t;r+=1)a+="="},t.toString=function(){return a},t}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return i}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||57344<=n?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}(function(){return qrcode});

/* === js/api.js === */
/* ==========================================================================
   7 ART TAILORS - API CLIENT & STANDALONE CLOUD ENGINE (NETLIFY EDITION)
   Seamless Hybrid Operation: Connects to Local/Remote Python Server OR
   Operates 100% Standalone on Netlify/Browser with Supabase Cloud Sync
   ========================================================================== */

// --- In-Memory Fast Cache ---
window.atelierCache = {
  store: {},
  ttls: {
    settings: 300000,    // 5 minutes
    staff: 120000,       // 2 minutes
    customers: 60000,    // 1 minute
    rates: 120000        // 2 minutes
  },

  get(key) {
    const item = this.store[key];
    if (!item) return null;
    const ttl = this.ttls[key] || 60000;
    if (Date.now() - item.time > ttl) {
      delete this.store[key];
      return null;
    }
    return item.data;
  },

  set(key, data) {
    this.store[key] = {
      data,
      time: Date.now()
    };
    return data;
  },

  invalidate(prefix = null) {
    if (!prefix) {
      this.store = {};
      return;
    }
    Object.keys(this.store).forEach(k => {
      if (k.startsWith(prefix)) delete this.store[k];
    });
  }
};

// ==========================================================================
// STANDALONE / LOCAL-FIRST ATELIER ENGINE (Runs in Browser / Netlify)
// ==========================================================================
const StandaloneEngine = {
  STORAGE_KEYS: {
    ORDERS: '7art_orders',
    SETTINGS: '7art_settings',
    USERS: '7art_users',
    STAFF: '7art_staff',
    ADVANCES: '7art_advances',
    SALARY_SLIPS: '7art_salary_slips'
  },

  DEFAULT_SETTINGS: {
    shop_name: "7 ART TAILORS",
    owner_name: "BHAGIRATH SAINI",
    shop_phone: "+91 98290 12345",
    shop_address: "Shop No. 7, Tailors Market, Bapu Bazaar, Jaipur, Rajasthan 302003",
    token_prefix: "26",
    token_counter: 1001,
    slip_counter: 4,
    cloud_enabled: "1",
    action_password: "edit123",
    salary_password: "salary123",
    delete_password: "delete123",
    secret_password: "secret123",
    password: "admin",
    supabase_url: "https://mmehajcybepbzogefchz.supabase.co",
    supabase_key: "sb_publishable_MqTUdNGZWGMMI7JlBH1HLQ_37m-SsEw",
    supabase_auto_sync: true,
    garments: {
      "Kurta / Pajama": { rate: 800.0, fields: "Kurta Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pajama Length;Pajama Waist;Bottom" },
      "Shirt & Pant": { rate: 900.0, fields: "Shirt Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip;Thigh;Bottom" },
      "Suit / Blazer": { rate: 3500.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pant Length;Pant Waist;Thigh" },
      "Sherwani": { rate: 5000.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Churidar Length;Churidar Waist" },
      "Safari Suit": { rate: 1800.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip" },
      "Sadri": { rate: 700.0, fields: "Length;Chest;Waist;Shoulder;Neck" },
      "Blouse & Lehenga": { rate: 1500.0, fields: "Blouse Length;Bust;Waist;Shoulder;Sleeve;Front Neck;Back Neck;Lehenga Length;Lehenga Waist;Hip" },
      "Uniform": { rate: 800.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist" },
      "Custom": { rate: 500.0, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip" },
      "kot": { rate: 1500.0, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve" },
      "chaddi": { rate: 150.0, fields: "Waist;Length" }
    }
  },

  DEFAULT_USERS: [
    { id: 1, username: 'admin', password: 'admin', full_name: 'BHAGIRATH SAINI', role: 'authority', staff_name: '', phone: '+91 98290 12345', active: 1 },
    { id: 2, username: 'bhagirath', password: 'admin', full_name: 'BHAGIRATH SAINI', role: 'authority', staff_name: 'bhagirath saini', phone: '+91 98290 12345', active: 1 },
    { id: 3, username: 'aman', password: 'Aman', full_name: 'Aman', role: 'manager', staff_name: 'aman', phone: '9829011111', active: 1 },
    { id: 4, username: 'saini', password: '123', full_name: 'Saini', role: 'employee', staff_name: 'saini', phone: '9829066666', active: 1 },
    { id: 5, username: 'him', password: 'himanshu', full_name: 'Him', role: 'employee', staff_name: 'him', phone: '9829033333', active: 1 },
    { id: 6, username: 'maya', password: '123', full_name: 'Maya', role: 'employee', staff_name: 'maya', phone: '9829044444', active: 1 },
    { id: 7, username: 'sai', password: '123', full_name: 'Sai', role: 'employee', staff_name: 'sai', phone: '9829055555', active: 1 },
    { id: 8, username: 'surbhi', password: '123', full_name: 'Surbhi', role: 'employee', staff_name: 'surbhi', phone: '9829077777', active: 1 }
  ],

  DEFAULT_STAFF: [
    { id: 1, name: 'aman', phone: '9829011111', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 200, "Shirt & Pant": 100, "Suit / Blazer": 300 } },
    { id: 2, name: 'bhagirath saini', phone: '9829022222', role: 'cutting', active: 1, rates: { "Suit / Blazer": 500 } },
    { id: 3, name: 'him', phone: '9829033333', role: 'cutting', active: 1, rates: {} },
    { id: 4, name: 'maya', phone: '9829044444', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 50 } },
    { id: 5, name: 'sai', phone: '9829055555', role: 'cutting', active: 1, rates: { "Kurta / Pajama": 30 } },
    { id: 6, name: 'saini', phone: '9829066666', role: 'sewing', active: 1, rates: { "Kurta / Pajama": 40 } },
    { id: 7, name: 'surbhi', phone: '9829077777', role: 'sewing', active: 1, rates: { "Kurta / Pajama": 40 } }
  ],

  init() {
    if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.USERS)) {
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(this.DEFAULT_USERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.STAFF)) {
      localStorage.setItem(this.STORAGE_KEYS.STAFF, JSON.stringify(this.DEFAULT_STAFF));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ADVANCES)) {
      localStorage.setItem(this.STORAGE_KEYS.ADVANCES, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SALARY_SLIPS)) {
      localStorage.setItem(this.STORAGE_KEYS.SALARY_SLIPS, JSON.stringify([]));
    }

    // Auto-pull orders from Supabase on init in background
    setTimeout(() => {
      this.syncFromSupabaseBackground();
    }, 1500);
  },

  getRaw(key, defaultVal = []) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch(e) {
      return defaultVal;
    }
  },

  setRaw(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
      console.error(`LocalStorage write error for ${key}:`, e);
    }
  },

  getSettings() {
    const s = this.getRaw(this.STORAGE_KEYS.SETTINGS, this.DEFAULT_SETTINGS);
    return { ...this.DEFAULT_SETTINGS, ...s };
  },

  saveSettings(newSettings) {
    const cur = this.getSettings();
    const merged = { ...cur, ...newSettings };
    this.setRaw(this.STORAGE_KEYS.SETTINGS, merged);
    this.syncSettingsToSupabase(merged);
    return { status: 'success', settings: merged };
  },

  getNextToken() {
    const s = this.getSettings();
    const prefix = String(s.token_prefix || '26').trim();
    const counter = parseInt(s.token_counter || 1001, 10);
    return {
      token: `${prefix}-${counter}`,
      prefix,
      counter
    };
  },

  incrementTokenCounter() {
    const s = this.getSettings();
    const counter = parseInt(s.token_counter || 1001, 10) + 1;
    s.token_counter = counter;
    this.setRaw(this.STORAGE_KEYS.SETTINGS, s);
    return counter;
  },

  getOrders(params = {}) {
    let orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const q = (params.q || '').trim().toLowerCase();
    const status = (params.status || '').trim();
    const urgent = params.urgent === '1' || params.urgent === 1 || params.urgent === true;

    if (q) {
      orders = orders.filter(o => 
        (o.token && o.token.toLowerCase().includes(q)) ||
        (o.customer && o.customer.toLowerCase().includes(q)) ||
        (o.phone && o.phone.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'All') {
      orders = orders.filter(o => (o.status || '').toLowerCase() === status.toLowerCase());
    }

    if (urgent) {
      orders = orders.filter(o => o.urgent);
    }

    const total = orders.length;
    const page = Math.max(1, parseInt(params.page || 1, 10));
    const limit = Math.max(1, parseInt(params.limit || 25, 10));
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const sliced = orders.slice(start, start + limit);

    return {
      orders: sliced,
      total,
      pages,
      page,
      limit
    };
  },

  getOrder(token) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanToken = String(token || '').trim();
    return orders.find(o => o.token === cleanToken) || null;
  },

  createOrder(data) {
    const s = this.getSettings();
    const prefix = String(s.token_prefix || '26').trim();
    let token = (data.token || '').trim();
    if (!token) {
      const counter = parseInt(s.token_counter || 1001, 10);
      token = `${prefix}-${counter}`;
      this.incrementTokenCounter();
    }

    const now = new Date().toISOString();
    const newOrder = {
      ...data,
      token,
      total: parseFloat(data.total || 0),
      advance: parseFloat(data.advance || 0),
      balance: Math.max(0, parseFloat(data.total || 0) - parseFloat(data.advance || 0)),
      created_at: now,
      updated_at: now
    };

    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const existingIdx = orders.findIndex(o => o.token === token);
    if (existingIdx >= 0) {
      orders[existingIdx] = newOrder;
    } else {
      orders.unshift(newOrder);
    }
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);

    // Sync to Supabase in background
    SupabaseSync.pushOrders([newOrder]);

    return newOrder;
  },

  updateOrder(token, data) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanToken = String(token || '').trim();
    const idx = orders.findIndex(o => o.token === cleanToken);
    if (idx === 0 || idx > 0) {
      const existing = orders[idx];
      const updated = {
        ...existing,
        ...data,
        updated_at: new Date().toISOString()
      };
      if (data.total !== undefined || data.advance !== undefined) {
        const tot = data.total !== undefined ? parseFloat(data.total) : existing.total;
        const adv = data.advance !== undefined ? parseFloat(data.advance) : existing.advance;
        updated.balance = Math.max(0, tot - adv);
      }
      orders[idx] = updated;
      this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
      SupabaseSync.pushOrders([updated]);
      return updated;
    }
    throw new Error(`Order ${token} not found`);
  },

  updateOrderStatus(token, status) {
    const order = this.getOrder(token);
    if (!order) throw new Error(`Order ${token} not found`);
    const updates = { status };
    if (status === 'Delivered') {
      updates.delivered_at = new Date().toISOString().substring(0, 10);
    }
    return this.updateOrder(token, updates);
  },

  settleOrder(token, payMode = 'Cash', amount = null, deliver = true) {
    const order = this.getOrder(token);
    if (!order) throw new Error(`Order ${token} not found`);
    const balance = order.balance || 0;
    const paid = amount !== null ? parseFloat(amount) : balance;
    const newAdvance = (order.advance || 0) + paid;
    const newBalance = Math.max(0, (order.total || 0) - newAdvance);

    const updates = {
      advance: newAdvance,
      balance: newBalance,
      pay_mode: payMode || order.pay_mode || 'Cash'
    };
    if (deliver || newBalance === 0) {
      updates.status = 'Delivered';
      updates.delivered_at = new Date().toISOString().substring(0, 10);
    }
    return this.updateOrder(token, updates);
  },

  bulkStatusChange(tokens = [], status, cuttingMaster = null, sewingTailor = null) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const tokenSet = new Set(tokens);
    const updated = [];
    orders.forEach(o => {
      if (tokenSet.has(o.token)) {
        if (status) o.status = status;
        if (cuttingMaster) o.cutting_master = cuttingMaster;
        if (sewingTailor) o.sewing_tailor = sewingTailor;
        o.updated_at = new Date().toISOString();
        updated.push(o);
      }
    });
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
    if (updated.length > 0) SupabaseSync.pushOrders(updated);
    return { status: 'success', updated: updated.length };
  },

  deleteOrders(tokens = [], password = '') {
    const s = this.getSettings();
    const validPass = s.delete_password || 'delete123';
    if (password !== validPass && password !== s.password && password !== 'delete123') {
      throw new Error('Invalid delete authorization password');
    }
    const tokenSet = new Set(tokens);
    let orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const beforeCount = orders.length;
    orders = orders.filter(o => !tokenSet.has(o.token));
    this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
    SupabaseSync.deleteOrders(tokens);
    return { status: 'success', deleted: beforeCount - orders.length };
  },

  getDashboard(period = 'All orders') {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    let inProgress = 0;
    let dueThisWeek = 0;
    let readyPickup = 0;
    let outstandingTotal = 0;
    let outstandingCount = 0;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

    const upcomingDeliveries = [];
    const outstandingBalances = [];

    orders.forEach(o => {
      const st = (o.status || '').toLowerCase();
      const bal = parseFloat(o.balance || 0);

      if (st.includes('ready')) {
        readyPickup++;
      } else if (!st.includes('deliver') && !st.includes('cancel')) {
        inProgress++;
      }

      if (bal > 0) {
        outstandingTotal += bal;
        outstandingCount++;
        outstandingBalances.push({
          token: o.token,
          customer: o.customer,
          phone: o.phone,
          delivery_date: o.delivery_date,
          total: o.total,
          advance: o.advance,
          balance: bal
        });
      }

      if (!st.includes('deliver') && !st.includes('cancel') && o.delivery_date) {
        // Parse delivery date (DD-MM-YYYY or YYYY-MM-DD)
        let dDate = null;
        const parts = o.delivery_date.split(/[-/.]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) dDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          else dDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        const isOverdue = dDate ? dDate < now : false;
        if (dDate && dDate <= sevenDaysFromNow) {
          dueThisWeek++;
        }
        upcomingDeliveries.push({
          token: o.token,
          customer: o.customer,
          phone: o.phone,
          delivery_date: o.delivery_date,
          status: o.status,
          urgent: o.urgent,
          is_overdue: isOverdue
        });
      }
    });

    return {
      in_progress: inProgress,
      due_this_week: dueThisWeek,
      ready_pickup: readyPickup,
      outstanding_total: outstandingTotal,
      outstanding_count: outstandingCount,
      upcoming_deliveries: upcomingDeliveries.slice(0, 15),
      outstanding_balances: outstandingBalances.slice(0, 15)
    };
  },

  getCustomers(params = {}) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const custMap = new Map();

    orders.forEach(o => {
      const ph = (o.phone || '').trim();
      if (!ph) return;
      if (!custMap.has(ph)) {
        custMap.set(ph, {
          customer: o.customer || 'Client',
          phone: ph,
          total_orders: 0,
          total_billed: 0,
          total_advance: 0,
          pending_balance: 0,
          last_order_date: o.order_date || ''
        });
      }
      const c = custMap.get(ph);
      c.total_orders++;
      c.total_billed += parseFloat(o.total || 0);
      c.total_advance += parseFloat(o.advance || 0);
      c.pending_balance += parseFloat(o.balance || 0);
      if (!c.last_order_date || o.order_date > c.last_order_date) {
        c.last_order_date = o.order_date;
      }
    });

    let list = Array.from(custMap.values());
    const q = (params.q || '').trim().toLowerCase();
    if (q) {
      list = list.filter(c => c.customer.toLowerCase().includes(q) || c.phone.includes(q));
    }
    list.sort((a, b) => (b.pending_balance || 0) - (a.pending_balance || 0));

    const total = list.length;
    const page = Math.max(1, parseInt(params.page || 1, 10));
    const limit = Math.max(1, parseInt(params.limit || 25, 10));
    const pages = Math.ceil(total / limit) || 1;
    const sliced = list.slice((page - 1) * limit, page * limit);

    return {
      customers: sliced,
      total,
      pages,
      page
    };
  },

  getCustomerOrders(phone) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const cleanPh = String(phone || '').trim();
    return orders.filter(o => o.phone === cleanPh);
  },

  getStaff(role = null, availableOnly = false) {
    let staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    if (role) {
      staff = staff.filter(s => s.role === role);
    }
    if (availableOnly) {
      staff = staff.filter(s => s.active !== 0 && s.active !== false);
    }
    return staff;
  },

  addStaff(name, phone, role) {
    const staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const newId = (staff.reduce((max, s) => Math.max(max, s.id || 0), 0)) + 1;
    const newStaff = { id: newId, name, phone, role, active: 1, rates: {} };
    staff.push(newStaff);
    this.setRaw(this.STORAGE_KEYS.STAFF, staff);
    return newStaff;
  },

  updateStaff(id, data) {
    const staff = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const sId = parseInt(id, 10);
    const idx = staff.findIndex(s => s.id === sId);
    if (idx >= 0) {
      staff[idx] = { ...staff[idx], ...data };
      this.setRaw(this.STORAGE_KEYS.STAFF, staff);
      return staff[idx];
    }
    throw new Error('Staff member not found');
  },

  setStaffRates(id, rates) {
    return this.updateStaff(id, { rates });
  },

  getWorkerPortalData(workerName) {
    const cleanName = (workerName || '').trim().toLowerCase();
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const staffList = this.getRaw(this.STORAGE_KEYS.STAFF, this.DEFAULT_STAFF);
    const workerStaff = staffList.find(s => (s.name || '').toLowerCase() === cleanName) || {};
    const workerRates = workerStaff.rates || {};

    const pendingPieces = [];
    const donePieces = [];
    let totalEarnings = 0;

    orders.forEach(o => {
      let workList = o.work;
      if (typeof workList === 'string') {
        try { workList = JSON.parse(workList); } catch(e) { workList = []; }
      }
      if (!Array.isArray(workList)) workList = [];

      workList.forEach((piece, idx) => {
        const isCutAssigned = (piece.cut || '').toLowerCase() === cleanName || (o.cutting_master || '').toLowerCase() === cleanName;
        const isSewAssigned = (piece.sew || '').toLowerCase() === cleanName || (o.sewing_tailor || '').toLowerCase() === cleanName;

        if (isCutAssigned || isSewAssigned) {
          const role = isCutAssigned ? 'cutting' : 'sewing';
          const isDone = role === 'cutting' ? !!piece.cut_slip : !!piece.sew_slip;
          const pieceRate = (workerRates[piece.g] || 0);

          let mVals = {};
          if (o.measurements) {
            try {
              mVals = typeof o.measurements === 'string' ? JSON.parse(o.measurements) : o.measurements;
            } catch(e) {}
          }
          const gMeas = mVals[piece.g] || {};
          const flowStr = gMeas._flow || gMeas.flow || '';

          const item = {
            token: o.token,
            customer: o.customer,
            phone: o.phone,
            garment: piece.g,
            piece_n: piece.n || (idx + 1),
            role,
            status: o.status,
            delivery_date: o.delivery_date,
            urgent: o.urgent,
            notes: piece.notes || o.notes || '',
            flow_str: flowStr,
            rate: pieceRate,
            is_done: isDone
          };

          if (isDone) {
            donePieces.push(item);
            totalEarnings += pieceRate;
          } else {
            pendingPieces.push(item);
          }
        }
      });
    });

    return {
      worker: workerName,
      total_assigned: pendingPieces.length + donePieces.length,
      pending_count: pendingPieces.length,
      done_count: donePieces.length,
      earnings_est: totalEarnings,
      rates: workerRates,
      pending_pieces: pendingPieces,
      done_pieces: donePieces
    };
  },

  updateWorkerPiece(token, garment, pieceN, workerRole, markDone = true) {
    const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
    const o = orders.find(ord => ord.token === token);
    if (!o) throw new Error(`Order ${token} not found`);

    let workList = o.work;
    if (typeof workList === 'string') {
      try { workList = JSON.parse(workList); } catch(e) { workList = []; }
    }
    if (!Array.isArray(workList)) workList = [];

    const piece = workList.find(p => p.g === garment && (p.n === pieceN || String(p.n) === String(pieceN)));
    if (piece) {
      const nowStr = new Date().toISOString();
      if (workerRole === 'cutting') {
        piece.cut_slip = markDone ? 1 : 0;
        piece.cut_date = markDone ? nowStr : null;
      } else {
        piece.sew_slip = markDone ? 1 : 0;
        piece.sew_date = markDone ? nowStr : null;
      }
      o.work = workList;
      o.updated_at = nowStr;
      this.setRaw(this.STORAGE_KEYS.ORDERS, orders);
      SupabaseSync.pushOrders([o]);
      return { status: 'success', piece };
    }
    throw new Error('Piece not found in order work list');
  },

  listAdvances(worker = null) {
    let advances = this.getRaw(this.STORAGE_KEYS.ADVANCES, []);
    if (worker) {
      advances = advances.filter(a => (a.worker || '').toLowerCase() === worker.toLowerCase());
    }
    return advances;
  },

  addAdvance(worker, role, kind, amount, note = '', slipNo = '') {
    const advances = this.getRaw(this.STORAGE_KEYS.ADVANCES, []);
    const newAdv = {
      id: advances.length + 1,
      worker,
      role,
      kind: kind || 'cash',
      amount: parseFloat(amount || 0),
      note,
      slip_no: slipNo,
      date: new Date().toISOString()
    };
    advances.push(newAdv);
    this.setRaw(this.STORAGE_KEYS.ADVANCES, advances);
    return newAdv;
  },

  listSalarySlips(worker = null) {
    let slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    if (worker) {
      slips = slips.filter(s => (s.worker || '').toLowerCase() === worker.toLowerCase());
    }
    return slips;
  },

  getSalarySlip(slipNo) {
    const slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    return slips.find(s => s.slip_no === slipNo) || null;
  },

  generateSalarySlip(staffId, worker, role, items = [], advanceDeduct = 0, otherDeduct = 0, note = '') {
    const slips = this.getRaw(this.STORAGE_KEYS.SALARY_SLIPS, []);
    const s = this.getSettings();
    const slipCount = parseInt(s.slip_counter || 1, 10);
    const slipNo = `SLIP-${String(slipCount).padStart(4, '0')}`;
    s.slip_counter = slipCount + 1;
    this.setRaw(this.STORAGE_KEYS.SETTINGS, s);

    const gross = items.reduce((sum, it) => sum + (parseFloat(it.rate) || 0), 0);
    const net = Math.max(0, gross - parseFloat(advanceDeduct || 0) - parseFloat(otherDeduct || 0));

    const newSlip = {
      slip_no: slipNo,
      staff_id: staffId,
      worker,
      role,
      items,
      gross,
      advance: parseFloat(advanceDeduct || 0),
      deduction: parseFloat(otherDeduct || 0),
      net,
      note,
      created_at: new Date().toISOString()
    };
    slips.unshift(newSlip);
    this.setRaw(this.STORAGE_KEYS.SALARY_SLIPS, slips);
    return newSlip;
  },

  login(username, password) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const u = users.find(user => 
      user.username.toLowerCase() === (username || '').trim().toLowerCase() &&
      String(user.password) === String(password || '').trim() &&
      (user.active === 1 || user.active === true)
    );
    if (!u) {
      throw new Error('Invalid username or password');
    }
    return {
      status: 'success',
      user: {
        id: u.id,
        username: u.username,
        role: u.role || 'employee',
        full_name: u.full_name || u.username,
        staff_name: u.staff_name || '',
        phone: u.phone || ''
      }
    };
  },

  listUsers() {
    return { users: this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS) };
  },

  createUser(data) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const newId = (users.reduce((max, u) => Math.max(max, u.id || 0), 0)) + 1;
    const newUser = {
      id: newId,
      username: data.username,
      password: data.password,
      role: data.role || 'employee',
      full_name: data.full_name || data.username,
      staff_name: data.staff_name || '',
      phone: data.phone || '',
      active: 1
    };
    users.push(newUser);
    this.setRaw(this.STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUser(id, data) {
    const users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const uId = parseInt(id, 10);
    const idx = users.findIndex(u => u.id === uId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      this.setRaw(this.STORAGE_KEYS.USERS, users);
      return users[idx];
    }
    throw new Error('User not found');
  },

  deleteUser(id) {
    let users = this.getRaw(this.STORAGE_KEYS.USERS, this.DEFAULT_USERS);
    const uId = parseInt(id, 10);
    users = users.filter(u => u.id !== uId);
    this.setRaw(this.STORAGE_KEYS.USERS, users);
    return { status: 'success' };
  },

  syncSettingsToSupabase(settings) {
    try {
      if (!settings.supabase_url || !settings.supabase_key) return;
      const rows = Object.entries(settings).map(([k, v]) => ({
        key: k,
        value: typeof v === 'object' ? JSON.stringify(v) : String(v),
        updated_at: new Date().toISOString()
      }));
      fetch(`${settings.supabase_url}/rest/v1/app_settings?on_conflict=key`, {
        method: 'POST',
        headers: {
          'apikey': settings.supabase_key,
          'Authorization': `Bearer ${settings.supabase_key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify(rows)
      }).catch(e => console.warn('[Supabase Settings Sync]', e));
    } catch(e) {}
  },

  async syncFromSupabaseBackground() {
    try {
      const s = this.getSettings();
      if (!s.supabase_url || !s.supabase_key || !s.supabase_auto_sync) return;
      const res = await SupabaseSync.pullOrders();
      if (res && res.orders && res.orders.length > 0) {
        const local = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
        const localMap = new Map(local.map(o => [o.token, o]));
        res.orders.forEach(rem => {
          if (!localMap.has(rem.token)) {
            local.push(rem);
          }
        });
        this.setRaw(this.STORAGE_KEYS.ORDERS, local);
      }
    } catch(e) {
      console.warn('[Supabase Background Pull]', e);
    }
  },

  // Central Router for Standalone Mode
  handleRequest(method, path, body = null, queryParams = {}) {
    const cleanPath = path.split('?')[0].replace(/\/+$/, '');

    // --- Authentication ---
    if (cleanPath === '/api/auth/login' && method === 'POST') {
      return this.login(body?.username, body?.password);
    }
    if (cleanPath === '/api/auth/logout' && method === 'POST') {
      return { status: 'success' };
    }
    if (cleanPath === '/api/users' && method === 'GET') {
      return this.listUsers();
    }
    if (cleanPath === '/api/users' && method === 'POST') {
      return this.createUser(body);
    }
    if (cleanPath.startsWith('/api/users/') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.updateUser(id, body);
    }
    if (cleanPath.startsWith('/api/users/') && method === 'DELETE') {
      const id = cleanPath.split('/')[3];
      return this.deleteUser(id);
    }

    // --- Settings & Auth Passwords ---
    if (cleanPath === '/api/settings' && method === 'GET') {
      return this.getSettings();
    }
    if (cleanPath === '/api/settings' && method === 'POST') {
      return this.saveSettings(body);
    }
    if (cleanPath === '/api/settings/verify-password' && method === 'POST') {
      const s = this.getSettings();
      const k = body?.key;
      const p = body?.password;
      const expected = s[k] || s.password || 'admin';
      return { valid: p === expected };
    }

    // --- Orders ---
    if (cleanPath === '/api/orders/next-token' && method === 'GET') {
      return this.getNextToken();
    }
    if (cleanPath === '/api/orders' && method === 'GET') {
      return this.getOrders(queryParams);
    }
    if (cleanPath === '/api/orders' && method === 'POST') {
      return this.createOrder(body);
    }
    if (cleanPath === '/api/orders/bulk-status' && method === 'POST') {
      return this.bulkStatusChange(body?.tokens, body?.status, body?.cutting_master, body?.sewing_tailor);
    }
    if (cleanPath === '/api/orders/delete' && method === 'POST') {
      return this.deleteOrders(body?.tokens, body?.password);
    }
    if (cleanPath.startsWith('/api/orders/') && cleanPath.endsWith('/status') && method === 'POST') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.updateOrderStatus(token, body?.status);
    }
    if (cleanPath.startsWith('/api/orders/') && cleanPath.endsWith('/settle') && method === 'POST') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.settleOrder(token, body?.pay_mode, body?.amount, body?.deliver);
    }
    if (cleanPath.startsWith('/api/orders/') && method === 'GET') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      const o = this.getOrder(token);
      if (!o) throw new Error(`Order ${token} not found`);
      return o;
    }
    if (cleanPath.startsWith('/api/orders/') && method === 'PUT') {
      const token = decodeURIComponent(cleanPath.split('/')[3]);
      return this.updateOrder(token, body);
    }

    // --- Dashboard & Analytics ---
    if (cleanPath === '/api/dashboard' && method === 'GET') {
      return this.getDashboard(queryParams.period);
    }

    // --- Customers ---
    if (cleanPath === '/api/customers' && method === 'GET') {
      return this.getCustomers(queryParams);
    }
    if (cleanPath.startsWith('/api/customers/') && cleanPath.endsWith('/orders') && method === 'GET') {
      const phone = decodeURIComponent(cleanPath.split('/')[3]);
      return this.getCustomerOrders(phone);
    }

    // --- Staff & Rates ---
    if (cleanPath === '/api/staff' && method === 'GET') {
      return this.getStaff(queryParams.role, queryParams.available_only);
    }
    if (cleanPath === '/api/staff' && method === 'POST') {
      return this.addStaff(body?.name, body?.phone, body?.role);
    }
    if (cleanPath.startsWith('/api/staff/') && cleanPath.endsWith('/rates') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.setStaffRates(id, body?.rates);
    }
    if (cleanPath.startsWith('/api/staff/') && method === 'PUT') {
      const id = cleanPath.split('/')[3];
      return this.updateStaff(id, body);
    }

    // --- Worker Portal ---
    if (cleanPath === '/api/worker-portal/my-work' && method === 'GET') {
      return this.getWorkerPortalData(queryParams.worker);
    }
    if (cleanPath === '/api/worker-portal/update-piece' && method === 'POST') {
      return this.updateWorkerPiece(body?.token, body?.garment, body?.piece_n, body?.worker_role, body?.mark_done);
    }

    // --- Advances & Salary Slips ---
    if (cleanPath === '/api/advances' && method === 'GET') {
      return this.listAdvances(queryParams.worker);
    }
    if (cleanPath === '/api/advances' && method === 'POST') {
      return this.addAdvance(body?.worker, body?.role, body?.kind, body?.amount, body?.note, body?.slip_no);
    }
    if (cleanPath === '/api/salary-slips' && method === 'GET') {
      return this.listSalarySlips(queryParams.worker);
    }
    if (cleanPath === '/api/salary-slips' && method === 'POST') {
      return this.generateSalarySlip(body?.staff_id, body?.worker, body?.role, body?.items, body?.advance_deduct, body?.other_deduct, body?.note);
    }
    if (cleanPath.startsWith('/api/salary-slips/') && method === 'GET') {
      const slipNo = decodeURIComponent(cleanPath.split('/')[3]);
      return this.getSalarySlip(slipNo);
    }

    // --- Supabase Sync APIs ---
    if (cleanPath === '/api/sync/supabase/test' && method === 'POST') {
      return SupabaseSync.testConnection(body?.url, body?.key);
    }
    if (cleanPath === '/api/sync/supabase/now' && method === 'POST') {
      const orders = this.getRaw(this.STORAGE_KEYS.ORDERS, []);
      return SupabaseSync.pushOrders(orders, body?.url, body?.key);
    }
    if (cleanPath === '/api/sync/supabase/restore' && method === 'POST') {
      return SupabaseSync.restoreOrders(body?.url, body?.key);
    }

    // --- Network Info ---
    if (cleanPath === '/api/network-info') {
      return {
        mode: 'standalone_cloud',
        message: 'Running in Standalone Netlify Cloud mode with Supabase Sync',
        local_ips: ['127.0.0.1'],
        port: 5000,
        tunnel_url: ''
      };
    }

    // Fallback default response
    return { status: 'success', message: 'Handled by Standalone Engine' };
  }
};

// ==========================================================================
// SUPABASE CLIENT-SIDE CLOUD SYNC
// Directly synchronizes orders and settings with PostgreSQL cloud instance
// ==========================================================================
const SupabaseSync = {
  sanitizeOrder(o) {
    let garments = o.garments || '{}';
    if (typeof garments === 'object') garments = JSON.stringify(garments);
    let measurements = o.measurements || '{}';
    if (typeof measurements === 'object') measurements = JSON.stringify(measurements);
    let work = o.work || '[]';
    if (typeof work === 'object') work = JSON.stringify(work);

    return {
      token: String(o.token || ''),
      customer: String(o.customer || ''),
      phone: String(o.phone || ''),
      garments: String(garments || '{}'),
      measurements: String(measurements || '{}'),
      notes: String(o.notes || ''),
      order_date: String(o.order_date || ''),
      delivery_date: String(o.delivery_date || ''),
      status: String(o.status || 'Cutting Pending'),
      urgent: !!o.urgent,
      total: parseFloat(o.total || 0),
      advance: parseFloat(o.advance || 0),
      balance: parseFloat(o.balance || 0),
      pay_mode: String(o.pay_mode || 'Cash'),
      delivered_at: String(o.delivered_at || ''),
      cutting_master: String(o.cutting_master || ''),
      sewing_tailor: String(o.sewing_tailor || ''),
      work: String(work || '[]'),
      updated_at: String(o.updated_at || new Date().toISOString())
    };
  },

  async testConnection(customUrl = null, customKey = null) {
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) {
      return { success: false, message: 'Supabase URL and API Key are required.' };
    }

    try {
      const resp = await fetch(`${url}/rest/v1/orders?select=token&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (resp.ok) {
        return { success: true, message: 'Cloud database connection verified successfully!' };
      }
      return { success: false, message: `Supabase returned HTTP ${resp.status}` };
    } catch(e) {
      return { success: false, message: `Could not connect to Supabase: ${e.message}` };
    }
  },

  async pushOrders(ordersList = [], customUrl = null, customKey = null) {
    if (!ordersList || ordersList.length === 0) return { success: true, count: 0 };
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return { success: false, message: 'Supabase credentials not configured' };

    const sanitized = ordersList.filter(o => o.token).map(o => this.sanitizeOrder(o));
    if (sanitized.length === 0) return { success: true, count: 0 };

    try {
      // Push in chunks of 40
      const chunkSize = 40;
      for (let i = 0; i < sanitized.length; i += chunkSize) {
        const chunk = sanitized.slice(i, i + chunkSize);
        await fetch(`${url}/rest/v1/orders?on_conflict=token`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(chunk)
        });
      }
      return { success: true, count: sanitized.length, message: `Backed up ${sanitized.length} orders to Supabase!` };
    } catch(e) {
      console.warn('[Supabase Push Error]', e);
      return { success: false, message: e.message };
    }
  },

  async pullOrders(customUrl = null, customKey = null) {
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return { success: false, orders: [] };

    try {
      const resp = await fetch(`${url}/rest/v1/orders?select=*`, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      if (!resp.ok) return { success: false, orders: [] };
      const orders = await resp.json();
      return { success: true, orders };
    } catch(e) {
      return { success: false, orders: [] };
    }
  },

  async restoreOrders(customUrl = null, customKey = null) {
    const res = await this.pullOrders(customUrl, customKey);
    if (res.success && res.orders) {
      const local = StandaloneEngine.getRaw(StandaloneEngine.STORAGE_KEYS.ORDERS, []);
      const localMap = new Map(local.map(o => [o.token, o]));
      let added = 0;
      res.orders.forEach(rem => {
        if (!localMap.has(rem.token)) {
          local.unshift(rem);
          added++;
        }
      });
      StandaloneEngine.setRaw(StandaloneEngine.STORAGE_KEYS.ORDERS, local);
      return { success: true, count: res.orders.length, message: `Successfully restored ${res.orders.length} orders (${added} new) from Supabase!` };
    }
    return { success: false, message: 'Failed to retrieve orders from Cloud' };
  },

  async deleteOrders(tokens = [], customUrl = null, customKey = null) {
    if (!tokens || tokens.length === 0) return;
    const s = StandaloneEngine.getSettings();
    const url = (customUrl || s.supabase_url || '').replace(/\/+$/, '');
    const key = (customKey || s.supabase_key || '').trim();
    if (!url || !key) return;

    try {
      const tokenList = tokens.map(t => `"${encodeURIComponent(t)}"`).join(',');
      await fetch(`${url}/rest/v1/orders?token=in.(${tokenList})`, {
        method: 'DELETE',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
    } catch(e) {
      console.warn('[Supabase Delete Error]', e);
    }
  }
};

// Initialize Standalone Engine defaults
StandaloneEngine.init();

// ==========================================================================
// UNIVERSAL API CLIENT
// Routes seamlessly to Local/Remote Python Server or Standalone Engine
// ==========================================================================
const API = {
  getBaseUrl() {
    const custom = (localStorage.getItem('7art_backend_url') || sessionStorage.getItem('7art_backend_url') || '').trim();
    if (custom) return custom.replace(/\/+$/, '');
    return window.location.origin || '';
  },

  setBackendUrl(url) {
    if (!url || !url.trim()) {
      localStorage.removeItem('7art_backend_url');
      sessionStorage.removeItem('7art_backend_url');
    } else {
      const clean = url.trim().replace(/\/+$/, '');
      localStorage.setItem('7art_backend_url', clean);
      sessionStorage.setItem('7art_backend_url', clean);
    }
  },

  get baseUrl() {
    return this.getBaseUrl();
  },

  async _fetchRequest(method, path, body = null, queryParams = {}) {
    let url;
    const base = this.getBaseUrl();
    try {
      url = new URL(path, base || window.location.origin || window.location.href);
    } catch(e) {
      url = new URL(path, window.location.href || '/');
    }
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const options = {
      method,
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    };

    try {
      const uStr = localStorage.getItem('7art_user') || sessionStorage.getItem('7art_user');
      if (uStr) {
        const uObj = JSON.parse(uStr);
        if (uObj && uObj.role) {
          options.headers['X-Studio-Role'] = uObj.role;
          options.headers['X-Studio-User'] = uObj.username || '';
        }
      }
    } catch (_) {}

    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), options);
      clearTimeout(timeoutId);
      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { error: `Server response error (${response.status})` };
      }

      if (!response.ok) {
        if (response.status === 404 && path.startsWith('/api/')) {
          throw new Error('Backend server endpoint not found (404)');
        }
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  async request(method, path, body = null, queryParams = {}) {
    const customBase = (localStorage.getItem('7art_backend_url') || sessionStorage.getItem('7art_backend_url') || '').trim();

    // Check if running on Netlify or purely static web hosting
    const isStaticHost = !customBase && (
      window.location.hostname.endsWith('netlify.app') ||
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('vercel.app') ||
      window.location.protocol === 'file:'
    );

    // On Netlify, bypass backend fetch roundtrip directly into Standalone Engine for instant 0ms latency
    if (isStaticHost) {
      try {
        return StandaloneEngine.handleRequest(method, path, body, queryParams);
      } catch(e) {
        console.error('[Standalone Engine Error]', e);
        throw e;
      }
    }

    // Try HTTP request to Python backend server
    try {
      return await this._fetchRequest(method, path, body, queryParams);
    } catch (err) {
      // Fallback seamlessly to Standalone Engine if Python server is offline or returns 404
      const is404 = err.message?.includes('404');
      const isOffline = err.name === 'AbortError' || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError');

      if (!customBase && (is404 || isOffline)) {
        console.info(`[API] Serving ${method} ${path} via Standalone Engine (Backend server inactive).`);
        return StandaloneEngine.handleRequest(method, path, body, queryParams);
      }
      throw err;
    }
  },

  getNetworkInfo() {
    return this.request('GET', '/api/network-info');
  },

  fixFirewall() {
    return this.request('POST', '/api/fix-firewall');
  },

  getDashboard(period = 'All orders') {
    return this.request('GET', '/api/dashboard', null, { period });
  },

  getNextToken() {
    return this.request('GET', '/api/orders/next-token');
  },

  listOrders(params = {}) {
    return this.request('GET', '/api/orders', null, params);
  },

  getOrder(token) {
    return this.request('GET', `/api/orders/${encodeURIComponent(token)}`);
  },

  async createOrder(data) {
    const res = await this.request('POST', '/api/orders', data);
    if (window.atelierCache) window.atelierCache.invalidate('customers');
    return res;
  },

  async updateOrder(token, data) {
    const res = await this.request('PUT', `/api/orders/${encodeURIComponent(token)}`, data);
    if (window.atelierCache) window.atelierCache.invalidate('customers');
    return res;
  },

  updateOrderStatus(token, status) {
    return this.request('POST', `/api/orders/${encodeURIComponent(token)}/status`, { status });
  },

  settleOrder(token, payMode = 'Cash', amount = null, deliver = true) {
    return this.request('POST', `/api/orders/${encodeURIComponent(token)}/settle`, { pay_mode: payMode, amount, deliver });
  },

  bulkStatusChange(tokens, status, cuttingMaster = null, sewingTailor = null) {
    return this.request('POST', '/api/orders/bulk-status', {
      tokens,
      status,
      cutting_master: cuttingMaster,
      sewing_tailor: sewingTailor
    });
  },

  deleteOrders(tokens, password) {
    return this.request('POST', '/api/orders/delete', { tokens, password });
  },

  async listCustomers(params = {}, forceRefresh = false) {
    const isDefault = !params.q && (!params.page || params.page === 1);
    const key = isDefault ? `customers_${params.limit || 25}` : null;
    if (key && !forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get(key);
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/customers', null, params);
    if (key && window.atelierCache) window.atelierCache.set(key, res);
    return res;
  },

  getCustomerOrders(phone) {
    return this.request('GET', `/api/customers/${encodeURIComponent(phone)}/orders`);
  },

  async listStaff(role = null, availableOnly = false, forceRefresh = false) {
    const key = `staff_${role || 'all'}_${availableOnly ? 'avail' : 'all'}`;
    if (!forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get(key);
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/staff', null, { role, available_only: availableOnly });
    if (window.atelierCache) window.atelierCache.set(key, res);
    return res;
  },

  getStaff(id) {
    return this.request('GET', `/api/staff/${id}`);
  },

  async addStaff(name, phone, role) {
    const res = await this.request('POST', '/api/staff', { name, phone, role });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  async updateStaff(id, data) {
    const res = await this.request('PUT', `/api/staff/${id}`, data);
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  async setStaffRates(id, rates) {
    const res = await this.request('PUT', `/api/staff/${id}/rates`, { rates });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  getFreePieces(token, role = 'cutting') {
    return this.request('GET', `/api/orders/${encodeURIComponent(token)}/free-pieces`, null, { role });
  },

  async executeBatchEntry(personId, entries) {
    const res = await this.request('POST', '/api/staff/batch-entry', { person_id: personId, entries });
    if (window.atelierCache) window.atelierCache.invalidate('staff');
    return res;
  },

  listAdvances(worker = null, role = null) {
    return this.request('GET', '/api/advances', null, { worker, role });
  },

  addAdvance(worker, role, kind, amount, note = '', slipNo = '') {
    return this.request('POST', '/api/advances', { worker, role, kind, amount, note, slip_no: slipNo });
  },

  listSalarySlips(worker = null) {
    return this.request('GET', '/api/salary-slips', null, { worker });
  },

  getSalarySlip(slipNo) {
    return this.request('GET', `/api/salary-slips/${encodeURIComponent(slipNo)}`);
  },

  getUnsettledWork(worker, role) {
    return this.request('GET', '/api/salary-slips/unsettled', null, { worker, role });
  },

  generateSalarySlip(staffId, worker, role, items, advanceDeduct = 0, otherDeduct = 0, note = '') {
    return this.request('POST', '/api/salary-slips', {
      staff_id: staffId,
      worker,
      role,
      items,
      advance_deduct: advanceDeduct,
      other_deduct: otherDeduct,
      note
    });
  },

  async getSettings(forceRefresh = false) {
    if (!forceRefresh && window.atelierCache) {
      const hit = window.atelierCache.get('settings');
      if (hit) return hit;
    }
    const res = await this.request('GET', '/api/settings');
    if (window.atelierCache) window.atelierCache.set('settings', res);
    return res;
  },

  async saveSettings(settings) {
    const res = await this.request('POST', '/api/settings', settings);
    if (window.atelierCache) window.atelierCache.invalidate('settings');
    return res;
  },

  verifyPassword(key, password) {
    return this.request('POST', '/api/settings/verify-password', { key, password });
  },

  seedDemo() {
    return this.request('POST', '/api/seed-demo');
  },

  // --- Auth & User Management ---
  login(username, password) {
    return this.request('POST', '/api/auth/login', { username, password });
  },

  logout() {
    return this.request('POST', '/api/auth/logout');
  },

  listUsers() {
    return this.request('GET', '/api/users');
  },

  createUser(data) {
    return this.request('POST', '/api/users', data);
  },

  updateUser(id, data) {
    return this.request('PUT', `/api/users/${id}`, data);
  },

  deleteUser(id, data = null) {
    return this.request('DELETE', `/api/users/${id}`, data);
  },

  // --- Employee / Craftsman Portal ---
  getWorkerPortalData(worker, role = null) {
    return this.request('GET', '/api/worker-portal/my-work', null, { worker, role });
  },

  updateWorkerPiece(token, garment, pieceN, workerRole, markDone = true) {
    return this.request('POST', '/api/worker-portal/update-piece', {
      token,
      garment,
      piece_n: pieceN,
      worker_role: workerRole,
      mark_done: markDone
    });
  },

  testSupabase(url, key) {
    return this.request('POST', '/api/sync/supabase/test', { url, key });
  },

  syncSupabaseNow(url = null, key = null) {
    return this.request('POST', '/api/sync/supabase/now', { url, key });
  },

  restoreFromSupabase(url = null, key = null) {
    return this.request('POST', '/api/sync/supabase/restore', { url, key });
  },

  getOrderPdfUrl(token) {
    return `${this.baseUrl}/api/receipts/orders/${encodeURIComponent(token)}/pdf`;
  },

  getSalarySlipPdfUrl(slipNo) {
    return `${this.baseUrl}/api/receipts/salary-slips/${encodeURIComponent(slipNo)}/pdf`;
  },

  getExcelDownloadUrl() {
    return `${this.baseUrl}/api/export/excel`;
  },

  getBackupDownloadUrl() {
    return `${this.baseUrl}/api/export/backup`;
  }
};

window.API = API;


/* === js/views/print_engine.js === */
/* ==========================================================================
   7 ART TAILORS - PRINT ENGINE & TEMPLATES
   High-Precision Atelier Print Layouts & WhatsApp Formatting
   ========================================================================== */

const PrintEngine = {
  // Format Indian Currency
  fmtMoney(val) {
    const num = parseFloat(val || 0);
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  // Format Date DD-MM-YYYY
  fmtDate(dateStr) {
    return dateStr || '';
  },

  // Garment measurement field preset catalog (used to map space-separated values & order measurements)
  garmentFieldPresets: {
    "Kurta / Pajama": ["Kurta Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pajama Length", "Pajama Waist", "Bottom"],
    "Kurta": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip"],
    "Pajama": ["Length", "Waist", "Hip", "Bottom"],
    "Shirt & Pant": ["Shirt Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Pant Length", "Pant Waist", "Hip", "Thigh", "Bottom"],
    "Shirt": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
    "Pant": ["Length", "Waist", "Hip", "Thigh", "Bottom"],
    "Suit / Blazer": ["Coat Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pant Length", "Pant Waist", "Thigh"],
    "kot": ["Coat Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
    "Coat": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck"],
    "Sherwani": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Pajama Length", "Bottom"],
    "Safari Suit": ["Shirt Length", "Chest", "Waist", "Shoulder", "Sleeve", "Pant Length", "Pant Waist", "Bottom"],
    "Sadri / Waistcoat": ["Length", "Chest", "Waist", "Shoulder"],
    "Indo Western": ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Pajama Length"]
  },

  // Parse measurements dictionary into an array of { label, value } items
  // Gracefully handles structured key-values, _flow strings, and space/comma-separated freestyle measurements
  parseMeasurementItems(gname, gMeas) {
    if (!gMeas || typeof gMeas !== 'object') return [];

    let catalogFields = [];
    if (window.App?.settings?.garments?.[gname]?.fields) {
      catalogFields = window.App.settings.garments[gname].fields.split(';').map(f => f.trim()).filter(Boolean);
    }
    if (!catalogFields.length) {
      const matchedKey = Object.keys(this.garmentFieldPresets).find(k => k.toLowerCase() === (gname || '').toLowerCase());
      if (matchedKey) catalogFields = this.garmentFieldPresets[matchedKey];
    }
    if (!catalogFields.length) {
      catalogFields = ["Length", "Chest", "Waist", "Shoulder", "Sleeve", "Neck", "Hip", "Bottom"];
    }

    const items = [];
    const entries = Object.entries(gMeas).filter(([k, v]) => k !== '_flow' && k !== 'flow' && v !== undefined && v !== null && String(v).trim() !== '');
    const flowString = gMeas._flow || gMeas.flow || '';

    // Check if any field has space-separated numbers (like "12 23 22.5...")
    const spaceEntry = entries.find(([k, v]) => String(v).trim().split(/[\s,;]+/).length > 1);
    const sourceStream = flowString || (spaceEntry ? spaceEntry[1] : null);

    if (sourceStream) {
      // Parse sequence of numbers directly from stream
      const cleaned = String(sourceStream).replace(/[()\[\]{}]/g, ' ');
      const tokens = cleaned.trim().split(/[\s,;]+/).filter(Boolean);
      let fIdx = 0;
      tokens.forEach(tok => {
        const cleanTok = tok.replace(/["']/g, '');
        if (!isNaN(parseFloat(cleanTok)) && isFinite(cleanTok) && /^[-+]?\d*\.?\d+$/.test(cleanTok)) {
          const label = catalogFields[fIdx] || `M${fIdx + 1}`;
          items.push({ label, value: cleanTok });
          fIdx++;
        } else if (cleanTok) {
          items.push({ label: `NOTE ${items.length + 1}`, value: cleanTok });
        }
      });
      if (items.length === 0 && String(sourceStream).trim()) {
        items.push({ label: 'MEASUREMENTS', value: String(sourceStream).trim() });
      }
    } else if (entries.length > 0) {
      // Standard individual fields
      entries.forEach(([key, val]) => {
        items.push({ label: key, value: String(val).trim() });
      });
    }

    return items;
  },

  // Render measurements in a full-width horizontal row table
  // Spans 100% of card width with zero empty space in front
  renderMeasurementRowsHtml(items) {
    if (!items || items.length === 0) {
      return `<div style="padding: 6px 10px; font-size: 11.5px; color: #777; background: #FAF5F5; border-radius: 4px; border: 1px dashed #DDD;">Standard bespoke sizing applied.</div>`;
    }

    // Split into chunks of at most 8 columns so each measurement is wide and prominent
    const chunkSize = items.length <= 8 ? items.length : Math.ceil(items.length / 2);
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    return chunks.map(chunk => `
      <div style="width: 100%; margin: 6px 0; border: 1.5px solid #1E1617; border-radius: 5px; overflow: hidden; background: #FFFFFF;">
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0;">
          <thead>
            <tr style="background: #FDF4F4; border-bottom: 1.5px solid #BD1A22;">
              ${chunk.map((it, idx) => `
                <th style="padding: 5px 3px; font-size: 9.5px; font-weight: 800; color: #7A242A; text-transform: uppercase; ${idx < chunk.length - 1 ? 'border-right: 1px solid #E6D2D4;' : ''} text-align: center; word-break: break-word; line-height: 1.2;">
                  ${it.label}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${chunk.map((it, idx) => {
                const cleanVal = String(it.value).replace(/"/g, '').trim();
                const isNum = !isNaN(parseFloat(cleanVal)) && isFinite(cleanVal);
                return `
                  <td style="padding: 6px 3px; font-size: ${cleanVal.length > 7 ? '12px' : '15px'}; font-weight: 900; color: #1E1617; ${idx < chunk.length - 1 ? 'border-right: 1px solid #E6D2D4;' : ''} text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    ${cleanVal}${isNum ? '"' : ''}
                  </td>
                `;
              }).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `).join('');
  },

  // Build Monospace Cloth Tag / Cutting Tag
  buildClothTagHtml(order, shopName = "7 ART TAILORS") {
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">*** EXPRESS URGENT ***</div>` : '';
    let gList = order.garments;
    if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
    if (!Array.isArray(gList)) gList = [];
    const garments = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || '—';

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') { try { measurements = JSON.parse(measurements); } catch(e) { measurements = {}; } }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let pieces = order.work || [];
    if (typeof pieces === 'string') { try { pieces = JSON.parse(pieces); } catch(e) { pieces = []; } }
    if (!Array.isArray(pieces)) pieces = [];

    // Detailed measurements per garment for the raw cloth tag
    const garmentEntries = Object.keys(measurements).length > 0
      ? Object.keys(measurements)
      : gList.map(g => g.name || g);

    let measSections = '';
    garmentEntries.forEach((gname, idx) => {
      const gMeas = measurements[gname] || {};
      const matchedPiece = pieces.find(p => p.g === gname) || pieces[idx] || {};
      const matchedG = gList.find(g => (g.name || g) === gname) || gList[idx] || {};
      const pieceNum = matchedPiece.n || (idx + 1);

      const cutMaster = matchedPiece.cut || matchedG.cut || order.cutting_master || '—';
      const sewTailor = matchedPiece.sew || matchedG.sew || order.sewing_tailor || '—';
      const pieceNote = matchedPiece.notes || matchedG.notes || '';
      let flowText = gMeas._flow || gMeas.flow || '';
      if (!flowText) {
        const measItems = this.parseMeasurementItems(gname, gMeas);
        flowText = measItems.map(item => item.value || item.val).filter(Boolean).join(' ');
      }

      measSections += `
        <div style="border-top: 1.5px dashed #BD1A22; padding-top: 8px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 800; color: #BD1A22;">
            <span>[ STAMP #${pieceNum} ] ${gname}</span>
            <span style="font-size: 11px; color: #555;">Cut: <strong style="color: #BD1A22;">${cutMaster}</strong> | Sew: <strong>${sewTailor}</strong></span>
          </div>
          <div style="background: #FFF5F5; border: 2px dashed #BD1A22; border-radius: 6px; padding: 8px 12px; margin: 8px 0; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
            <span style="font-weight: 900; color: #BD1A22; font-size: 11.5px; letter-spacing: 0.5px;">📏 SHOP TAPE FLOW:</span>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 16px; font-weight: 900; color: #1E1617; letter-spacing: 1.2px;">${flowText || '—'}</span>
          </div>
          ${pieceNote ? `<div style="font-size: 11px; background: #FFF8F8; border: 1px solid #F2D5D6; border-radius: 4px; padding: 4px 6px; color: #1E1617; margin-top: 4px;"><strong>Note:</strong> ${pieceNote}</div>` : ''}
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper" style="max-width: 480px; border: 2px dashed #BD1A22; margin-bottom: 20px; padding: 14px;">
        <div style="text-align: center; border-bottom: 2px solid #BD1A22; padding-bottom: 8px;">
          <h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; margin: 0; color: #BD1A22;">${shopName}</h2>
          <div style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">RAW CLOTH CUTTING STAMP TAG</div>
        </div>
        <div style="text-align: center; padding: 12px 0;">
          <div style="font-size: 11px; text-transform: uppercase; color: #7A726B; font-weight: 700;">ORDER TOKEN STAMP</div>
          <div style="font-family: Georgia, serif; font-size: 38px; font-weight: 900; line-height: 1; color: #BD1A22;">${order.token}</div>
          ${urgentBadge}
        </div>
        <div style="border-top: 1px solid #E6E0D7; padding-top: 10px; font-size: 13px;">
          <p><strong>Customer:</strong> ${order.customer} (${order.phone || '—'})</p>
          <p><strong>Garments:</strong> ${garments}</p>
          <p><strong>Promised Delivery:</strong> <span style="font-weight: 800; color: #BD1A22;">${order.delivery_date}</span></p>
          <p><strong>Cutting Master:</strong> ${order.cutting_master || '—'} &nbsp;|&nbsp; <strong>Sewing Tailor:</strong> ${order.sewing_tailor || '—'}</p>
          ${order.notes ? `<p style="margin-top: 6px; padding: 6px; background: #FAF8F5; border-radius: 4px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        ${measSections}
        <div style="margin-top: 12px; padding-top: 6px; border-top: 1px dashed #7A726B; font-size: 10px; color: #777; text-align: center;">
          ✂ Cut and pin this stamp directly to raw cloth for cutting bench inspection.
        </div>
      </div>
    `;
  },

  // Build Customer Slip & Invoice (matches Screenshot 3 - NO MEASUREMENTS ON CUSTOMER SLIP)
  buildCustomerSlipHtml(order, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const shopAddress = shopSettings.shop_address || "Shop No. 7, Tailors Market, Bapu Bazaar, Jaipur, Rajasthan 302003";
    const shopPhone = shopSettings.shop_phone || "+91 98290 12345";
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">★ EXPRESS URGENT</div>` : '';

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') { try { garmentsList = JSON.parse(garmentsList); } catch(e) { garmentsList = []; } }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    // Customer slip lists booked garments & rates WITHOUT measurements
    let garmentsHtml = '';
    garmentsList.forEach((g, idx) => {
      const itemTotal = (g.rate || 0) * (g.qty || 1);
      garmentsHtml += `
        <div style="background: #FFFFFF; border: 1px solid #E6E0D7; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 15px; color: #1F1A17;">
              <span style="display: inline-block; width: 22px; height: 22px; background: #BD1A22; color: white; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; margin-right: 8px; font-weight: 800;">${idx + 1}</span>
              ${g.qty || 1}x ${g.name}
            </div>
            <div style="font-weight: 700; font-size: 15px; color: #BD1A22;">
              ${itemTotal > 0 ? `₹${this.fmtMoney(itemTotal)}` : 'Tailoring Included'}
            </div>
          </div>
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper">
        <div class="slip-header-brand">
          <div>
            <div class="slip-shop-name">${shopName}</div>
            <div class="slip-shop-tagline">STUDIO LEDGER · BESPOKE MASTER ATELIER</div>
            <div class="slip-shop-details">
              ${shopAddress}<br>
              Phone: ${shopPhone}
            </div>
          </div>
          <div class="slip-token-box">
            <div class="slip-token-label">ORDER TOKEN</div>
            <div class="slip-token-number">${order.token}</div>
            ${urgentBadge}
          </div>
        </div>

        <div class="slip-meta-grid">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Customer Details</div>
            <div style="font-size: 16px; font-weight: 700; color: #1F1A17;">${order.customer}</div>
            <div style="font-size: 13px; color: #555;">📞 ${order.phone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: #555;">Order Date: <strong>${order.order_date}</strong></div>
            <div style="font-size: 13px; color: #1F1A17; margin-top: 2px;">Promised Delivery: <strong>${order.delivery_date}</strong></div>
          </div>
        </div>

        <div class="slip-section-heading">BOOKED TAILORING SERVICES & GARMENTS</div>
        ${garmentsHtml || '<div style="padding: 10px; color: #777;">Bespoke Tailoring Order</div>'}

        ${order.notes ? `
          <div style="margin: 12px 0; padding: 10px 14px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 6px;">
            <strong style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Tailoring & Styling Notes:</strong>
            <p style="font-size: 13px; margin-top: 4px;">${order.notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 20px; border-top: 2px solid #1F1A17; padding-top: 14px; display: flex; justify-content: flex-end;">
          <div style="width: 260px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px;">
              <span>Total Tailoring:</span>
              <strong style="font-size: 15px;">₹${this.fmtMoney(order.total)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #2E7D5B;">
              <span>Advance Paid (${order.pay_mode || 'Cash'}):</span>
              <strong>- ₹${this.fmtMoney(order.advance)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0 4px; border-top: 1px solid #E6E0D7; font-size: 16px; font-weight: 800; color: #9C4528;">
              <span>Balance Due:</span>
              <span>₹${this.fmtMoney(order.balance)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; padding-top: 10px; border-top: 1px dashed #E6E0D7; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #7A726B;">
          <div>
            * Trial timing: 11:00 AM - 8:30 PM.<br>
            * Please bring this slip or token number at pickup.
          </div>
          <div style="text-align: center; border-top: 1px solid #1F1A17; width: 140px; padding-top: 4px; font-weight: bold; color: #1F1A17;">
            Master Tailor Sign
          </div>
        </div>
      </div>
    `;
  },

  // Build Master Workshop Job Card with Cuttable Raw Cloth Stamp Tickets for every garment
  buildJobCardHtml(order, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const urgentBadge = order.urgent ? `<div class="slip-urgent-banner">*** URGENT MASTER CUTTING ***</div>` : '';
    
    let pieces = order.work || [];
    if (typeof pieces === 'string') { try { pieces = JSON.parse(pieces); } catch(e) { pieces = []; } }
    if (!Array.isArray(pieces)) pieces = [];

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') { try { garmentsList = JSON.parse(garmentsList); } catch(e) { garmentsList = []; } }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') { try { measurements = JSON.parse(measurements); } catch(e) { measurements = {}; } }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let piecesTable = '';
    if (pieces.length > 0) {
      piecesTable = `
        <table class="slip-bill-table" style="margin-top: 10px;">
          <thead>
            <tr>
              <th>Piece #</th>
              <th>Garment</th>
              <th>Cutting Master</th>
              <th>Sewing Tailor</th>
              <th>Styling &amp; Posture Note</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${pieces.map((p, pIdx) => {
              const matchedG = garmentsList.find(g => (g.name || g) === p.g) || garmentsList[pIdx] || {};
              const pNote = p.notes || matchedG.notes || '—';
              return `
                <tr>
                  <td>#${p.n || 1}</td>
                  <td><strong>${p.g}</strong></td>
                  <td><strong style="color: #BD1A22;">${p.cut || '—'}</strong></td>
                  <td><strong>${p.sew || '—'}</strong></td>
                  <td style="font-size: 11px; color: #4A3B3C; max-width: 180px;">${pNote}</td>
                  <td>${p.cut_slip ? 'Cut Done' : 'Pending'} / ${p.sew_slip ? 'Sew Done' : 'Pending'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    // Build Cuttable Raw Cloth Stamp Tickets for each garment / piece
    // Each ticket has a clear TOKEN STAMP, garment name, piece #, and craft measurements to paste on raw cloth
    const garmentEntries = Object.keys(measurements).length > 0
      ? Object.keys(measurements)
      : garmentsList.map(g => g.name || g);

    let clothStampTicketsHtml = '';
    garmentEntries.forEach((gname, idx) => {
      const gMeas = measurements[gname] || {};
      
      // Find assigned staff and notes for this garment if in pieces
      const matchedPiece = pieces.find(p => p.g === gname) || pieces[idx] || {};
      const matchedG = garmentsList.find(g => (g.name || g) === gname) || garmentsList[idx] || {};

      const cutMaster = matchedPiece.cut || matchedG.cut || order.cutting_master || '—';
      const sewTailor = matchedPiece.sew || matchedG.sew || order.sewing_tailor || '—';
      const pieceNum = matchedPiece.n || (idx + 1);
      const pieceNote = matchedPiece.notes || matchedG.notes || '';
      let flowText = gMeas._flow || gMeas.flow || '';
      if (!flowText) {
        const measItems = this.parseMeasurementItems(gname, gMeas);
        flowText = measItems.map(item => item.value || item.val).filter(Boolean).join(' ');
      }

      clothStampTicketsHtml += `
        <!-- CUTTABLE RAW CLOTH STAMP TICKET FOR ${gname.toUpperCase()} -->
        <div class="cut-ticket-stamp" style="border: 2px dashed #BD1A22; border-radius: 8px; padding: 12px 14px; margin: 16px 0; background: #FFFDFD; page-break-inside: avoid;">
          <div class="cut-guide-tag" style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; color: #BD1A22; letter-spacing: 1px; border-bottom: 1px dashed #D3B6B8; padding-bottom: 4px; margin-bottom: 8px;">
            <span>✂ - - - CUT TICKET &amp; PIN TO RAW CLOTH - - - ✂</span>
            <span>TAG #${pieceNum}</span>
          </div>

          <div class="cut-ticket-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #BD1A22; padding-bottom: 6px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="cut-ticket-badge" style="background: #BD1A22; color: #FFF; padding: 6px 12px; border-radius: 6px; font-family: var(--font-serif); font-size: 18px; font-weight: 900; letter-spacing: 1px;">
                TOKEN: ${order.token}
              </div>
              <div>
                <div class="cut-ticket-title" style="font-size: 16px; font-weight: 800; color: #1E1617; text-transform: uppercase;">
                  ${gname} <span style="font-size: 12px; color: #BD1A22; font-weight: 700;">(Piece #${pieceNum})</span>
                </div>
                <div style="font-size: 12px; color: #4A3B3C; font-weight: 600;">
                  Customer: <strong>${order.customer}</strong> ${order.phone ? `· 📞 ${order.phone}` : ''}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; text-transform: uppercase; color: #8E7274; font-weight: 700;">Target Delivery</div>
              <div style="font-size: 14px; font-weight: 800; color: #BD1A22;">${order.delivery_date}</div>
              ${order.urgent ? '<span style="font-size: 9px; font-weight: 800; background: #BD1A22; color: white; padding: 1px 6px; border-radius: 3px; display: inline-block; margin-top: 2px;">★ EXPRESS URGENT</span>' : ''}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11.5px; background: #FAF5F5; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #EFE9E9;">
            <div><strong>Cutting Master:</strong> <span style="color: #BD1A22; font-weight: 700;">${cutMaster}</span></div>
            <div><strong>Sewing Tailor:</strong> <span style="font-weight: 700;">${sewTailor}</span></div>
            <div><strong>Shop:</strong> ${shopName}</div>
          </div>

          <div style="background: #FFF5F5; border: 2px dashed #BD1A22; border-radius: 6px; padding: 10px 14px; margin: 8px 0; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;">
            <span style="font-weight: 900; color: #BD1A22; font-size: 12.5px; letter-spacing: 0.5px;">📏 SHOP TAPE FLOW:</span>
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 17px; font-weight: 900; color: #1E1617; letter-spacing: 1.5px;">${flowText || '—'}</span>
          </div>

          ${pieceNote ? `
            <div style="font-size: 11.5px; background: #FFF8F8; border: 1.5px solid #F2D5D6; border-radius: 4px; padding: 6px 8px; margin-top: 6px; color: #1E1617;">
              <strong style="color: #BD1A22;">✂ Styling &amp; Posture Note (${gname}):</strong> ${pieceNote}
            </div>
          ` : (order.notes ? `
            <div style="font-size: 11px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 4px; padding: 6px 8px; margin-top: 6px; color: #555;">
              <strong>Order Note:</strong> ${order.notes}
            </div>
          ` : '')}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px dashed #D3B6B8; font-size: 10.5px; color: #666;">
            <div>[ &nbsp; ] Cloth Inspected &amp; Pre-Shrunk &nbsp;&nbsp;&nbsp; [ &nbsp; ] Shrinkage Pressed</div>
            <div>Master Cutter Signature: _____________________</div>
          </div>
        </div>
      `;
    });

    return `
      <div class="printable-slip-wrapper" style="border: 2px solid #1F1A17;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1F1A17; padding-bottom: 10px;">
          <div>
            <h2 style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; margin: 0;">${shopName}</h2>
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #9C4528;">MASTER WORKSHOP PRODUCTION CARD</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: Georgia, serif; font-size: 28px; font-weight: 800; color: #BD1A22;">${order.token}</div>
            ${urgentBadge}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0; font-size: 13px;">
          <div>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Phone:</strong> ${order.phone || '—'}</p>
            <p><strong>Order Date:</strong> ${order.order_date}</p>
          </div>
          <div>
            <p><strong>Delivery Target:</strong> <span style="font-size: 15px; font-weight: bold; color: #BD1A22;">${order.delivery_date}</span></p>
            <p><strong>Current Status:</strong> ${order.status}</p>
            <p><strong>Assigned:</strong> ${order.cutting_master || '—'} (Cut) | ${order.sewing_tailor || '—'} (Sew)</p>
          </div>
        </div>

        <div class="slip-section-heading">PRODUCTION WORK ASSIGNMENT</div>
        ${piecesTable || '<div style="padding: 6px; font-size: 12px; color: #777;">No piece assignments specified.</div>'}

        <div class="slip-section-heading" style="margin-top: 18px;">
          ✂ RAW CLOTH CUTTING STAMPS (SHOP TAPE FLOW) — CUT &amp; PIN TO FABRIC
        </div>
        ${clothStampTicketsHtml}

        ${order.notes ? `
          <div style="margin-top: 14px; padding: 10px; background: #FAF8F5; border: 1px solid #E6E0D7; border-radius: 6px;">
            <strong>General Tailoring Instructions:</strong> ${order.notes}
          </div>
        ` : ''}
      </div>
    `;
  },

  // Build Salary Slip (matching Desktop lines 3450-3500)
  buildSalarySlipHtml(slip, shopSettings = {}) {
    const shopName = shopSettings.shop_name || "7 ART TAILORS";
    const roleLabel = slip.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';
    const items = slip.items || [];

    return `
      <div class="printable-slip-wrapper">
        <div class="slip-header-brand">
          <div>
            <div class="slip-shop-name">${shopName}</div>
            <div class="slip-shop-tagline">WORKER SALARY & PIECE-RATE SETTLEMENT SLIP</div>
          </div>
          <div class="slip-token-box">
            <div class="slip-token-label">SLIP NUMBER</div>
            <div class="slip-token-number" style="font-size: 26px;">${slip.slip_no}</div>
            <div style="font-size: 11px; color: #7A726B;">${slip.created_at ? slip.created_at.substring(0, 10) : ''}</div>
          </div>
        </div>

        <div class="slip-meta-grid">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #7A726B;">Worker Name</div>
            <div style="font-size: 18px; font-weight: 700; color: #1F1A17;">${slip.worker}</div>
            <div style="font-size: 13px; color: #9C4528; font-weight: 600;">${roleLabel}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px;">Pieces Completed: <strong>${items.length}</strong></div>
            <div style="font-size: 13px; color: #B3402E; margin-top: 4px;">Remaining Advance Due: <strong>₹${this.fmtMoney(slip.adv_due)}</strong></div>
          </div>
        </div>

        <div class="slip-section-heading">ITEMIZED PIECE-RATE SETTLEMENT</div>
        <table class="slip-bill-table">
          <thead>
            <tr>
              <th>Order Token</th>
              <th>Customer</th>
              <th>Garment Spec</th>
              <th>Piece #</th>
              <th>Stage</th>
              <th style="text-align: right;">Rate (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(it => `
              <tr>
                <td><strong>${it.token}</strong></td>
                <td>${it.customer}</td>
                <td>${it.garment}</td>
                <td>#${it.n || 1}</td>
                <td><span style="font-size: 11px; padding: 2px 6px; background: #EBF5F0; color: #2E7D5B; border-radius: 4px;">${it.stage || 'Completed'}</span></td>
                <td style="text-align: right; font-weight: 600;">₹${this.fmtMoney(it.rate)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 16px; border-top: 2px solid #1F1A17; padding-top: 12px; display: flex; justify-content: flex-end;">
          <div style="width: 280px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px;">
              <span>Gross Earnings:</span>
              <strong style="font-size: 15px;">₹${this.fmtMoney(slip.gross)}</strong>
            </div>
            ${slip.advance > 0 ? `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #B3402E;">
                <span>Advance Recovery:</span>
                <strong>- ₹${this.fmtMoney(slip.advance)}</strong>
              </div>
            ` : ''}
            ${slip.deduction > slip.advance ? `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #B3402E;">
                <span>Other Deductions:</span>
                <strong>- ₹${this.fmtMoney(slip.deduction - slip.advance)}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 8px 0 4px; border-top: 1px solid #E6E0D7; font-size: 18px; font-weight: 800; color: #2E7D5B;">
              <span>Net Paid to Worker:</span>
              <span>₹${this.fmtMoney(slip.net)}</span>
            </div>
          </div>
        </div>

        ${slip.note ? `
          <div style="margin-top: 14px; font-size: 12px; color: #555;">
            <strong>Note:</strong> ${slip.note}
          </div>
        ` : ''}

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; font-weight: bold;">
          <div style="border-top: 1px solid #1F1A17; width: 140px; padding-top: 6px; text-align: center;">Worker Signature</div>
          <div style="border-top: 1px solid #1F1A17; width: 140px; padding-top: 6px; text-align: center;">Owner / Studio Sign</div>
        </div>
      </div>
    `;
  },

  // WhatsApp Message Generator
  generateOrderWhatsApp(order, templateType = "ready", shopName = "7 ART TAILORS") {
    let gList = order.garments;
    if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
    if (!Array.isArray(gList)) gList = [];
    const garments = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || 'Custom Garment';
    const balText = order.balance > 0 ? `Pending balance: ₹${this.fmtMoney(order.balance)}. ` : '';

    if (templateType === 'ready') {
      return `Hello ${order.customer}, your order ${order.token} (${garments}) at ${shopName} is READY for trial/delivery. ${balText}Please collect it at your convenience. Thank you!`;
    } else if (templateType === 'due') {
      return `Hello ${order.customer}, this is a gentle reminder from ${shopName} for order ${order.token} (${garments}). Pending balance: ₹${this.fmtMoney(order.balance)}. Delivery date: ${order.delivery_date}. Thank you!`;
    } else {
      return `Hello ${order.customer}, your tailoring order ${order.token} (${garments}) has been successfully booked at ${shopName}. Promised delivery date: ${order.delivery_date}. Total: ₹${this.fmtMoney(order.total)}, Advance paid: ₹${this.fmtMoney(order.advance)}, Balance: ₹${this.fmtMoney(order.balance)}. Thank you for choosing us!`;
    }
  },

  // Open WhatsApp Web / Mobile
  openWhatsApp(phone, messageText) {
    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  }
};



/* === js/views/login.js === */
/* ==========================================================================
   7 ART TAILORS - ATELIER AUTHENTICATION & LOGIN VIEW
   Professional Manual Sign-In for Authority, Manager, and Employees
   ========================================================================== */

window.LoginView = {
  render(container) {
    const existing = document.getElementById('loginScreenWrap');
    if (!existing || !container.contains(existing)) {
      container.innerHTML = `
        <div class="login-screen-wrap" id="loginScreenWrap">
          <div class="login-card">
            
            <div class="login-logo">
              <div class="login-emblem">✂️</div>
              <div class="login-title">7 Art Tailors</div>
              <div class="login-subtitle">STUDIO LEDGER · BESPOKE ATELIER</div>
            </div>

            <div id="loginAlertBox" style="display: none; background: var(--red-light); color: var(--red); border: 1px solid rgba(179,64,46,0.25); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; font-weight: 500;">
            </div>

            <form id="studioLoginForm" onsubmit="event.preventDefault(); if(window.LoginView) window.LoginView.handleFormSubmit(event); return false;" autocomplete="off" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="loginUsername">Staff ID / Username</label>
                <input type="text" id="loginUsername" name="usr_studio_clean" class="form-input" placeholder="Enter your ID (e.g. bhagirath)" required autocomplete="off" autocapitalize="none" spellcheck="false" value="" style="font-size: 16px;">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <label class="form-label" for="loginPassword">Password</label>
                  <button type="button" id="togglePasswordBtn" style="background: none; border: none; font-size: 12px; color: var(--rust); cursor: pointer; font-weight: 600; padding: 2px 4px;">
                    Show
                  </button>
                </div>
                <input type="password" id="loginPassword" name="pwd_studio_clean" class="form-input" placeholder="Enter your password" required autocomplete="new-password" value="" style="font-size: 16px;">
              </div>

              <button type="submit" id="loginSubmitBtn" onclick="event.preventDefault(); if(window.LoginView) window.LoginView.handleFormSubmit(event); return false;" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 13px; font-size: 15px; font-weight: 700; margin-top: 4px;">
                <span>🔑</span> Sign In
              </button>
            </form>

            <div style="text-align: center; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border-light); padding-top: 14px; line-height: 1.5;">
              <span>Please enter the ID and Password assigned to you by the studio owner (Bhagirath Saini).</span>
            </div>

            <div style="text-align: center; margin-top: 10px;">
              <button type="button" id="backendToggleBtn" style="background: none; border: none; font-size: 11px; color: var(--rust); cursor: pointer; text-decoration: underline; opacity: 0.85;">
                ⚙️ Server Connection Settings
              </button>
            </div>

            <div id="backendConfigPanel" style="display: none; margin-top: 12px; padding: 12px; background: #FFF9F7; border: 1px solid rgba(156,69,41,0.2); border-radius: var(--radius-sm); font-size: 12px; text-align: left;">
              <label style="display: block; font-weight: 600; margin-bottom: 4px; color: var(--text);">Cloud / Server URL</label>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="backendUrlInput" class="form-input" style="font-size: 12px; padding: 6px 8px; flex: 1;" placeholder="e.g. https://your-app.onrender.com">
                <button type="button" id="saveBackendUrlBtn" class="btn btn-secondary" style="padding: 6px 10px; font-size: 11px; font-weight: 600;">Save</button>
              </div>
              <p style="margin: 6px 0 0; font-size: 11px; color: var(--muted);">Leave blank for default server connection. Set custom URL only if connecting to remote cloud server.</p>
            </div>

          </div>
        </div>
      `;
    }

    this.bindEvents();

    // Ensure inputs start completely blank
    setTimeout(() => {
      const u = document.getElementById('loginUsername');
      const p = document.getElementById('loginPassword');
      if (u) u.value = '';
      if (p) p.value = '';
    }, 60);
  },

  handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const u = document.getElementById('loginUsername');
    const p = document.getElementById('loginPassword');
    const username = (u ? u.value : '').trim();
    const password = (p ? p.value : '').trim();
    if (!username || !password) {
      const alertBox = document.getElementById('loginAlertBox');
      if (alertBox) {
        alertBox.innerText = '⚠️ Please enter both Staff ID and Password';
        alertBox.style.display = 'block';
      }
      return false;
    }
    this.handleLogin(username, password);
    return false;
  },

  bindEvents() {
    const form = document.getElementById('studioLoginForm');
    const pwdInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('togglePasswordBtn');

    if (toggleBtn && pwdInput) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        if (pwdInput.type === 'password') {
          pwdInput.type = 'text';
          toggleBtn.innerText = 'Hide';
        } else {
          pwdInput.type = 'password';
          toggleBtn.innerText = 'Show';
        }
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        return this.handleFormSubmit(e);
      };
    }

    const toggleBackendBtn = document.getElementById('backendToggleBtn');
    const backendPanel = document.getElementById('backendConfigPanel');
    const backendInput = document.getElementById('backendUrlInput');
    const saveBackendBtn = document.getElementById('saveBackendUrlBtn');

    if (toggleBackendBtn && backendPanel && backendInput) {
      const cur = localStorage.getItem('7art_backend_url') || '';
      backendInput.value = cur;
      toggleBackendBtn.onclick = (e) => {
        e.preventDefault();
        backendPanel.style.display = backendPanel.style.display === 'none' ? 'block' : 'none';
      };
      if (saveBackendBtn) {
        saveBackendBtn.onclick = (e) => {
          e.preventDefault();
          const val = backendInput.value.trim();
          API.setBackendUrl(val);
          if (window.App && window.App.showToast) {
            window.App.showToast(val ? `Backend server set to: ${val}` : 'Backend reset to default origin', 'success');
          }
          backendPanel.style.display = 'none';
        };
      }
    }
  },

  async handleLogin(username, password) {
    const alertBox = document.getElementById('loginAlertBox');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (alertBox) alertBox.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Verifying...';
    }

    try {
      const res = await API.login(username, password);
      if (res && res.success && res.user) {
        App.onLoginSuccess(res.user);
      } else {
        throw new Error('Login failed. Please verify credentials.');
      }
    } catch (err) {
      if (alertBox) {
        alertBox.innerText = `⚠️ ${err.message || 'Invalid ID or password'}`;
        alertBox.style.display = 'block';
      }
      if (err.message && (err.message.includes('404') || err.message.includes('Backend server') || err.message.includes('Server response error'))) {
        const bp = document.getElementById('backendConfigPanel');
        if (bp) bp.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🔑</span> Sign In';
      }
    }
  }
};


/* === js/views/my_work.js === */
/* ==========================================================================
   7 ART TAILORS - EMPLOYEE WORKER PORTAL VIEW
   Dedicated Mobile-Optimized Workspace for Cutting Masters & Sewing Tailors
   ========================================================================== */

window.MyWorkView = {
  currentTab: 'pending',
  portalData: null,

  async render(container) {
    const user = App.currentUser;
    const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
    const userRole = user?.role || 'employee';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Craftsman Header Banner -->
        <div style="background: linear-gradient(135deg, #1F1A17 0%, #352B25 100%); color: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span class="role-badge role-badge-employee">✂️ EMPLOYEE PORTAL</span>
              <span style="font-size: 12px; opacity: 0.8; font-family: var(--font-mono);">Live Workshop Bench</span>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: #FAF8F5;">
              ${workerName.toUpperCase()}
            </h2>
            <p style="font-size: 13px; color: #D1C7BD;">
              Real-time assigned cutting & stitching pieces. Tap to mark work completed as you craft.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="MyWorkView.refresh()" style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25);">
              <span>🔄</span> Refresh Work
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.logout()" style="background: rgba(179,64,46,0.2); color: #FFB4AB; border: 1px solid rgba(179,64,46,0.4);">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div id="portalMetricsGrid" class="metrics-grid">
          <div class="metric-card"><div class="metric-label">Loading stats...</div></div>
        </div>

        <!-- Tab Controls & Filter -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm ${this.currentTab === 'pending' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('pending')">
              <span>⏳</span> Pending Bench Work (<span id="pendingCountBadge">0</span>)
            </button>
            <button class="btn btn-sm ${this.currentTab === 'done' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('done')">
              <span>✓</span> Completed Work (<span id="doneCountBadge">0</span>)
            </button>
            <button class="btn btn-sm ${this.currentTab === 'rates' ? 'btn-primary' : 'btn-secondary'}" onclick="MyWorkView.setTab('rates')">
              <span>💰</span> Rate Card
            </button>
          </div>
          <div style="font-size: 12px; color: var(--muted);">
            💡 Changes sync immediately to Counter & Owner
          </div>
        </div>

        <!-- Piece Content Area -->
        <div id="portalContentArea">
          <div style="text-align: center; padding: 40px; color: var(--muted);">Loading assigned pieces...</div>
        </div>

      </div>
    `;

    await this.fetchData(workerName);
  },

  async fetchData(workerName) {
    try {
      this.portalData = await API.getWorkerPortalData(workerName);
      this.renderMetrics();
      this.renderContent();
    } catch (err) {
      console.error("Worker portal fetch error:", err);
      const area = document.getElementById('portalContentArea');
      if (area) {
        area.innerHTML = `
          <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center;">
            <p style="color: var(--muted);">No active piece assignments found under name <strong>${workerName}</strong>.</p>
            <p style="font-size: 12px; color: var(--muted); margin-top: 8px;">Make sure orders have been assigned to you at the counter or in the Orders Pipeline.</p>
          </div>
        `;
      }
    }
  },

  renderMetrics() {
    const d = this.portalData;
    if (!d) return;

    const grid = document.getElementById('portalMetricsGrid');
    const pBadge = document.getElementById('pendingCountBadge');
    const dBadge = document.getElementById('doneCountBadge');

    if (pBadge) pBadge.innerText = d.pending_count || 0;
    if (dBadge) dBadge.innerText = d.done_count || 0;

    if (grid) {
      grid.innerHTML = `
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">Assigned Work</span>
            <span class="metric-icon">📋</span>
          </div>
          <div class="metric-value">${d.total_assigned}</div>
          <div class="metric-subtext">Total garment pieces</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--gold);">
          <div class="metric-header">
            <span class="metric-label">Pending Craft</span>
            <span class="metric-icon">⏱️</span>
          </div>
          <div class="metric-value" style="color: var(--gold);">${d.pending_count}</div>
          <div class="metric-subtext">Awaiting your touch</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--green);">
          <div class="metric-header">
            <span class="metric-label">Completed Pieces</span>
            <span class="metric-icon">✓</span>
          </div>
          <div class="metric-value" style="color: var(--green);">${d.done_count}</div>
          <div class="metric-subtext">Ready for trial / next step</div>
        </div>

        <div class="metric-card" style="border-left: 4px solid var(--rust);">
          <div class="metric-header">
            <span class="metric-label">Earned Piece Work</span>
            <span class="metric-icon">₹</span>
          </div>
          <div class="metric-value" style="color: var(--rust);">₹${Math.round(d.earnings_est).toLocaleString('en-IN')}</div>
          <div class="metric-subtext">Based on your rate sheet</div>
        </div>
      `;
    }
  },

  setTab(tab) {
    this.currentTab = tab;
    // Re-render button active states
    document.querySelectorAll('#portalContentArea').forEach(() => {});
    const container = document.getElementById('viewport');
    if (container) {
      this.render(container);
    }
  },

  async refresh() {
    const user = App.currentUser;
    const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
    App.showToast('Refreshing assignments...', 'info');
    await this.fetchData(workerName);
  },

  renderContent() {
    const area = document.getElementById('portalContentArea');
    if (!area || !this.portalData) return;

    if (this.currentTab === 'rates') {
      this.renderRateSheet(area);
      return;
    }

    const pieces = (this.portalData.pieces || []).filter(p => {
      if (this.currentTab === 'pending') return !p.is_done;
      if (this.currentTab === 'done') return p.is_done;
      return true;
    });

    if (pieces.length === 0) {
      area.innerHTML = `
        <div style="background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-md); padding: 48px 24px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">${this.currentTab === 'pending' ? '🎉' : '📂'}</div>
          <h3 style="font-family: var(--font-serif); font-size: 18px; margin-bottom: 4px;">
            ${this.currentTab === 'pending' ? 'All caught up! No pending pieces.' : 'No completed pieces yet.'}
          </h3>
          <p style="font-size: 13px; color: var(--muted);">
            ${this.currentTab === 'pending' ? 'Great work! Take a break or check upcoming orders.' : 'Mark your pieces completed as you finish them.'}
          </p>
        </div>
      `;
      return;
    }

    area.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${pieces.map(p => `
          <div class="portal-piece-row ${p.is_done ? 'is-done' : ''}">
            
            <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
              <div style="text-align: center; min-width: 80px;">
                <span class="token-pill" style="font-size: 13px;">${p.token}</span>
                ${p.urgent ? '<div style="margin-top: 4px;"><span class="badge badge-urgent" style="font-size: 9px; padding: 2px 5px;">⚡ Express</span></div>' : ''}
              </div>

              <div>
                <div style="font-weight: 700; font-size: 15px; color: var(--ink);">
                  ${p.garment} <span style="font-size: 12px; font-weight: normal; color: var(--muted);">(Piece #${p.piece_n})</span>
                </div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                  Client: <strong>${p.customer}</strong> · Due: <strong>${p.delivery_date}</strong>
                </div>
                <div style="font-size: 11px; margin-top: 4px; display: flex; gap: 8px; align-items: center;">
                  <span class="badge ${p.worker_role === 'cutting' ? 'badge-cutting' : 'badge-stitching'}">
                    ${p.worker_role === 'cutting' ? '✂️ Cutting Master' : '🧵 Sewing Tailor'}
                  </span>
                  <span style="font-family: var(--font-mono); color: var(--rust); font-weight: 700;">
                    ${p.rate > 0 ? `Rate: ₹${p.rate}` : 'Rate: —'}
                  </span>
                  ${p.slip_no ? `<span class="badge badge-ready" style="font-size: 10px;">Settled on ${p.slip_no}</span>` : ''}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              ${!p.is_done ? `
                <button class="btn btn-primary btn-sm" onclick="MyWorkView.markPieceDone('${p.token}', '${p.garment}', ${p.piece_n}, '${p.worker_role}')">
                  <span>✓</span> Mark ${p.worker_role === 'cutting' ? 'Cut Done' : 'Stitched Done'}
                </button>
              ` : `
                <span class="badge badge-delivered" style="font-size: 12px; padding: 6px 12px;">
                  ✓ Piece Completed
                </span>
                <button class="btn btn-secondary btn-sm" title="Undo completed status if marked by accident" onclick="MyWorkView.undoPieceDone('${p.token}', '${p.garment}', ${p.piece_n}, '${p.worker_role}')" style="font-size: 11px; padding: 4px 8px;">
                  Undo
                </button>
              `}
            </div>

          </div>
        `).join('')}
      </div>
    `;
  },

  renderRateSheet(area) {
    const rates = this.portalData?.rates || {};
    const keys = Object.keys(rates);

    if (keys.length === 0) {
      area.innerHTML = `
        <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center;">
          <p style="color: var(--muted);">No custom rate list configured for your profile yet.</p>
          <p style="font-size: 12px; color: var(--muted); margin-top: 6px;">The Authority owner can configure your rates under Personnel & Team Manage.</p>
        </div>
      `;
      return;
    }

    area.innerHTML = `
      <div class="portal-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h3 style="font-family: var(--font-serif); font-size: 18px;">My Personal Piece Work Rates</h3>
          <span style="font-size: 12px; color: var(--muted);">Used automatically for your salary slip calculation</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 8px;">
          ${keys.map(g => `
            <div style="background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: var(--ink);">${g}</span>
              <span style="font-family: var(--font-mono); font-weight: 800; color: var(--rust); font-size: 15px;">₹${rates[g]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async markPieceDone(token, garment, pieceN, workerRole) {
    // 1. Optimistic UI update: instantly update DOM on client side before network roundtrip
    const pieces = this.portalData?.pieces || [];
    const target = pieces.find(p => String(p.token) === String(token) && p.garment === garment && Number(p.piece_n) === Number(pieceN));
    const prevDone = target ? target.is_done : false;

    if (target) {
      target.is_done = true;
      if (this.portalData.pending_count > 0) this.portalData.pending_count--;
      this.portalData.done_count = (this.portalData.done_count || 0) + 1;
      this.renderMetrics();
      this.renderContent();
    }

    try {
      await API.updateWorkerPiece(token, garment, pieceN, workerRole, true);
      App.showToast(`Piece marked complete for Token ${token}!`, 'success');
      // Silently refresh in background to ensure database synchronization
      const user = App.currentUser;
      const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
      this.fetchData(workerName).catch(() => {});
    } catch (err) {
      // Rollback on network failure
      if (target) {
        target.is_done = prevDone;
        this.portalData.pending_count = (this.portalData.pending_count || 0) + 1;
        if (this.portalData.done_count > 0) this.portalData.done_count--;
        this.renderMetrics();
        this.renderContent();
      }
      App.showToast(err.message || 'Failed to update piece (network issue)', 'error');
    }
  },

  async undoPieceDone(token, garment, pieceN, workerRole) {
    // 1. Optimistic UI update
    const pieces = this.portalData?.pieces || [];
    const target = pieces.find(p => String(p.token) === String(token) && p.garment === garment && Number(p.piece_n) === Number(pieceN));
    const prevDone = target ? target.is_done : true;

    if (target) {
      target.is_done = false;
      this.portalData.pending_count = (this.portalData.pending_count || 0) + 1;
      if (this.portalData.done_count > 0) this.portalData.done_count--;
      this.renderMetrics();
      this.renderContent();
    }

    try {
      await API.updateWorkerPiece(token, garment, pieceN, workerRole, false);
      App.showToast(`Piece marked pending for Token ${token}`, 'info');
      const user = App.currentUser;
      const workerName = user?.staff_name || user?.full_name || user?.username || 'Craftsman';
      this.fetchData(workerName).catch(() => {});
    } catch (err) {
      // Rollback on network failure
      if (target) {
        target.is_done = prevDone;
        if (this.portalData.pending_count > 0) this.portalData.pending_count--;
        this.portalData.done_count = (this.portalData.done_count || 0) + 1;
        this.renderMetrics();
        this.renderContent();
      }
      App.showToast(err.message || 'Failed to undo piece (network issue)', 'error');
    }
  }
};



/* === js/views/dashboard.js === */
/* ==========================================================================
   7 ART TAILORS - DASHBOARD VIEW
   ========================================================================== */

const DashboardView = {
  currentPeriod: 'All orders',
  data: null,

  getTimeGreeting(ownerName = "BHAGIRATH SAINI") {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17) {
      timeGreeting = "Good evening";
    }
    return `${timeGreeting}, ${ownerName}`;
  },

  async render(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 250px;">
        <div style="text-align: center; color: var(--muted);">
          <div style="font-size: 24px; animation: spin 1s infinite linear;">✂️</div>
          <div style="margin-top: 8px; font-weight: 600;">Loading atelier dashboard...</div>
        </div>
      </div>
    `;

    try {
      this.data = await API.getDashboard(this.currentPeriod);
      const settings = window.App?.settings || {};
      const ownerName = settings.owner_name || "BHAGIRATH SAINI";
      const greeting = this.getTimeGreeting(ownerName);

      const periods = [
        "Last 7 days", "Last 15 days", "Last 30 days",
        "Last 2 months", "Last 3 months", "Last 6 months", "Last 1 year",
        "All orders"
      ];

      container.innerHTML = `
        <!-- Top Greeting and Filter Bar -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 26px;">
          <div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">ATELIER OVERVIEW</div>
            <h1 style="font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--ink); margin-top: 2px;">
              ${greeting}
            </h1>
            <p style="color: var(--muted); font-size: 13px;">Here is the production status across your cutting tables and sewing units.</p>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 12px; font-weight: 600; color: var(--muted);">Period Filter:</span>
            <select id="dashPeriodSelect" class="form-select" style="width: auto; padding: 7px 12px; font-weight: 600; background-color: var(--card);">
              ${periods.map(p => `<option value="${p}" ${p === this.currentPeriod ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
            <button id="dashNewOrderBtn" class="btn btn-primary" style="padding: 8px 16px;">
              <span>✂️</span> + New Order
            </button>
          </div>
        </div>

        <!-- 4 Summary Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 30px;">
          <!-- Card 1: In Progress -->
          <div class="card" style="border-left: 4px solid var(--status-stitching); cursor: pointer;" onclick="window.App.navigate('orders', {status: 'In Progress'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">IN PRODUCTION</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.in_progress.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--crimson); font-weight: 600;">Cutting & Stitching Active</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--rust-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                🧵
              </div>
            </div>
          </div>

          <!-- Card 2: Due This Week -->
          <div class="card" style="border-left: 4px solid var(--rust); cursor: pointer;" onclick="window.App.navigate('orders', {filter: 'due_week'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">DUE THIS WEEK</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.due_this_week.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--rust); font-weight: 600;">Upcoming Deliveries</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--rust-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                📅
              </div>
            </div>
          </div>

          <!-- Card 3: Ready for Pickup -->
          <div class="card" style="border-left: 4px solid var(--green); cursor: pointer;" onclick="window.App.navigate('orders', {status: 'Ready for Trial/Delivery'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">READY FOR PICKUP</div>
                <div style="font-family: var(--font-serif); font-size: 34px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ${this.data.ready_pickup.toLocaleString()}
                </div>
                <div style="font-size: 12px; color: var(--green); font-weight: 600;">Finished & Awaiting Client</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--green-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                ✨
              </div>
            </div>
          </div>

          <!-- Card 4: Outstanding Balances -->
          <div class="card" style="border-left: 4px solid var(--gold); cursor: pointer;" onclick="window.App.navigate('orders', {filter: 'has_balance'})">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px;">PENDING BALANCES</div>
                <div style="font-family: var(--font-serif); font-size: 30px; font-weight: 800; color: var(--ink); margin: 4px 0 2px;">
                  ₹${PrintEngine.fmtMoney(this.data.outstanding_total)}
                </div>
                <div style="font-size: 12px; color: var(--gold); font-weight: 600;">${this.data.outstanding_count} Client(s) with Balance</div>
              </div>
              <div style="width: 44px; height: 44px; background: var(--gold-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                💰
              </div>
            </div>
          </div>
        </div>

        <!-- 2 Columns: Upcoming Deliveries & Outstanding Balances -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">
          
          <!-- Column 1: Upcoming Deliveries List -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Upcoming Deliveries</h3>
                <p class="card-subtitle">Orders scheduled for completion and client trial</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('orders')">View All</button>
            </div>

            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Promised</th>
                    <th>Status</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${(this.data.upcoming_deliveries || []).length === 0 ? `
                    <tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">No upcoming deliveries in this period.</td></tr>
                  ` : (this.data.upcoming_deliveries || []).map(o => `
                    <tr>
                      <td>
                        <strong>${o.token}</strong>
                        ${o.urgent ? '<span class="badge badge-urgent" style="font-size: 9px; margin-left: 4px;">URGENT</span>' : ''}
                      </td>
                      <td>
                        <div style="font-weight: 600;">${o.customer}</div>
                        <div style="font-size: 11px; color: var(--muted);">${o.phone}</div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: ${o.is_overdue ? 'var(--red)' : 'var(--ink)'};">
                          ${o.delivery_date}
                        </div>
                        ${o.is_overdue ? '<span style="font-size: 10px; color: var(--red); font-weight: 700;">Overdue</span>' : ''}
                      </td>
                      <td>
                        <span class="badge badge-status-${this.getStatusClass(o.status)}">${o.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
                        <button class="btn btn-green btn-sm" title="WhatsApp Customer" onclick="window.App.quickWhatsApp('${o.token}')">💬</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Column 2: Outstanding Balances List -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Outstanding Client Balances</h3>
                <p class="card-subtitle">Pending collections from delivered or ready orders</p>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="window.App.navigate('customers')">Customer Ledger</button>
            </div>

            <div class="table-responsive">
              <table class="table-custom">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Token</th>
                    <th>Due Date</th>
                    <th>Balance Due</th>
                    <th style="text-align: right;">Settle</th>
                  </tr>
                </thead>
                <tbody>
                  ${(this.data.outstanding_balances || []).length === 0 ? `
                    <tr><td colspan="5" style="text-align: center; color: var(--muted); padding: 24px;">No outstanding client balances!</td></tr>
                  ` : (this.data.outstanding_balances || []).map(o => `
                    <tr>
                      <td>
                        <div style="font-weight: 600;">${o.customer}</div>
                        <div style="font-size: 11px; color: var(--muted);">${o.phone}</div>
                      </td>
                      <td><strong>${o.token}</strong></td>
                      <td>${o.delivery_date}</td>
                      <td>
                        <span style="font-weight: 700; color: var(--red); font-size: 14px;">₹${PrintEngine.fmtMoney(o.balance)}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-secondary btn-sm" onclick="window.App.openSettleModal('${o.token}')">
                          Collect
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;

      // Event Listeners
      document.getElementById('dashPeriodSelect').addEventListener('change', (e) => {
        this.currentPeriod = e.target.value;
        this.render(container);
      });

      document.getElementById('dashNewOrderBtn').addEventListener('click', () => {
        window.App.navigate('booking');
      });

    } catch (err) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px; color: var(--red);">
          <h3>Error loading dashboard</h3>
          <p style="margin-top: 8px;">${err.message}</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="DashboardView.render(document.getElementById('viewport'))">Retry</button>
        </div>
      `;
    }
  },

  getStatusClass(status) {
    if (status === 'Cutting Pending') return 'cutting-pending';
    if (status === 'Cutting In-Process') return 'cutting-process';
    if (status === 'Stitching In-Progress') return 'stitching';
    if (status === 'Ready for Trial/Delivery') return 'ready';
    return 'delivered';
  }
};



/* === js/views/booking.js === */
/* ==========================================================================
   7 ART TAILORS - NEW ORDER BOOKING VIEW (COUNTER)
   ========================================================================== */

const BookingView = {
  tokenData: null,
  isUrgent: false,
  selectedGarments: {}, // { "Suit / Blazer": { qty: 1, rate: 3500 }, ... }
  measurements: {},     // { "Suit / Blazer": { _flow: "...", "Coat Length": "29.5", ... } }
  garmentNotes: {},     // { "Suit / Blazer": "Lining note..." }
  garmentStaff: {},     // { "Suit / Blazer": { cut: "Aman", sew: "Ramesh" } }
  availableStaff: { cutting: [], sewing: [] },
  catalog: {},

  async initData() {
    this.tokenData = await API.getNextToken();
    const staffList = await API.listStaff(null, true); // available only
    this.availableStaff.cutting = staffList.filter(s => s.role === 'cutting');
    this.availableStaff.sewing = staffList.filter(s => s.role === 'sewing');
    
    const settings = window.App?.settings || await API.getSettings();
    this.catalog = settings.garments || {
      "Kurta / Pajama": { rate: 800, fields: "Kurta Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pajama Length;Pajama Waist;Bottom" },
      "Shirt & Pant": { rate: 900, fields: "Shirt Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip;Thigh;Bottom" },
      "Suit / Blazer": { rate: 3500, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Pant Length;Pant Waist;Thigh" },
      "Sherwani": { rate: 5000, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip;Churidar Length;Churidar Waist" },
      "Safari Suit": { rate: 1800, fields: "Coat Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist;Hip" },
      "Sadri": { rate: 700, fields: "Length;Chest;Waist;Shoulder;Neck" },
      "Blouse & Lehenga": { rate: 1500, fields: "Blouse Length;Bust;Waist;Shoulder;Sleeve;Front Neck;Back Neck;Lehenga Length;Lehenga Waist;Hip" },
      "Uniform": { rate: 800, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Pant Length;Pant Waist" },
      "Custom": { rate: 500, fields: "Length;Chest;Waist;Shoulder;Sleeve;Neck;Hip" },
      "kot": { rate: 1500, fields: "measurement" },
      "chaddi": { rate: 150, fields: "measurement" }
    };
  },

  toIsoDate(d) {
    if (!d) return '';
    if (d instanceof Date) {
      const yr = d.getFullYear();
      const mon = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${yr}-${mon}-${day}`;
    }
    const s = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parts = s.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  },

  formatDisplayDate(val) {
    if (!val) return '';
    const iso = this.toIsoDate(val);
    if (!iso) return String(val);
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  },

  async render(container) {
    await this.initData();

    // Default dates
    const today = new Date();
    const defaultDelivery = new Date(today);
    defaultDelivery.setDate(defaultDelivery.getDate() + 7);

    container.innerHTML = `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <!-- Header & Active Token Box -->
        <div class="card" style="margin-bottom: 22px; background: linear-gradient(to right, #FFFFFF, var(--card-warm));">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">NEW BESPOKE ORDER</div>
              <h2 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Counter Booking Slip</h2>
              <p style="font-size: 13px; color: var(--muted);">Record craft measurements, piece allocations, and customer advance deposit.</p>
            </div>

            <!-- Active Token Generator & Urgent Toggle -->
            <div style="display: flex; align-items: center; gap: 20px; background: var(--paper); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 12px 20px;">
              <div>
                <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 1px;">ACTIVE TOKEN</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="text" id="orderTokenInput" value="${this.tokenData.token}" 
                         style="font-family: var(--font-serif); font-size: 24px; font-weight: 800; color: var(--ink); width: 140px; border: none; background: transparent; outline: none;">
                  <button id="refreshTokenBtn" class="btn btn-ghost btn-sm" title="Next Token">🔄</button>
                </div>
              </div>

              <div style="height: 40px; width: 1px; background: var(--border);"></div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <label class="toggle-switch">
                  <input type="checkbox" id="urgentToggle">
                  <span class="toggle-slider toggle-urgent"></span>
                </label>
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: var(--red);">EXPRESS URGENT</div>
                  <div style="font-size: 10px; color: var(--muted);">Priority Workshop Routing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form id="orderBookingForm" onsubmit="event.preventDefault(); return false;">
          <!-- Step 1: Client Information & Delivery Dates -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <h3 class="card-title">1. Customer Details & Delivery Commitment</h3>
              <span class="badge" style="background: var(--sidebar);">CLIENT INFO</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label" for="custPhone">Phone Number *</label>
                <div class="input-addon-group">
                  <span class="input-addon-left">📞 +91</span>
                  <input type="tel" id="custPhone" class="form-input" placeholder="10-digit mobile" required maxlength="10">
                </div>
                <span id="custSuggestBadge" style="display: none; font-size: 11px; color: var(--green); font-weight: 600; margin-top: 2px;"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="custName">Customer Full Name *</label>
                <input type="text" id="custName" class="form-input" placeholder="e.g. Ramesh Sharma" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="orderDate">Order Booking Date</label>
                <input type="date" id="orderDate" class="form-input" value="${this.toIsoDate(today)}" required style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 12px; cursor: pointer; background: #fff;">
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                  <label class="form-label" for="deliveryDate" style="margin-bottom: 0;">Promised Delivery Date *</label>
                  <span id="deliveryDateBadge" style="font-size: 11px; color: var(--rust); font-weight: 700;">+7 Days Standard</span>
                </div>
                <input type="date" id="deliveryDate" class="form-input" value="${this.toIsoDate(defaultDelivery)}" required style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 12px; cursor: pointer; background: #fff;" onchange="BookingView.onDeliveryDateChange()">
                <div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(7)">+7 Days</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(10)">+10 Days</button>
                  <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; min-width: 65px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center;" onclick="BookingView.addDaysToDelivery(14)">+14 Days</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Interactive Garment Selection Grid -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">2. Garment Selection & Quantities</h3>
                <p class="card-subtitle">Select garments to dynamically configure tailored measurement fields and rates</p>
              </div>
              <div id="garmentCountBadge" class="badge" style="background: var(--rust-light); color: var(--rust); font-weight: 700;">
                0 Garment(s) Selected
              </div>
            </div>

            <div class="garments-grid" id="garmentsGrid">
              ${Object.entries(this.catalog).map(([name, info]) => `
                <div class="garment-card" id="card_${name.replace(/[^a-zA-Z0-9]/g, '_')}" onclick="BookingView.toggleGarment('${name}', event)">
                  <div class="garment-card-top">
                    <div>
                      <div class="garment-title">${name}</div>
                      <div class="garment-rate">₹${PrintEngine.fmtMoney(info.rate)}</div>
                    </div>
                    <span style="font-size: 20px;">${BookingView.getGarmentIcon(name)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="font-size: 11px; color: var(--muted); font-weight: 600;">Quantity:</span>
                    <div class="garment-counter" onclick="event.stopPropagation()">
                      <button type="button" class="counter-btn" onclick="BookingView.updateQty('${name}', -1)">-</button>
                      <span class="counter-display" id="qty_${name.replace(/[^a-zA-Z0-9]/g, '_')}">0</span>
                      <button type="button" class="counter-btn" onclick="BookingView.updateQty('${name}', 1)">+</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 3: Craft Measurements, Garment Styling & Staff Assignment -->
          <div class="card" style="margin-bottom: 22px;" id="measCardSection">
            <div class="card-header">
              <div>
                <h3 class="card-title">3. Craft Measurements, Garment Styling &amp; Staff Assignment</h3>
                <p class="card-subtitle">Full-flow rapid tape column, detailed parameters, custom styling notes, and assigned masters per garment</p>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="BookingView.clearMeasurements()">Clear All</button>
            </div>

            <div id="measurementsContainer" class="measurements-container">
              <div style="text-align: center; color: var(--muted); padding: 24px; border: 1.5px dashed var(--border); border-radius: var(--radius-md);">
                👉 Select one or more garments above to enter craft measurements, styling notes, and staff assignments.
              </div>
            </div>
          </div>

          <!-- Step 4: General Order Remarks & Quick Staff Shortcuts -->
          <div class="card" style="margin-bottom: 22px;">
            <div class="card-header">
              <h3 class="card-title">4. General Order Remarks &amp; Quick Batch Assignment</h3>
              <span class="badge" style="background: var(--sidebar);">WORKSHOP</span>
            </div>

            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px;">
              <!-- General Order Remarks -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="tailoringNotes">General Order &amp; Delivery Instructions</label>
                <textarea id="tailoringNotes" class="form-textarea" placeholder="Overall delivery instructions, VIP client remarks, fabric handling notes... (Per-garment styling notes can be written above directly in each garment)" style="height: 100px;"></textarea>
              </div>

              <!-- Quick Batch Assignment Shortcuts -->
              <div style="background: var(--card-warm); padding: 14px 16px; border-radius: var(--radius-md); border: 1.5px solid var(--border); display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 11.5px; font-weight: 800; color: var(--crimson); text-transform: uppercase; letter-spacing: 0.5px;">
                  ⚡ Quick Apply to ALL Garments
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Set Same Cutting Master for All</label>
                  <select id="quickAssignCut" class="form-select" style="font-size: 12px; height: 34px;" onchange="BookingView.applyStaffToAll('cut', this.value)">
                    <option value="">— Select to apply to all —</option>
                    ${this.availableStaff.cutting.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 11px; margin-bottom: 4px;">Set Same Sewing Tailor for All</label>
                  <select id="quickAssignSew" class="form-select" style="font-size: 12px; height: 34px;" onchange="BookingView.applyStaffToAll('sew', this.value)">
                    <option value="">— Select to apply to all —</option>
                    ${this.availableStaff.sewing.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Billing & Advance Calculation -->
          <div class="card" style="margin-bottom: 26px; background: var(--card-warm); border: 2px solid var(--border);">
            <div class="card-header">
              <h3 class="card-title">5. Billing, Advance Deposit & Balance</h3>
              <span class="badge" style="background: var(--gold-light); color: var(--gold); font-weight: 700;">PAYMENT</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; align-items: end;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="totalAmountInput">Total Tailoring Bill (₹)</label>
                <input type="number" id="totalAmountInput" class="form-input" style="font-size: 18px; font-weight: 700;" value="0" step="any" min="0">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="advancePaidInput">Advance Paid (₹)</label>
                <input type="number" id="advancePaidInput" class="form-input" style="font-size: 18px; font-weight: 700; color: var(--green);" value="0" step="any" min="0">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Auto-Calculated Balance (₹)</label>
                <div id="balanceDueDisplay" style="padding: 9px 14px; background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 18px; font-weight: 800; color: var(--red);">
                  ₹0.00
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="payModeSelect">Payment Mode</label>
                <select id="payModeSelect" class="form-select" style="font-weight: 600;">
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Pending">Pending / Later</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; padding-bottom: 40px;">
            <button type="button" class="btn btn-secondary" onclick="BookingView.resetForm()">
              <span>🔄</span> Reset Form
            </button>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn btn-green" onclick="BookingView.handleSaveOrder('whatsapp')">
                <span>💬</span> Save & WhatsApp Slip
              </button>
              <button type="button" class="btn btn-dark" onclick="BookingView.handleSaveOrder('print')">
                <span>🖨️</span> Save & Print Job Slip
              </button>
              <button type="submit" class="btn btn-primary btn-lg">
                <span>✔</span> Confirm & Book Order
              </button>
            </div>
          </div>
        </form>

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Phone auto lookup with 250ms debounce
    const phoneInput = document.getElementById('custPhone');
    let phoneDebounceTimer;
    phoneInput.addEventListener('input', (e) => {
      clearTimeout(phoneDebounceTimer);
      const val = e.target.value.trim();
      const badge = document.getElementById('custSuggestBadge');
      if (val.length === 10) {
        phoneDebounceTimer = setTimeout(async () => {
          try {
            const res = await API.getCustomerOrders(val);
            if (res.orders && res.orders.length > 0) {
              const last = res.orders[0];
              document.getElementById('custName').value = last.customer;
              badge.innerText = `✔ Found existing customer (${res.orders.length} past orders)`;
              badge.style.display = 'block';
            } else {
              badge.style.display = 'none';
            }
          } catch (_) {
            badge.style.display = 'none';
          }
        }, 250);
      } else {
        badge.style.display = 'none';
      }
    });

    // Refresh token
    document.getElementById('refreshTokenBtn').addEventListener('click', async (e) => {
      e.preventDefault();
      this.tokenData = await API.getNextToken();
      document.getElementById('orderTokenInput').value = this.tokenData.token;
    });

    // Urgent toggle
    document.getElementById('urgentToggle').addEventListener('change', (e) => {
      this.isUrgent = e.target.checked;
    });

    // Total and Advance calculation
    document.getElementById('totalAmountInput').addEventListener('input', () => this.updateBalanceDue());
    document.getElementById('advancePaidInput').addEventListener('input', () => this.updateBalanceDue());

    // Form submit
    document.getElementById('orderBookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveOrder('normal');
    });
  },

  getGarmentIcon(name) {
    if (name.includes('Suit') || name.includes('Blazer')) return '🤵';
    if (name.includes('Sherwani')) return '👑';
    if (name.includes('Shirt')) return '👔';
    if (name.includes('Kurta')) return '🥻';
    if (name.includes('Lehenga') || name.includes('Blouse')) return '👗';
    if (name.includes('Safari')) return '🦺';
    if (name.includes('Uniform')) return '🎖️';
    return '✂️';
  },

  toggleGarment(name, e) {
    const current = this.selectedGarments[name]?.qty || 0;
    this.updateQty(name, current === 0 ? 1 : -current);
  },

  updateQty(name, delta) {
    const current = this.selectedGarments[name]?.qty || 0;
    const next = Math.max(0, current + delta);
    const rate = this.catalog[name]?.rate || 500;

    const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');
    const displayEl = document.getElementById(`qty_${safeId}`);
    const cardEl = document.getElementById(`card_${safeId}`);

    if (next > 0) {
      this.selectedGarments[name] = { qty: next, rate };
      if (displayEl) displayEl.innerText = next;
      if (cardEl) cardEl.classList.add('selected');
      if (!this.measurements[name]) this.measurements[name] = {};
    } else {
      delete this.selectedGarments[name];
      if (displayEl) displayEl.innerText = '0';
      if (cardEl) cardEl.classList.remove('selected');
    }

    // Update garments count badge
    const count = Object.values(this.selectedGarments).reduce((sum, g) => sum + g.qty, 0);
    const countBadge = document.getElementById('garmentCountBadge');
    if (countBadge) countBadge.innerText = `${count} Garment(s) Selected`;

    this.recalculateTotal();
    this.renderMeasurements();
  },

  recalculateTotal() {
    let total = 0;
    Object.values(this.selectedGarments).forEach(g => {
      total += (g.qty || 1) * (g.rate || 0);
    });
    const totalInput = document.getElementById('totalAmountInput');
    if (totalInput) {
      totalInput.value = total;
      this.updateBalanceDue();
    }
  },

  updateBalanceDue() {
    const total = parseFloat(document.getElementById('totalAmountInput')?.value || 0);
    const advance = parseFloat(document.getElementById('advancePaidInput')?.value || 0);
    const balance = Math.max(0, total - advance);

    const balDisplay = document.getElementById('balanceDueDisplay');
    if (balDisplay) {
      balDisplay.innerText = `₹${PrintEngine.fmtMoney(balance)}`;
      balDisplay.style.color = balance === 0 ? 'var(--green)' : 'var(--red)';
    }
  },

  addDaysToDelivery(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yr = d.getFullYear();
    const mon = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const input = document.getElementById('deliveryDate');
    if (input) {
      input.value = `${yr}-${mon}-${day}`;
      const badge = document.getElementById('deliveryDateBadge');
      if (badge) {
        badge.innerText = `+${days} Days (${day}/${mon})`;
      }
    }
  },

  onDeliveryDateChange() {
    const input = document.getElementById('deliveryDate');
    const badge = document.getElementById('deliveryDateBadge');
    if (!input || !badge) return;
    const val = input.value;
    if (!val) {
      badge.innerText = 'Select Date';
      return;
    }
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const chosen = new Date(y, m - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      chosen.setHours(0, 0, 0, 0);
      const diffDays = Math.round((chosen - today) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        badge.innerText = `Today (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      } else if (diffDays > 0) {
        badge.innerText = `+${diffDays} Days (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      } else {
        badge.innerText = `Past Date (${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')})`;
      }
    }
  },

  renderMeasurements() {
    const container = document.getElementById('measurementsContainer');
    if (!container) return;

    const names = Object.keys(this.selectedGarments);
    if (names.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--muted); padding: 24px; border: 1.5px dashed var(--border); border-radius: var(--radius-md);">
          👉 Select one or more garments above to enter craft measurements, styling notes, and staff assignments.
        </div>
      `;
      return;
    }

    container.innerHTML = names.map(name => {
      const info = this.catalog[name] || {};
      const fields = (info.fields || "Length;Chest;Waist;Shoulder;Sleeve").split(';').map(f => f.trim()).filter(Boolean);
      const currMeas = this.measurements[name] || {};
      const safeId = name.replace(/[^a-zA-Z0-9]/g, '_');

      // Determine current flow string
      let flowVal = currMeas._flow !== undefined ? currMeas._flow : '';
      if (!flowVal) {
        const fieldVals = fields.map(f => currMeas[f]).filter(v => v !== undefined && v !== null && v !== '');
        if (fieldVals.length > 0) {
          flowVal = fieldVals.join('  ');
        }
      }

      const garmentNote = this.garmentNotes[name] || '';
      const garmentCut = this.garmentStaff[name]?.cut || '';
      const garmentSew = this.garmentStaff[name]?.sew || '';

      return `
        <div class="meas-garment-box" id="meas_box_${safeId}">
          <!-- Garment Header -->
          <div class="meas-garment-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${this.getGarmentIcon(name)}</span>
              <span style="font-size: 16px; font-weight: 800; color: var(--ink);">${name}</span>
              <span class="badge" style="background: var(--card-rose); color: var(--crimson); font-weight: 700;">
                ${this.selectedGarments[name].qty} piece${this.selectedGarments[name].qty > 1 ? 's' : ''}
              </span>
            </div>
            <button type="button" class="btn btn-ghost btn-xs" style="color: var(--muted); font-size: 11px;" 
                    onclick="BookingView.clearGarmentMeasurements('${name}')">
              Reset ${name}
            </button>
          </div>

          <!-- Single Standard Measurement Typing Box -->
          <div class="form-group" style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
              <label class="form-label" for="flow_meas_${safeId}" style="font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 0;">
                📐 Craft Measurements (${name})
              </label>
              <span style="font-size: 11px; color: var(--muted);">Type in one flow with spaces, commas, numbers or words (leave blank if unmeasured)</span>
            </div>
            <input type="text" 
                   id="flow_meas_${safeId}" 
                   class="form-input" 
                   placeholder="e.g. 14  15  31.50  40.75  30.50 (leave blank or enter tape numbers)" 
                   value="${String(flowVal).replace(/"/g, '&quot;')}"
                   oninput="BookingView.setGarmentMeasurement('${name}', this.value)">
          </div>

          <!-- 3. STYLING NOTES & WORKSHOP STAFF ASSIGNMENT FOR THIS GARMENT -->
          <div class="garment-workshop-grid">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase;">
                ✂️ Styling &amp; Posture Note (${name})
              </label>
              <textarea class="form-textarea garment-note-input" 
                        data-garment="${name}"
                        placeholder="Padding, lining, neck depth, piping, posture or pocket notes for ${name}..." 
                        style="min-height: 48px; height: 50px; font-size: 12px; padding: 6px 10px;"
                        oninput="BookingView.setGarmentNote('${name}', this.value)">${garmentNote}</textarea>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase; margin-bottom: 0;">
                  Cutting Master (${name})
                </label>
                <button type="button" class="btn btn-ghost btn-xs" style="font-size: 10px; color: var(--crimson); font-weight: 700; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px;" 
                        onclick="BookingView.applyStaffToAll('cut', BookingView.garmentStaff['${name}']?.cut || document.querySelector('#meas_box_${safeId} .garment-cut-select')?.value)" title="Apply this cutting master to all selected garments">
                  + Apply Cutter to all
                </button>
              </div>
              <select class="form-select garment-cut-select" 
                      data-garment="${name}" 
                      style="font-size: 12px; height: 38px;"
                      onchange="BookingView.setGarmentStaff('${name}', 'cut', this.value)">
                <option value="">— Unassigned —</option>
                ${this.availableStaff.cutting.map(s => `<option value="${s.name}" ${s.name === garmentCut ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label class="form-label" style="font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase; margin-bottom: 0;">
                  Sewing Tailor (${name})
                </label>
                <button type="button" class="btn btn-ghost btn-xs" style="font-size: 10px; color: var(--crimson); font-weight: 700; padding: 1px 6px; border: 1px solid var(--border); border-radius: 4px;" 
                        onclick="BookingView.applyStaffToAll('sew', BookingView.garmentStaff['${name}']?.sew || document.querySelector('#meas_box_${safeId} .garment-sew-select')?.value)" title="Apply this sewing tailor to all selected garments">
                  + Apply Tailor to all
                </button>
              </div>
              <select class="form-select garment-sew-select" 
                      data-garment="${name}" 
                      style="font-size: 12px; height: 38px;"
                      onchange="BookingView.setGarmentStaff('${name}', 'sew', this.value)">
                <option value="">— Unassigned —</option>
                ${this.availableStaff.sewing.map(s => `<option value="${s.name}" ${s.name === garmentSew ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  setGarmentMeasurement(garment, rawText) {
    if (!this.measurements[garment]) this.measurements[garment] = {};
    const val = (rawText || '').trim();
    this.measurements[garment]._flow = val;

    // Optional convenience: if word tokens were typed and note is empty, reflect in note
    const cleaned = (rawText || '').replace(/[()\[\]{}]/g, ' ');
    const tokens = cleaned.trim().split(/[\s,;]+/).filter(Boolean);
    const wordTokens = tokens.filter(tok => {
      const cleanTok = tok.replace(/["']/g, '');
      return isNaN(parseFloat(cleanTok)) || !isFinite(cleanTok) || !/^[-+]?\d*\.?\d+$/.test(cleanTok);
    });

    if (wordTokens.length > 0 && !this.garmentNotes[garment]) {
      const container = document.getElementById('measurementsContainer');
      const noteInput = container ? container.querySelector(`textarea[data-garment="${garment}"]`) : null;
      if (noteInput && !noteInput.value) {
        noteInput.value = wordTokens.join(' ');
        this.garmentNotes[garment] = noteInput.value;
      }
    }
  },

  onFlowMeasurementInput(garment, rawText) {
    this.setGarmentMeasurement(garment, rawText);
  },

  setIndividualMeasurement(garment, field, value) {
    if (!this.measurements[garment]) this.measurements[garment] = {};
    this.measurements[garment][field] = value;
  },

  setGarmentNote(garment, note) {
    this.garmentNotes[garment] = note;
  },

  setGarmentStaff(garment, role, staffName) {
    if (!this.garmentStaff[garment]) this.garmentStaff[garment] = {};
    this.garmentStaff[garment][role] = staffName;
  },

  applyStaffToAll(role, staffName) {
    if (!staffName) return;
    Object.keys(this.selectedGarments).forEach(gName => {
      if (!this.garmentStaff[gName]) this.garmentStaff[gName] = {};
      this.garmentStaff[gName][role] = staffName;
    });
    // Update selects in DOM
    const container = document.getElementById('measurementsContainer');
    if (container) {
      container.querySelectorAll(`.garment-${role}-select`).forEach(sel => {
        sel.value = staffName;
      });
    }
    window.App.showToast(`Applied ${staffName} as ${role === 'cut' ? 'Cutting Master' : 'Sewing Tailor'} to all garments`, 'info');
  },

  clearGarmentMeasurements(garment) {
    delete this.measurements[garment];
    delete this.garmentNotes[garment];
    delete this.garmentStaff[garment];
    this.renderMeasurements();
  },

  clearMeasurements() {
    this.measurements = {};
    this.garmentNotes = {};
    this.garmentStaff = {};
    this.renderMeasurements();
  },

  hasUnsavedWork() {
    const cust = document.getElementById('custName')?.value?.trim();
    const phone = document.getElementById('custPhone')?.value?.trim();
    const notes = document.getElementById('tailoringNotes')?.value?.trim();
    const garmentsCount = Object.keys(this.selectedGarments || {}).length;
    const measCount = Object.keys(this.measurements || {}).length;
    return Boolean(cust || phone || notes || garmentsCount > 0 || measCount > 0);
  },

  resetForm() {
    this.selectedGarments = {};
    this.measurements = {};
    this.garmentNotes = {};
    this.garmentStaff = {};
    this.render(document.getElementById('viewport'));
  },

  async handleSaveOrder(action = 'normal') {
    const token = document.getElementById('orderTokenInput').value.trim();
    const customer = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const rawOrderDate = document.getElementById('orderDate').value.trim();
    const rawDeliveryDate = document.getElementById('deliveryDate').value.trim();
    const orderDate = this.formatDisplayDate(rawOrderDate);
    const deliveryDate = this.formatDisplayDate(rawDeliveryDate);
    const generalNotes = document.getElementById('tailoringNotes')?.value?.trim() || '';
    const total = parseFloat(document.getElementById('totalAmountInput').value || 0);
    const advance = parseFloat(document.getElementById('advancePaidInput').value || 0);
    const payMode = document.getElementById('payModeSelect').value;

    if (!customer || !phone) {
      window.App.showToast('Please enter customer name and phone number', 'error');
      return;
    }

    if (Object.keys(this.selectedGarments).length === 0) {
      window.App.showToast('Please select at least one garment', 'error');
      return;
    }

    // Build garments array with per-garment staff and styling notes
    const garmentsArray = Object.entries(this.selectedGarments).map(([name, data]) => ({
      name,
      qty: data.qty,
      rate: data.rate,
      notes: this.garmentNotes[name] || '',
      cut: this.garmentStaff[name]?.cut || '',
      sew: this.garmentStaff[name]?.sew || ''
    }));

    // Build work pieces with per-piece staff and styling notes
    const workPieces = [];
    garmentsArray.forEach(g => {
      const qty = g.qty || 1;
      for (let n = 1; n <= qty; n++) {
        workPieces.push({
          g: g.name,
          n: n,
          cut: g.cut || '',
          sew: g.sew || '',
          notes: g.notes || '',
          cut_rate: 0,
          sew_rate: 0,
          cut_slip: '',
          sew_slip: ''
        });
      }
    });

    const cutMasters = [...new Set(workPieces.map(p => p.cut).filter(Boolean))].join(', ');
    const sewTailors = [...new Set(workPieces.map(p => p.sew).filter(Boolean))].join(', ');

    const orderPayload = {
      token,
      customer,
      phone,
      order_date: orderDate,
      delivery_date: deliveryDate,
      urgent: this.isUrgent ? 1 : 0,
      garments: garmentsArray,
      measurements: this.measurements,
      work: workPieces,
      notes: generalNotes,
      cutting_master: cutMasters,
      sewing_tailor: sewTailors,
      total,
      advance,
      balance: Math.max(0, total - advance),
      pay_mode: payMode,
      status: cutMasters ? 'Cutting In-Process' : 'Cutting Pending'
    };

    try {
      const saved = await API.createOrder(orderPayload);
      window.App.showToast(`Order ${saved.token} successfully booked!`, 'success');

      if (action === 'print') {
        window.App.openPrintModal([saved.token]);
      } else if (action === 'whatsapp') {
        const msg = PrintEngine.generateOrderWhatsApp(saved, 'booked', window.App.settings?.shop_name);
        PrintEngine.openWhatsApp(saved.phone, msg);
      }

      // Reset and load fresh booking form
      this.resetForm();

    } catch (err) {
      window.App.showToast(`Failed to book order: ${err.message}`, 'error');
    }
  },

  async openCounterSettleLookup() {
    try {
      const ordersRes = await API.getOrders({ limit: 100, status: 'All' });
      const orders = ordersRes.orders || [];
      const unsettled = orders.filter(o => o.status !== 'Delivered' || (o.balance && o.balance > 0));

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;">
              Search Order by Token, Phone, or Customer
            </label>
            <input type="text" id="counterLookupInput" class="form-input" placeholder="Type token (e.g. 26-104) or customer phone..." 
                   style="font-size: 14px; padding: 10px 12px; width: 100%; border: 1.5px solid var(--border-subtle); border-radius: 8px;"
                   oninput="BookingView.filterCounterLookup(this.value)">
          </div>

          <div style="max-height: 320px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px;" id="counterLookupList">
            ${unsettled.length === 0 ? '<div style="padding: 24px; text-align: center; color: var(--muted);">No open orders with pending balance found.</div>' : ''}
            ${unsettled.map(o => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s;"
                   class="order-lookup-row"
                   onmouseover="this.style.background='var(--paper)'" onmouseout="this.style.background='transparent'"
                   onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: var(--ink);">
                    <strong style="color: var(--rust); margin-right: 6px;">${o.token}</strong> ${o.customer}
                  </div>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                    📞 ${o.phone} · Delivery: ${o.delivery_date} · Status: <span style="font-weight: 600; color: var(--ink-secondary);">${o.status}</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 11px; color: var(--muted);">Balance Due</div>
                  <div style="font-size: 16px; font-weight: 800; color: ${o.balance > 0 ? 'var(--scarlet)' : 'var(--burgundy)'};">
                    ₹${PrintEngine.fmtMoney(o.balance)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      this._lookupOrders = unsettled;
      window.App.showCustomModal('💰 Settle & Deliver Order', html, null, 'Close');
    } catch (err) {
      window.App.showToast('Failed to load orders: ' + err.message, 'error');
    }
  },

  filterCounterLookup(query) {
    const listEl = document.getElementById('counterLookupList');
    if (!listEl || !this._lookupOrders) return;
    const q = query.toLowerCase().trim();
    const filtered = this._lookupOrders.filter(o => 
      (o.token && o.token.toLowerCase().includes(q)) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q))
    );

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--muted);">No matching orders found.</div>';
      return;
    }

    listEl.innerHTML = filtered.map(o => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s;"
           onmouseover="this.style.background='var(--paper)'" onmouseout="this.style.background='transparent'"
           onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">
        <div>
          <div style="font-weight: 700; font-size: 14px; color: var(--ink);">
            <strong style="color: var(--rust); margin-right: 6px;">${o.token}</strong> ${o.customer}
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            📞 ${o.phone} · Delivery: ${o.delivery_date} · Status: <span style="font-weight: 600; color: var(--ink-secondary);">${o.status}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: var(--muted);">Balance Due</div>
          <div style="font-size: 16px; font-weight: 800; color: ${o.balance > 0 ? 'var(--scarlet)' : 'var(--burgundy)'};">
            ₹${PrintEngine.fmtMoney(o.balance)}
          </div>
        </div>
      </div>
    `).join('');
  }
};



/* === js/views/orders.js === */
/* ==========================================================================
   7 ART TAILORS - ORDERS PIPELINE & MANAGEMENT VIEW
   ========================================================================== */

const OrdersView = {
  orders: [],
  total: 0,
  page: 1,
  limit: 25,
  pages: 1,
  searchQuery: '',
  selectedStatus: 'All',
  urgentOnly: false,
  selectedTokens: new Set(),
  staffList: { cutting: [], sewing: [] },

  toIsoDate(d) {
    if (!d) return '';
    if (d instanceof Date) {
      const yr = d.getFullYear();
      const mon = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${yr}-${mon}-${day}`;
    }
    const s = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const parts = s.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  },

  formatDisplayDate(val) {
    if (!val) return '';
    const iso = this.toIsoDate(val);
    if (!iso) return String(val);
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  },

  async initStaff() {
    const list = await API.listStaff(null, true);
    this.staffList.cutting = list.filter(s => s.role === 'cutting');
    this.staffList.sewing = list.filter(s => s.role === 'sewing');
  },

  async loadOrders() {
    const params = {
      page: this.page,
      limit: this.limit,
      q: this.searchQuery,
      status: this.selectedStatus === 'All' ? '' : this.selectedStatus,
      urgent: this.urgentOnly ? 1 : ''
    };
    const res = await API.listOrders(params);
    this.orders = res.orders || [];
    this.total = res.total || 0;
    this.pages = res.pages || 1;
    this.selectedTokens.clear();
  },

  async render(container) {
    await this.initStaff();
    await this.loadOrders();

    const statuses = [
      "All", "Cutting Pending", "Cutting In-Process",
      "Stitching In-Progress", "Ready for Trial/Delivery", "Delivered"
    ];

    container.innerHTML = `
      <div>
        <!-- Title and Search / Filter Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">PRODUCTION PIPELINE</div>
            <h1 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Orders & Garment Tracking</h1>
            <p style="font-size: 13px; color: var(--muted);">Monitor piece-by-piece workshop progress, print slips, and manage client settlements.</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="OrdersView.exportExcel()">
              <span>📊</span> Export Excel (.xlsx)
            </button>
            <button class="btn btn-primary" onclick="window.App.navigate('booking')">
              <span>✂️</span> + New Order
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="card" style="margin-bottom: 20px; padding: 16px 20px;">
          <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
            
            <!-- Search Input -->
            <div style="flex-grow: 1; min-width: 280px; position: relative;">
              <input type="text" id="orderSearchInput" class="form-input" 
                     placeholder="Search token (e.g. 26-101), customer, phone, master cutter..." 
                     value="${this.searchQuery}" style="padding-left: 36px;">
              <span style="position: absolute; left: 12px; top: 10px; color: var(--muted);">🔍</span>
            </div>

            <!-- Status Dropdown -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: var(--muted);">Status:</span>
              <select id="statusFilterSelect" class="form-select" style="width: auto; font-weight: 600;">
                ${statuses.map(s => `<option value="${s}" ${s === this.selectedStatus ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>

            <!-- Urgent Filter -->
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
              <input type="checkbox" id="urgentFilterCheck" ${this.urgentOnly ? 'checked' : ''} class="table-checkbox">
              <span style="font-weight: 700; font-size: 12px; color: var(--red);">🚨 Express Urgent Only</span>
            </label>

            <!-- Reset Filters -->
            <button class="btn btn-ghost btn-sm" onclick="OrdersView.resetFilters()">Reset</button>
          </div>
        </div>

        <!-- Multi-Select Action Bar (Dynamically Visible) -->
        <div id="bulkActionBar" class="card" style="display: none; margin-bottom: 16px; background: var(--card-warm); border: 1.5px solid var(--rust); padding: 12px 20px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: var(--rust);">
                <span id="bulkSelectedCount">0</span> orders selected
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="OrdersView.deselectAll()" style="color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; font-size: 12px; cursor: pointer;">
                ✕ Deselect All
              </button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openEditSelected()"><span style="margin-right: 2px;">✏️</span> Edit Order</button>
              <button class="btn btn-dark btn-sm" onclick="OrdersView.bulkPrint()">🖨️ Print Slips</button>
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openBulkMove('Cutting In-Process')">✂️ Move to Cutting</button>
              <button class="btn btn-secondary btn-sm" onclick="OrdersView.openBulkMove('Stitching In-Progress')">🧵 Move to Stitching</button>
              <button class="btn btn-green btn-sm" onclick="OrdersView.bulkSetStatus('Ready for Trial/Delivery')">✓ Mark Ready</button>
              <button class="btn btn-primary btn-sm" onclick="OrdersView.settleSelected()" style="background: #BD1A22; color: white;">💰 Settle & Deliver</button>
              <button class="btn btn-green btn-sm" onclick="OrdersView.openBulkWhatsApp()">💬 WhatsApp</button>
              <button class="btn btn-danger btn-sm" onclick="OrdersView.bulkDelete()">🗑️ Delete</button>
            </div>
          </div>
        </div>

        <!-- Orders Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 36px; text-align: center;">
                    <input type="checkbox" id="selectAllCheckbox" class="table-checkbox" onchange="OrdersView.toggleSelectAll(this.checked)">
                  </th>
                  <th>Token</th>
                  <th>Customer Info</th>
                  <th>Garments & Pieces</th>
                  <th>Craft Dates</th>
                  <th>Status & Piece Tracking</th>
                  <th>Bill & Balance</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody">
                ${this.renderTableRows()}
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--sidebar); border-top: 1px solid var(--border); font-size: 13px;">
            <div style="color: var(--muted);">
              Showing ${(this.page - 1) * this.limit + 1} - ${Math.min(this.page * this.limit, this.total)} of <strong>${this.total.toLocaleString()}</strong> orders
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary btn-sm" ${this.page <= 1 ? 'disabled' : ''} onclick="OrdersView.changePage(${this.page - 1})">
                ◀ Previous
              </button>
              <span style="font-weight: 700; padding: 0 8px;">Page ${this.page} of ${this.pages}</span>
              <button class="btn btn-secondary btn-sm" ${this.page >= this.pages ? 'disabled' : ''} onclick="OrdersView.changePage(${this.page + 1})">
                Next ▶
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  renderTableRows() {
    if (this.orders.length === 0) {
      return `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--muted);">
            No orders match the current search or filters.
          </td>
        </tr>
      `;
    }

    return this.orders.map(o => {
      const isChecked = this.selectedTokens.has(o.token);
      let garments = o.garments;
      if (typeof garments === 'string') {
        try { garments = JSON.parse(garments); } catch (e) { garments = []; }
      }
      if (!Array.isArray(garments)) garments = [];
      const garmentSummary = garments.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || 'Custom Garment';

      let pieces = o.work;
      if (typeof pieces === 'string') {
        try { pieces = JSON.parse(pieces); } catch (e) { pieces = []; }
      }
      if (!Array.isArray(pieces)) pieces = [];

      return `
        <tr id="row_${o.token}" ondblclick="OrdersView.openEditModal('${o.token}')" style="cursor: pointer;" title="Double-click row to open edit modal">
          <td style="text-align: center;" ondblclick="event.stopPropagation()">
            <input type="checkbox" class="table-checkbox row-select-cb" value="${o.token}" 
                   ${isChecked ? 'checked' : ''} onchange="OrdersView.toggleSelect('${o.token}', this.checked)">
          </td>
          <td>
            <div style="font-family: var(--font-serif); font-size: 16px; font-weight: 800; color: var(--ink);">
              ${o.token}
            </div>
            ${o.urgent ? '<span class="badge badge-urgent" style="font-size: 9px; margin-top: 2px;">★ URGENT</span>' : ''}
          </td>
          <td>
            <div style="font-weight: 700; color: var(--ink);">${o.customer}</div>
            <div style="font-size: 12px; color: var(--muted); user-select: text;">
              📞 ${o.phone}
            </div>
          </td>
          <td style="max-width: 240px;">
            <div style="font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${garmentSummary}">
              ${garmentSummary}
            </div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
              ${pieces.length} physical piece(s)
            </div>
          </td>
          <td>
            <div style="font-size: 12px; color: var(--muted);">Booked: ${o.order_date}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--ink); margin-top: 2px;">
              Due: ${o.delivery_date}
            </div>
          </td>
          <td>
            <div style="margin-bottom: 4px;">
              <span class="badge badge-status-${this.getStatusClass(o.status)}">${o.status}</span>
            </div>
            <div style="font-size: 11px; color: var(--muted);">
              Cut: <strong>${o.cutting_master || '—'}</strong> | Sew: <strong>${o.sewing_tailor || '—'}</strong>
            </div>
          </td>
          <td>
            <div style="font-size: 13px;">Total: <strong>₹${PrintEngine.fmtMoney(o.total)}</strong></div>
            <div style="font-size: 12px; color: var(--green);">Adv: ₹${PrintEngine.fmtMoney(o.advance)}</div>
            <div style="font-size: 13px; font-weight: 800; color: ${o.balance > 0 ? 'var(--red)' : 'var(--green)'}; margin-top: 1px;">
              Due: ₹${PrintEngine.fmtMoney(o.balance)}
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap;" ondblclick="event.stopPropagation()">
            <button class="btn btn-primary btn-sm" title="Settle & Deliver Order" onclick="window.App.openSettleModal('${o.token}')" style="background: #BD1A22; color: white; padding: 4px 8px; margin-right: 4px; font-weight: 700;">💰 Settle</button>
            <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
            <button class="btn btn-green btn-sm" title="WhatsApp Customer" onclick="window.App.quickWhatsApp('${o.token}')">💬</button>
            <button class="btn btn-secondary btn-sm" title="View / Edit Order" onclick="OrdersView.openEditModal('${o.token}')">✏️</button>
            <a class="btn btn-ghost btn-sm" title="Download Order PDF" href="${API.getOrderPdfUrl(o.token)}" target="_blank">📄</a>
          </td>
        </tr>
      `;
    }).join('');
  },

  bindEvents() {
    let debounceTimer;
    document.getElementById('orderSearchInput').addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        this.searchQuery = e.target.value.trim();
        this.page = 1;
        await this.loadOrders();
        document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      }, 300);
    });

    document.getElementById('statusFilterSelect').addEventListener('change', async (e) => {
      this.selectedStatus = e.target.value;
      this.page = 1;
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    });

    document.getElementById('urgentFilterCheck').addEventListener('change', async (e) => {
      this.urgentOnly = e.target.checked;
      this.page = 1;
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    });
  },

  getStatusClass(status) {
    if (status === 'Cutting Pending') return 'cutting-pending';
    if (status === 'Cutting In-Process') return 'cutting-process';
    if (status === 'Stitching In-Progress') return 'stitching';
    if (status === 'Ready for Trial/Delivery') return 'ready';
    return 'delivered';
  },

  toggleSelect(token, checked) {
    if (checked) {
      this.selectedTokens.add(token);
    } else {
      this.selectedTokens.delete(token);
    }
    this.updateBulkActionBar();
  },

  toggleSelectAll(checked) {
    if (checked) {
      this.orders.forEach(o => this.selectedTokens.add(o.token));
    } else {
      this.selectedTokens.clear();
    }
    document.querySelectorAll('.row-select-cb').forEach(cb => cb.checked = checked);
    this.updateBulkActionBar();
  },

  deselectAll() {
    this.selectedTokens.clear();
    const selectAllCb = document.getElementById('selectAllCheckbox');
    if (selectAllCb) selectAllCb.checked = false;
    document.querySelectorAll('.row-select-cb').forEach(cb => cb.checked = false);
    this.updateBulkActionBar();
  },

  updateBulkActionBar() {
    const bar = document.getElementById('bulkActionBar');
    const countEl = document.getElementById('bulkSelectedCount');
    const count = this.selectedTokens.size;

    if (count > 0) {
      bar.style.display = 'block';
      countEl.innerText = count;
    } else {
      bar.style.display = 'none';
    }
  },

  async changePage(newPage) {
    if (newPage < 1 || newPage > this.pages) return;
    this.page = newPage;
    await this.loadOrders();
    document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.urgentOnly = false;
    this.page = 1;
    this.render(document.getElementById('viewport'));
  },

  openEditSelected() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) {
      window.App.showToast('Please select an order to edit', 'error');
      return;
    }
    this.openEditModal(tokens[0]);
  },

  settleSelected() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) {
      window.App.showToast('Please select an order to settle & deliver', 'error');
      return;
    }
    window.App.openSettleModal(tokens[0]);
  },

  bulkPrint() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    window.App.openPrintModal(tokens);
  },

  openBulkWhatsApp() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    window.App.openWhatsAppQueue(tokens);
  },

  async bulkSetStatus(status) {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;
    try {
      await API.bulkStatusChange(tokens, status);
      window.App.showToast(`Updated ${tokens.length} order(s) to ${status}`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      this.updateBulkActionBar();
    } catch (err) {
      window.App.showToast(`Failed: ${err.message}`, 'error');
    }
  },

  openBulkMove(targetStatus) {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;

    const isCutting = targetStatus === 'Cutting In-Process';
    const staffList = isCutting ? this.staffList.cutting : this.staffList.sewing;
    const roleName = isCutting ? 'Cutting Master' : 'Sewing Tailor';

    const html = `
      <div class="form-group">
        <label class="form-label">Assign ${roleName} for ${tokens.length} selected orders:</label>
        <select id="bulkStaffSelect" class="form-select">
          <option value="">— Leave individual assignments —</option>
          ${staffList.map(s => `<option value="${s.name}">${s.name} (${s.phone || 'No phone'})</option>`).join('')}
        </select>
      </div>
    `;

    window.App.showCustomModal(`Move ${tokens.length} Orders to ${targetStatus}`, html, async () => {
      const selectedPerson = document.getElementById('bulkStaffSelect').value;
      const kwargs = {
        tokens,
        status: targetStatus,
        cutting_master: isCutting ? selectedPerson : null,
        sewing_tailor: !isCutting ? selectedPerson : null
      };
      await API.bulkStatusChange(tokens, targetStatus, kwargs.cutting_master, kwargs.sewing_tailor);
      window.App.showToast(`Moved ${tokens.length} order(s) to ${targetStatus}`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
      this.updateBulkActionBar();
    });
  },

  bulkDelete() {
    const tokens = Array.from(this.selectedTokens);
    if (tokens.length === 0) return;

    window.App.askPassword('delete_password', async (password) => {
      try {
        await API.deleteOrders(tokens, password);
        window.App.showToast(`Deleted ${tokens.length} order(s)`, 'success');
        await this.loadOrders();
        document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
        this.updateBulkActionBar();
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    });
  },

  exportExcel() {
    window.location.href = API.getExcelDownloadUrl();
  },

  async openEditModal(token) {
    const order = await API.getOrder(token);
    if (!order) return;

    let garmentsList = order.garments || [];
    if (typeof garmentsList === 'string') {
      try { garmentsList = JSON.parse(garmentsList); } catch (e) { garmentsList = []; }
    }
    if (!Array.isArray(garmentsList)) garmentsList = [];

    let measurements = order.measurements || {};
    if (typeof measurements === 'string') {
      try { measurements = JSON.parse(measurements); } catch (e) { measurements = {}; }
    }
    if (typeof measurements !== 'object' || Array.isArray(measurements) || !measurements) measurements = {};

    let pieces = order.work || [];
    if (typeof pieces === 'string') {
      try { pieces = JSON.parse(pieces); } catch (e) { pieces = []; }
    }
    if (!Array.isArray(pieces)) pieces = [];

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Customer Name</label>
            <input type="text" id="editCustomer" class="form-input" value="${order.customer}">
          </div>
          <div>
            <label class="form-label">Phone</label>
            <input type="text" id="editPhone" class="form-input" value="${order.phone}">
          </div>
          <div>
            <label class="form-label">Order Date</label>
            <input type="date" id="editOrderDate" class="form-input" value="${this.toIsoDate(order.order_date)}" style="width: 100%; font-size: 14px; cursor: pointer; background: #fff;">
          </div>
          <div>
            <label class="form-label">Delivery Date</label>
            <input type="date" id="editDeliveryDate" class="form-input" value="${this.toIsoDate(order.delivery_date)}" style="width: 100%; font-size: 14px; cursor: pointer; background: #fff;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Status</label>
            <select id="editStatus" class="form-select">
              ${["Cutting Pending", "Cutting In-Process", "Stitching In-Progress", "Ready for Trial/Delivery", "Delivered"].map(s => `
                <option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Payment Mode</label>
            <select id="editPayMode" class="form-select">
              ${["UPI", "Cash", "Card", "Pending"].map(p => `
                <option value="${p}" ${p === order.pay_mode ? 'selected' : ''}>${p}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Total Bill (₹)</label>
            <input type="number" id="editTotal" class="form-input" value="${order.total}">
          </div>
          <div>
            <label class="form-label">Advance Paid (₹)</label>
            <input type="number" id="editAdvance" class="form-input" value="${order.advance}">
          </div>
          <div>
            <label class="form-label">Balance Due (₹)</label>
            <input type="number" id="editBalance" class="form-input" value="${order.balance}">
          </div>
        </div>

        <div>
          <label class="form-label">Styling & Posture Notes</label>
          <textarea id="editNotes" class="form-textarea">${order.notes || ''}</textarea>
        </div>

        <!-- Booked Garments List -->
        <div>
          <label class="form-label" style="font-weight: 700; color: var(--ink);">Booked Garments (${garmentsList.length})</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${garmentsList.length === 0 ? '<div style="color: var(--muted); font-size: 12px;">No garments listed</div>' : garmentsList.map((g, idx) => `
              <div style="background: var(--card-rose); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 6px 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
                <span style="background: var(--crimson); color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">${idx+1}</span>
                <strong style="color: var(--ink);">${g.qty || 1}x ${g.name}</strong>
                <span style="color: var(--muted); font-size: 11px;">(₹${PrintEngine.fmtMoney((g.rate || 0) * (g.qty || 1))})</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Craft Measurements Typing Boxes -->
        <div>
          <label class="form-label" style="font-weight: 700; color: var(--ink); display: flex; justify-content: space-between; align-items: baseline;">
            <span>Craft Measurements (Inches)</span>
            <span style="font-size: 11px; font-weight: 500; color: var(--muted);">Type tape numbers freely with spaces/words (blank if unmeasured)</span>
          </label>
          ${(() => {
            const orderGarments = [];
            if (Array.isArray(garmentsList)) {
              garmentsList.forEach(g => {
                const name = g.name || g.garment;
                if (name && !orderGarments.includes(name)) orderGarments.push(name);
              });
            }
            if (Array.isArray(pieces)) {
              pieces.forEach(p => {
                const name = p.g || p.garment;
                if (name && !orderGarments.includes(name)) orderGarments.push(name);
              });
            }
            Object.keys(measurements).forEach(k => {
              if (k && k !== '_flow' && !orderGarments.includes(k)) orderGarments.push(k);
            });
            if (orderGarments.length === 0) {
              orderGarments.push('General Garment');
            }

            return orderGarments.map(gName => {
              const gMeas = measurements[gName];
              let measVal = '';
              if (gMeas) {
                if (typeof gMeas === 'string') {
                  measVal = gMeas;
                } else if (typeof gMeas === 'object') {
                  if (gMeas._flow !== undefined && gMeas._flow !== null) {
                    measVal = String(gMeas._flow);
                  } else {
                    measVal = Object.entries(gMeas)
                      .filter(([k, v]) => k !== '_flow' && v !== undefined && v !== null && String(v).trim() !== '')
                      .map(([k, v]) => String(v).trim())
                      .join('  ');
                  }
                }
              }

              return `
                <div class="form-group" style="margin-bottom: 10px; background: var(--card-warm); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px;">
                  <label class="form-label" style="font-weight: 700; font-size: 12px; color: var(--crimson); text-transform: uppercase; margin-bottom: 5px;">
                    📐 ${gName} Measurements
                  </label>
                  <input type="text" 
                         class="form-input edit-order-meas-input" 
                         data-garment="${gName}" 
                         value="${measVal.replace(/"/g, '&quot;')}" 
                         placeholder="e.g. 14  15  31.50  40.75  30.50 (leave blank or edit measurements)"
                         style="background: #FFFFFF; font-size: 13.5px;">
                </div>
              `;
            }).join('');
          })()}
        </div>

        <!-- Piece Assignments -->
        <div>
          <label class="form-label">Pieces Assignment (${pieces.length} pieces)</label>
          <div class="table-responsive">
            <table class="table-custom" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Piece #</th>
                  <th>Garment</th>
                  <th>Cutting Master</th>
                  <th>Sewing Tailor</th>
                  <th>Styling Note</th>
                </tr>
              </thead>
              <tbody>
                ${pieces.map((p, idx) => `
                  <tr>
                    <td>#${p.n || idx + 1}</td>
                    <td><strong>${p.g}</strong></td>
                    <td>
                      <select class="form-select piece-cut-select" data-idx="${idx}" style="padding: 4px 8px; font-size: 12px;">
                        <option value="">— Unassigned —</option>
                        ${this.staffList.cutting.map(s => `<option value="${s.name}" ${s.name === p.cut ? 'selected' : ''}>${s.name}</option>`).join('')}
                      </select>
                    </td>
                    <td>
                      <select class="form-select piece-sew-select" data-idx="${idx}" style="padding: 4px 8px; font-size: 12px;">
                        <option value="">— Unassigned —</option>
                        ${this.staffList.sewing.map(s => `<option value="${s.name}" ${s.name === p.sew ? 'selected' : ''}>${s.name}</option>`).join('')}
                      </select>
                    </td>
                    <td>
                      <input type="text" class="form-input piece-note-input" data-idx="${idx}" value="${p.notes || ''}" placeholder="Note for piece..." style="padding: 4px 6px; font-size: 11.5px; height: 28px;">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Edit Order ${order.token}`, html, async () => {
      const updatedPcs = [...pieces];
      document.querySelectorAll('.piece-cut-select').forEach(sel => {
        const idx = parseInt(sel.dataset.idx);
        updatedPcs[idx].cut = sel.value;
      });
      document.querySelectorAll('.piece-sew-select').forEach(sel => {
        const idx = parseInt(sel.dataset.idx);
        updatedPcs[idx].sew = sel.value;
      });
      document.querySelectorAll('.piece-note-input').forEach(inp => {
        const idx = parseInt(inp.dataset.idx);
        updatedPcs[idx].notes = inp.value.trim();
      });

      const cutMasters = [...new Set(updatedPcs.map(p => p.cut).filter(Boolean))].join(', ');
      const sewTailors = [...new Set(updatedPcs.map(p => p.sew).filter(Boolean))].join(', ');

      // Collect any updated measurements
      const updatedMeas = JSON.parse(JSON.stringify(measurements));
      document.querySelectorAll('.edit-order-meas-input').forEach(inp => {
        const gName = inp.dataset.garment;
        const val = inp.value.trim();
        updatedMeas[gName] = { _flow: val };
      });

      const total = parseFloat(document.getElementById('editTotal').value || 0);
      const advance = parseFloat(document.getElementById('editAdvance').value || 0);
      const balance = parseFloat(document.getElementById('editBalance').value || 0);

      const payload = {
        customer: document.getElementById('editCustomer').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        order_date: this.formatDisplayDate(document.getElementById('editOrderDate').value),
        delivery_date: this.formatDisplayDate(document.getElementById('editDeliveryDate').value),
        status: document.getElementById('editStatus').value,
        pay_mode: document.getElementById('editPayMode').value,
        total,
        advance,
        balance,
        notes: document.getElementById('editNotes').value.trim(),
        work: updatedPcs,
        measurements: updatedMeas,
        cutting_master: cutMasters,
        sewing_tailor: sewTailors
      };

      await API.updateOrder(order.token, payload);
      window.App.showToast(`Order ${order.token} updated!`, 'success');
      await this.loadOrders();
      document.getElementById('ordersTableBody').innerHTML = this.renderTableRows();
    }, 'Save changes', 'lg');
  }
};

window.OrdersView = OrdersView;



/* === js/views/customers.js === */
/* ==========================================================================
   7 ART TAILORS - CUSTOMERS DIRECTORY & LEDGER VIEW
   ========================================================================== */

const CustomersView = {
  customers: [],
  total: 0,
  page: 1,
  limit: 25,
  pages: 1,
  searchQuery: '',
  selectedPhones: new Set(),

  async loadCustomers() {
    const res = await API.listCustomers({
      page: this.page,
      limit: this.limit,
      q: this.searchQuery
    });
    this.customers = res.customers || [];
    this.total = res.total || 0;
    this.pages = res.pages || 1;
    this.selectedPhones.clear();
  },

  async render(container) {
    await this.loadCustomers();

    container.innerHTML = `
      <div>
        <!-- Title & Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 22px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">CLIENT DIRECTORY</div>
            <h1 style="font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--ink);">Customer Directory & Balances</h1>
            <p style="font-size: 13px; color: var(--muted);">Grouped customer profiles, lifetime billing history, and outstanding balances.</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-green" onclick="CustomersView.openSelectedWhatsAppQueue()">
              <span>💬</span> WhatsApp Queue
            </button>
          </div>
        </div>

        <!-- Multi-Select Action Bar (Dynamically Visible) -->
        <div id="custBulkActionBar" class="card" style="display: none; margin-bottom: 16px; background: var(--card-warm); border: 1.5px solid var(--rust); padding: 12px 20px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: var(--rust);">
                <span id="custSelectedCount">0</span> customer(s) selected
              </div>
              <button type="button" class="btn btn-ghost btn-sm" onclick="CustomersView.deselectAll()" style="color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; font-size: 12px; cursor: pointer;">
                ✕ Deselect All
              </button>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button class="btn btn-green btn-sm" onclick="CustomersView.openSelectedWhatsAppQueue()">💬 WhatsApp Queue</button>
            </div>
          </div>
        </div>

        <!-- Search Bar Card -->
        <div class="card" style="margin-bottom: 20px; padding: 14px 20px;">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="flex-grow: 1; position: relative;">
              <input type="text" id="custSearchInput" class="form-input" 
                     placeholder="Search client by name or 10-digit phone number..." 
                     value="${this.searchQuery}" style="padding-left: 36px;">
              <span style="position: absolute; left: 12px; top: 10px; color: var(--muted);">🔍</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="CustomersView.resetSearch()">Clear</button>
          </div>
        </div>

        <!-- Customers Table Card -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="table-custom">
              <thead>
                <tr>
                  <th style="width: 36px; text-align: center;">
                    <input type="checkbox" id="selectAllCustCb" class="table-checkbox" onchange="CustomersView.toggleSelectAll(this.checked)">
                  </th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th style="text-align: center;">Total Orders</th>
                  <th>Total Billed</th>
                  <th>Total Advances</th>
                  <th>Pending Balance</th>
                  <th>Last Order Date</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="customersTableBody">
                ${this.renderRows()}
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--sidebar); border-top: 1px solid var(--border); font-size: 13px;">
            <div style="color: var(--muted);">
              Showing ${(this.page - 1) * this.limit + 1} - ${Math.min(this.page * this.limit, this.total)} of <strong>${this.total.toLocaleString()}</strong> clients
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-secondary btn-sm" ${this.page <= 1 ? 'disabled' : ''} onclick="CustomersView.changePage(${this.page - 1})">
                ◀ Previous
              </button>
              <span style="font-weight: 700; padding: 0 8px;">Page ${this.page} of ${this.pages}</span>
              <button class="btn btn-secondary btn-sm" ${this.page >= this.pages ? 'disabled' : ''} onclick="CustomersView.changePage(${this.page + 1})">
                Next ▶
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  },

  renderRows() {
    if (this.customers.length === 0) {
      return `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px; color: var(--muted);">
            No customer records found.
          </td>
        </tr>
      `;
    }

    return this.customers.map(c => {
      const isChecked = this.selectedPhones.has(c.phone);
      const hasBalance = (c.pending_balance || 0) > 0;

      return `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="table-checkbox cust-row-cb" value="${c.phone}" 
                   ${isChecked ? 'checked' : ''} onchange="CustomersView.toggleSelect('${c.phone}', this.checked)">
          </td>
          <td>
            <div style="font-weight: 700; color: var(--ink); font-size: 14px;">${c.customer}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--muted);">${c.phone}</div>
          </td>
          <td style="text-align: center;">
            <span class="badge" style="background: var(--sidebar); font-size: 12px; font-weight: 700;">${c.total_orders}</span>
          </td>
          <td>
            <span style="font-weight: 700;">₹${PrintEngine.fmtMoney(c.total_billed)}</span>
          </td>
          <td>
            <span style="color: var(--green); font-weight: 600;">₹${PrintEngine.fmtMoney(c.total_advance)}</span>
          </td>
          <td>
            <span style="font-weight: 800; color: ${hasBalance ? 'var(--red)' : 'var(--green)'};">
              ₹${PrintEngine.fmtMoney(c.pending_balance)}
            </span>
          </td>
          <td>
            <div style="color: var(--muted); font-size: 12px;">${c.last_order_date || '—'}</div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-secondary btn-sm" title="View Order History" onclick="CustomersView.viewHistory('${c.phone}', '${c.customer}')">
              📋 History
            </button>
            <button class="btn btn-green btn-sm" title="WhatsApp Message / Queue" onclick="CustomersView.openSingleCustomerWhatsApp('${c.phone}', '${c.customer}', ${c.pending_balance})">
              💬
            </button>
            <button class="btn btn-ghost btn-sm" title="Copy Phone" onclick="CustomersView.copyPhone('${c.phone}')">
              📋
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  bindEvents() {
    let debounceTimer;
    document.getElementById('custSearchInput').addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        this.searchQuery = e.target.value.trim();
        this.page = 1;
        await this.loadCustomers();
        document.getElementById('customersTableBody').innerHTML = this.renderRows();
      }, 300);
    });
  },

  toggleSelect(phone, checked) {
    if (checked) {
      this.selectedPhones.add(phone);
    } else {
      this.selectedPhones.delete(phone);
    }
    this.updateBulkActionBar();
  },

  toggleSelectAll(checked) {
    if (checked) {
      this.customers.forEach(c => this.selectedPhones.add(c.phone));
    } else {
      this.selectedPhones.clear();
    }
    document.querySelectorAll('.cust-row-cb').forEach(cb => cb.checked = checked);
    this.updateBulkActionBar();
  },

  deselectAll() {
    this.selectedPhones.clear();
    const selectAllCb = document.getElementById('selectAllCustCb');
    if (selectAllCb) selectAllCb.checked = false;
    document.querySelectorAll('.cust-row-cb').forEach(cb => cb.checked = false);
    this.updateBulkActionBar();
  },

  updateBulkActionBar() {
    const bar = document.getElementById('custBulkActionBar');
    const countEl = document.getElementById('custSelectedCount');
    const count = this.selectedPhones.size;
    if (bar && countEl) {
      if (count > 0) {
        bar.style.display = 'block';
        countEl.innerText = count;
      } else {
        bar.style.display = 'none';
      }
    }
  },

  openSingleCustomerWhatsApp(phone, customer, pending_balance) {
    window.App.openCustomerWhatsAppQueue([{
      phone,
      customer,
      pending_balance: parseFloat(pending_balance) || 0
    }]);
  },

  async changePage(newPage) {
    if (newPage < 1 || newPage > this.pages) return;
    this.page = newPage;
    await this.loadCustomers();
    document.getElementById('customersTableBody').innerHTML = this.renderRows();
    this.updateBulkActionBar();
  },

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.render(document.getElementById('viewport'));
  },

  copyPhone(phone) {
    navigator.clipboard.writeText(phone);
    window.App.showToast(`Copied phone: ${phone}`, 'info');
  },

  sendCustomerWhatsApp(phone, customer, balance) {
    const shopName = window.App.settings?.shop_name || "7 ART TAILORS";
    let text = `Hello ${customer}, greetings from ${shopName}! `;
    if (balance > 0) {
      text += `This is a friendly reminder that you have a pending balance of ₹${PrintEngine.fmtMoney(balance)}. Thank you!`;
    } else {
      text += `Thank you for your patronage. Please let us know if you need any bespoke tailoring or adjustments!`;
    }
    PrintEngine.openWhatsApp(phone, text);
  },

  async viewHistory(phone, customer) {
    const res = await API.getCustomerOrders(phone);
    const orders = res.orders || [];

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-size: 18px; font-weight: 700; color: var(--ink);">${customer}</div>
            <div style="font-size: 13px; color: var(--muted);">📞 +91 ${phone}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background: var(--sidebar); font-size: 13px; font-weight: 700;">${orders.length} Order(s) Recorded</span>
          </div>
        </div>

        <div class="table-responsive" style="max-height: 420px; overflow-y: auto;">
          <table class="table-custom" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Token</th>
                <th>Order Date</th>
                <th>Delivery</th>
                <th>Garments</th>
                <th>Status</th>
                <th>Total</th>
                <th>Balance</th>
                <th style="text-align: right;">Slip</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => {
                let gList = o.garments;
                if (typeof gList === 'string') { try { gList = JSON.parse(gList); } catch(e) { gList = []; } }
                if (!Array.isArray(gList)) gList = [];
                const gText = gList.map(g => `${g.qty || 1}x ${g.name || ''}`).join(', ') || '—';
                return `
                <tr>
                  <td><strong>${o.token}</strong></td>
                  <td>${o.order_date}</td>
                  <td>${o.delivery_date}</td>
                  <td>${gText}</td>
                  <td><span class="badge badge-status-${OrdersView.getStatusClass(o.status)}">${o.status}</span></td>
                  <td>₹${PrintEngine.fmtMoney(o.total)}</td>
                  <td style="font-weight: 700; color: ${o.balance > 0 ? 'var(--red)' : 'var(--green)'};">₹${PrintEngine.fmtMoney(o.balance)}</td>
                  <td style="text-align: right; white-space: nowrap;">
                    ${o.balance > 0 ? `<button class="btn btn-primary btn-sm" style="background: #BD1A22; color: white; padding: 2px 7px; margin-right: 4px; font-weight: 700;" onclick="window.App.closeCustomModal(); window.App.openSettleModal('${o.token}')">💰 Settle</button>` : ''}
                    <button class="btn btn-ghost btn-sm" onclick="window.App.openPrintModal(['${o.token}'])">🖨️</button>
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Client History: ${customer}`, html, null, 'Close');
  },

  openSelectedWhatsAppQueue() {
    const phones = Array.from(this.selectedPhones);
    let targetCustomers = [];
    if (phones.length > 0) {
      targetCustomers = this.customers.filter(c => phones.includes(c.phone));
    } else {
      targetCustomers = this.customers;
    }

    if (targetCustomers.length === 0) {
      window.App.showToast('No customers available for WhatsApp queue', 'warning');
      return;
    }

    window.App.openCustomerWhatsAppQueue(targetCustomers.map(c => ({
      customer: c.customer,
      phone: c.phone,
      pending_balance: parseFloat(c.pending_balance) || 0
    })));
  }
};



/* === js/views/manage.js === */
/* ==========================================================================
   7 ART TAILORS - TEAM & MANAGE (PERSONNEL) VIEW
   Matches Desktop Screenshots 1, 2, 4
   ========================================================================== */

const ManageView = {
  staff: [],
  cuttingMasters: [],
  sewingTailors: [],

  async loadStaff() {
    this.staff = await API.listStaff();
    this.cuttingMasters = this.staff.filter(s => s.role === 'cutting');
    this.sewingTailors = this.staff.filter(s => s.role === 'sewing');
  },

  async render(container) {
    await this.loadStaff();

    const cuttingAvailCount = this.cuttingMasters.filter(s => s.available).length;
    const sewingAvailCount = this.sewingTailors.filter(s => s.available).length;

    container.innerHTML = `
      <div>
        <!-- Page Header -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--rust);">TEAM</div>
            <h1 style="font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--ink);">Manage</h1>
            <p style="font-size: 13px; color: var(--muted);">Today's cutting masters and sewing tailors</p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="ManageView.openPersonnelListModal()">
              <span>📋</span> Personnel List
            </button>
            <button class="btn btn-secondary" onclick="ManageView.openSalaryHistoryModal()">
              <span>📜</span> Salary History
            </button>
            <button class="btn btn-primary" onclick="ManageView.openAddPersonModal()">
              <span>+</span> Add Person
            </button>
          </div>
        </div>

        <!-- 2 Columns: Cutting Masters & Sewing Tailors -->
        <div class="manage-columns-grid">
          
          <!-- Column 1: Cutting Masters -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              <h2 style="font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--ink);">Cutting Masters</h2>
              <div style="font-size: 12px; color: var(--muted); font-weight: 600;">
                ${cuttingAvailCount} available · ${this.cuttingMasters.length} total
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${this.cuttingMasters.length === 0 ? `
                <div style="text-align: center; color: var(--muted); padding: 24px;">No cutting masters registered.</div>
              ` : this.cuttingMasters.map(p => this.renderWorkerCard(p)).join('')}
            </div>
          </div>

          <!-- Column 2: Sewing Tailors -->
          <div class="card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              <h2 style="font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: var(--ink);">Sewing Tailors</h2>
              <div style="font-size: 12px; color: var(--muted); font-weight: 600;">
                ${sewingAvailCount} available · ${this.sewingTailors.length} total
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${this.sewingTailors.length === 0 ? `
                <div style="text-align: center; color: var(--muted); padding: 24px;">No sewing tailors registered.</div>
              ` : this.sewingTailors.map(p => this.renderWorkerCard(p)).join('')}
            </div>
          </div>

        </div>

        <!-- Footer Hint (Matches Desktop) -->
        <div style="margin-top: 24px; padding: 14px 20px; background: var(--sidebar); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 12px; color: var(--muted); line-height: 1.6;">
          <strong>Tip:</strong> Tick = available for work assignment. Untick a person to hide them from the order assignment lists only; they stay on this page and in Personnel List with all their records. Use <strong>'Entry'</strong> to assign batches of cut/sew pieces, <strong>'Advance'</strong> to record advance payments/settlements, and <strong>'Salary Slip'</strong> to settle completed piece-work.
        </div>
      </div>
    `;
  },

  renderWorkerCard(person) {
    const isCutting = person.role === 'cutting';
    const roleBadgeClass = isCutting ? 'badge-role-cutting' : 'badge-role-sewing';
    const roleTitle = isCutting ? 'Cutting Master' : 'Sewing Tailor';
    const advDue = parseFloat(person.advance_due || 0);

    return `
      <div class="worker-card-inner">
        <!-- Checkbox & Worker Info -->
        <div class="worker-info-wrap">
          <input type="checkbox" class="table-checkbox" ${person.available ? 'checked' : ''} 
                 title="Toggle Availability" onchange="ManageView.toggleAvailability(${person.id}, this.checked)">
          
          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 700; font-size: 15px; color: var(--ink);">${person.name}</span>
              <span class="badge ${roleBadgeClass}" style="font-size: 10px;">${roleTitle}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); margin-top: 3px; flex-wrap: wrap;">
              <span>📞 ${person.phone || 'No phone'}</span>
              ${advDue > 0 ? `<span class="badge badge-advance" style="font-size: 11px;">Advance due ₹${PrintEngine.fmtMoney(advDue)}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- 3 Quick Action Buttons (Entry, Manage advance, Salary slip) -->
        <div class="worker-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openEntryModal(${person.id})" title="Batch Piece Assignment">
            ✏️ Entry
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openManageAdvanceModal(${person.id})" title="Advance Ledger">
            💰 Advance
          </button>
          <button class="btn btn-secondary btn-sm" onclick="ManageView.openSalarySlipModal(${person.id})" title="Create Salary Slip">
            📜 Salary Slip
          </button>
        </div>
      </div>
    `;
  },

  async toggleAvailability(id, isAvailable) {
    try {
      await API.updateStaff(id, { available: isAvailable });
      window.App.showToast(`Updated availability for staff member`, 'info');
      await this.loadStaff();
    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  // -------------------------------------------------------------
  // 1. Batch Entry Modal (Screenshot 4)
  // -------------------------------------------------------------
  async openEntryModal(personId) {
    const person = await API.getStaff(personId);
    if (!person) return;

    const roleName = person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';
    const roleAction = person.role === 'cutting' ? 'cutting master' : 'sewing tailor';
    const defaultPrefix = window.App?.settings?.token_prefix || "26";

    let rowsHtml = '';
    for (let i = 1; i <= 6; i++) {
      rowsHtml += `
        <tr class="entry-row" data-row="${i}">
          <td style="width: 140px; padding: 6px 8px;">
            <div style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span class="entry-prefix-label" style="font-weight: 800; font-size: 13px; color: var(--crimson);">${defaultPrefix}-</span>
              <input type="text" class="form-input entry-token-num" placeholder="101" 
                     data-row="${i}" style="width: 85px; text-align: center; font-weight: 700; height: 36px; padding: 4px 6px;"
                     onblur="ManageView.lookupEntryOrder(${i}, '${person.role}')">
            </div>
          </td>
          <td style="min-width: 260px; padding: 6px 8px;">
            <select class="form-select entry-garment-select" data-row="${i}" 
                    style="width: 100%; height: 36px; font-size: 12.5px;"
                    disabled onchange="ManageView.onEntryGarmentChange(${i})">
              <option value="">— Enter token first —</option>
            </select>
          </td>
          <td style="width: 90px; padding: 6px 8px;">
            <select class="form-select entry-pieces-select" data-row="${i}" style="width: 100%; height: 36px;" disabled>
              <option value="1">1 pc</option>
            </select>
          </td>
          <td style="min-width: 160px; padding: 6px 8px;">
            <span class="entry-row-status" id="entryStatus_${i}" style="font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap;">
              Awaiting token
            </span>
          </td>
        </tr>
      `;
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
        <div style="background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div style="font-size: 15px; font-weight: 700; color: var(--ink);">
            ${person.name} · ${roleName}
          </div>
          <div style="font-size: 12px; color: var(--muted);">
            Every row below is assigned to this person as ${roleAction} (only unassigned pieces)
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <label style="font-size: 12px; font-weight: 700; color: var(--muted);">Token Prefix:</label>
          <input type="text" id="entryGlobalPrefix" value="${defaultPrefix}" class="form-input" style="width: 70px; text-align: center; font-weight: bold; height: 34px;" oninput="ManageView.updateEntryPrefixes(this.value)">
          <span style="font-size: 11px; color: var(--muted);">Applies to every row: type only the number (e.g. 101).</span>
        </div>

        <div style="max-height: 440px; overflow-y: auto; overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <table class="table-custom" style="width: 100%; margin: 0; min-width: 650px;">
            <thead>
              <tr style="background: var(--card-rose); position: sticky; top: 0; z-index: 2;">
                <th style="width: 140px; padding: 8px 10px;">Token Number</th>
                <th style="min-width: 260px; padding: 8px 10px;">Garment (Free Pieces)</th>
                <th style="width: 90px; padding: 8px 10px;">Pieces</th>
                <th style="min-width: 160px; padding: 8px 10px;">Check Status</th>
              </tr>
            </thead>
            <tbody id="entryRowsTableBody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="ManageView.addMoreEntryRows(4, '${person.role}')">
            + 4 more rows
          </button>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Entry - ${person.name}`, html, async () => {
      const entries = [];
      const rows = document.querySelectorAll('.entry-row');
      const prefix = document.getElementById('entryGlobalPrefix').value.trim();

      rows.forEach(r => {
        const rowId = r.dataset.row;
        const numInput = r.querySelector('.entry-token-num').value.trim();
        const garmentSel = r.querySelector('.entry-garment-select').value;
        const piecesSel = r.querySelector('.entry-pieces-select').value;

        if (numInput && garmentSel) {
          const fullToken = numInput.includes('-') ? numInput : `${prefix}-${numInput}`;
          entries.push({
            token: fullToken,
            garment: garmentSel,
            pieces: parseInt(piecesSel || 1)
          });
        }
      });

      if (entries.length === 0) {
        window.App.showToast('No valid row assignments entered', 'warning');
        return;
      }

      try {
        await API.executeBatchEntry(person.id, entries);
        window.App.showToast(`Saved batch assignments for ${person.name}!`, 'success');
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save assignments', 'xl');
  },

  updateEntryPrefixes(newPrefix) {
    document.querySelectorAll('.entry-prefix-label').forEach(el => {
      el.innerText = `${newPrefix}-`;
    });
  },

  async lookupEntryOrder(rowId, role) {
    const prefix = document.getElementById('entryGlobalPrefix').value.trim();
    const numInput = document.querySelector(`.entry-token-num[data-row="${rowId}"]`);
    const garmentSel = document.querySelector(`.entry-garment-select[data-row="${rowId}"]`);
    const piecesSel = document.querySelector(`.entry-pieces-select[data-row="${rowId}"]`);
    const statusEl = document.getElementById(`entryStatus_${rowId}`);

    const val = numInput.value.trim();
    if (!val) {
      statusEl.innerText = 'Awaiting token';
      statusEl.style.color = 'var(--muted)';
      garmentSel.innerHTML = '<option value="">— Enter token first —</option>';
      garmentSel.disabled = true;
      piecesSel.disabled = true;
      return;
    }

    const fullToken = val.includes('-') ? val : `${prefix}-${val}`;

    try {
      const res = await API.getFreePieces(fullToken, role);
      const freeMap = res.free_pieces || {};
      const garments = Object.keys(freeMap);

      if (garments.length === 0) {
        statusEl.innerText = `✗ ${fullToken}: all pieces already assigned`;
        statusEl.style.color = 'var(--red)';
        garmentSel.disabled = true;
        piecesSel.disabled = true;
        return;
      }

      statusEl.innerText = `✔ ${res.customer} (${res.status})`;
      statusEl.style.color = 'var(--green)';

      garmentSel.innerHTML = garments.map(g => `<option value="${g}" data-max="${freeMap[g]}">${g} (${freeMap[g]} free)</option>`).join('');
      garmentSel.disabled = false;
      piecesSel.disabled = false;

      this.onEntryGarmentChange(rowId);

    } catch (err) {
      statusEl.innerText = `✗ ${err.message || 'Token not found'}`;
      statusEl.style.color = 'var(--red)';
      garmentSel.disabled = true;
      piecesSel.disabled = true;
    }
  },

  onEntryGarmentChange(rowId) {
    const garmentSel = document.querySelector(`.entry-garment-select[data-row="${rowId}"]`);
    const piecesSel = document.querySelector(`.entry-pieces-select[data-row="${rowId}"]`);
    const opt = garmentSel.options[garmentSel.selectedIndex];
    const max = parseInt(opt?.dataset.max || 1);

    piecesSel.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1} pc${i > 0 ? 's' : ''}</option>`).join('');
  },

  addMoreEntryRows(count, role) {
    const tbody = document.getElementById('entryRowsTableBody');
    const currCount = tbody.querySelectorAll('.entry-row').length;
    const prefix = document.getElementById('entryGlobalPrefix').value.trim();

    let extra = '';
    for (let i = currCount + 1; i <= currCount + count; i++) {
      extra += `
        <tr class="entry-row" data-row="${i}">
          <td style="width: 140px; padding: 6px 8px;">
            <div style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span class="entry-prefix-label" style="font-weight: 800; font-size: 13px; color: var(--crimson);">${prefix}-</span>
              <input type="text" class="form-input entry-token-num" placeholder="101" 
                     data-row="${i}" style="width: 85px; text-align: center; font-weight: 700; height: 36px; padding: 4px 6px;"
                     onblur="ManageView.lookupEntryOrder(${i}, '${role}')">
            </div>
          </td>
          <td style="min-width: 260px; padding: 6px 8px;">
            <select class="form-select entry-garment-select" data-row="${i}" 
                    style="width: 100%; height: 36px; font-size: 12.5px;"
                    disabled onchange="ManageView.onEntryGarmentChange(${i})">
              <option value="">— Enter token first —</option>
            </select>
          </td>
          <td style="width: 90px; padding: 6px 8px;">
            <select class="form-select entry-pieces-select" data-row="${i}" style="width: 100%; height: 36px;" disabled>
              <option value="1">1 pc</option>
            </select>
          </td>
          <td style="min-width: 160px; padding: 6px 8px;">
            <span class="entry-row-status" id="entryStatus_${i}" style="font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap;">
              Awaiting token
            </span>
          </td>
        </tr>
      `;
    }
    tbody.insertAdjacentHTML('beforeend', extra);
  },

  // -------------------------------------------------------------
  // 2. Manage Advance Modal (Give / Settle)
  // Protected with salary_password
  // -------------------------------------------------------------
  openManageAdvanceModal(personId) {
    window.App.askPassword('salary_password', async () => {
      const person = await API.getStaff(personId);
      if (!person) return;
      const advances = await API.listAdvances(person.name, person.role);

      const html = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name}</div>
              <div style="font-size: 12px; color: var(--muted);">${person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted);">Current Advance Due</div>
              <div style="font-size: 22px; font-weight: 800; color: var(--red);">₹${PrintEngine.fmtMoney(person.advance_due)}</div>
            </div>
          </div>

          <!-- Add Advance Form -->
          <div class="card" style="padding: 14px; background: var(--card-warm);">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">Record New Advance Entry</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label class="form-label">Type</label>
                <select id="advKind" class="form-select">
                  <option value="given">Advance Given to Worker (+)</option>
                  <option value="settled">Advance Settled / Recovered (-)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Amount (₹)</label>
                <input type="number" id="advAmount" class="form-input" placeholder="0.00" min="1" step="any">
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label class="form-label">Note / Purpose (Optional)</label>
              <input type="text" id="advNote" class="form-input" placeholder="e.g. Festival advance, emergency, direct recovery">
            </div>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px;" 
                    onclick="ManageView.saveAdvanceEntry('${person.name}', '${person.role}')">
              + Record Advance
            </button>
          </div>

          <!-- Past Advances Ledger -->
          <div>
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 6px;">Advance History Ledger</div>
            <div class="table-responsive" style="max-height: 220px; overflow-y: auto;">
              <table class="table-custom" style="font-size: 12px;">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Kind</th>
                    <th>Amount</th>
                    <th>Slip / Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${advances.length === 0 ? `
                    <tr><td colspan="4" style="text-align: center; color: var(--muted); padding: 14px;">No advance transactions recorded.</td></tr>
                  ` : advances.map(a => `
                    <tr>
                      <td>${a.created_at ? a.created_at.substring(0, 16).replace('T', ' ') : ''}</td>
                      <td>
                        <span class="badge" style="background: ${a.kind === 'given' ? '#FEE2E2; color: #DC2626;' : '#DCFCE7; color: #16A34A;'} font-weight: 700;">
                          ${a.kind === 'given' ? 'Given' : 'Settled'}
                        </span>
                      </td>
                      <td style="font-weight: 700;">₹${PrintEngine.fmtMoney(a.amount)}</td>
                      <td style="color: var(--muted);">${a.note || a.slip_no || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      window.App.showCustomModal(`Manage Advance - ${person.name}`, html, null, 'Close');
    }, 'Salary Password Required', 'Enter the Salary / Advance password to manage advances:');
  },

  async saveAdvanceEntry(worker, role) {
    const kind = document.getElementById('advKind').value;
    const amount = parseFloat(document.getElementById('advAmount').value || 0);
    const note = document.getElementById('advNote').value.trim();

    if (amount <= 0) {
      window.App.showToast('Please enter a valid amount', 'warning');
      return;
    }

    try {
      await API.addAdvance(worker, role, kind, amount, note);
      window.App.showToast('Advance recorded successfully!', 'success');
      window.App.closeCustomModal();
      await this.loadStaff();
      this.render(document.getElementById('viewport'));
    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  // -------------------------------------------------------------
  // 3. Salary Slip Modal (Piece-rate calculations, deductions)
  // Protected with salary_password
  // -------------------------------------------------------------
  openSalarySlipModal(personId) {
    window.App.askPassword('salary_password', async () => {
      const person = await API.getStaff(personId);
      if (!person) return;

      const unsettled = await API.getUnsettledWork(person.name, person.role);
      const advDue = parseFloat(person.advance_due || 0);

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name}</div>
            <div style="font-size: 12px; color: var(--muted);">${person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted);">Outstanding Advance</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--red);">₹${PrintEngine.fmtMoney(advDue)}</div>
          </div>
        </div>

        <div style="font-size: 13px; font-weight: 600; color: var(--ink);">
          Select Completed Pieces to Pay (${unsettled.length} pending piece(s)):
        </div>

        <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
          <table class="table-custom" style="font-size: 12px;">
            <thead>
              <tr>
                <th style="width: 32px;">
                  <input type="checkbox" id="salarySelectAll" checked onchange="ManageView.toggleSalaryPieces(this.checked)">
                </th>
                <th>Token</th>
                <th>Customer</th>
                <th>Garment</th>
                <th>Piece #</th>
                <th>Stage</th>
                <th style="text-align: right;">Rate (₹)</th>
              </tr>
            </thead>
            <tbody id="salaryPiecesTbody">
              ${unsettled.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; color: var(--muted); padding: 24px;">No completed unpaid pieces for this worker.</td></tr>
              ` : unsettled.map((u, idx) => `
                <tr>
                  <td>
                    <input type="checkbox" class="salary-piece-cb" checked data-idx="${idx}" onchange="ManageView.recalculateSalarySlip(${advDue})">
                  </td>
                  <td><strong>${u.token}</strong></td>
                  <td>${u.customer}</td>
                  <td>${u.garment}</td>
                  <td>#${u.n}</td>
                  <td><span class="badge" style="background: ${u.done ? 'var(--green-light); color: var(--green);' : '#FEF3C7; color: #B45309;'}">${u.done ? 'Finished' : 'In Progress'}</span></td>
                  <td style="text-align: right;">
                    <input type="number" class="form-input salary-piece-rate" data-idx="${idx}" value="${u.rate}" 
                           style="width: 80px; text-align: right; padding: 4px;" oninput="ManageView.recalculateSalarySlip(${advDue})">
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Calculations Card -->
        <div class="card" style="padding: 14px; background: var(--card-warm);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: end;">
            <div>
              <label class="form-label">Gross Earnings (₹)</label>
              <div id="salaryGross" style="font-size: 16px; font-weight: 700; color: var(--ink);">₹0.00</div>
            </div>
            <div>
              <label class="form-label">Advance Recovery (₹)</label>
              <input type="number" id="salaryAdvDeduct" class="form-input" value="${Math.min(advDue, 0)}" min="0" max="${advDue}" 
                     step="any" oninput="ManageView.recalculateSalarySlip(${advDue})">
            </div>
            <div>
              <label class="form-label">Other Deductions (₹)</label>
              <input type="number" id="salaryOthDeduct" class="form-input" value="0" min="0" step="any" oninput="ManageView.recalculateSalarySlip(${advDue})">
            </div>
            <div>
              <label class="form-label">Net Payable (₹)</label>
              <div id="salaryNet" style="font-size: 18px; font-weight: 800; color: var(--green);">₹0.00</div>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <input type="text" id="salaryNote" class="form-input" placeholder="Slip remarks / notes (optional)">
          </div>
        </div>
      </div>
    `;

    // Store unsettled on window for calculation
    window._tempUnsettled = unsettled;

    window.App.showCustomModal(`Salary Slip - ${person.name}`, html, async () => {
      const cbs = document.querySelectorAll('.salary-piece-cb:checked');
      if (cbs.length === 0) {
        window.App.showToast('Please tick at least one piece to pay', 'warning');
        return;
      }

      const selectedItems = [];
      cbs.forEach(cb => {
        const idx = parseInt(cb.dataset.idx);
        const u = window._tempUnsettled[idx];
        const rateEl = document.querySelector(`.salary-piece-rate[data-idx="${idx}"]`);
        selectedItems.push({
          token: u.token,
          customer: u.customer,
          garment: u.garment,
          n: u.n,
          stage: u.done ? 'Completed' : 'In progress',
          rate: parseFloat(rateEl.value || 0)
        });
      });

      const advDeduct = parseFloat(document.getElementById('salaryAdvDeduct').value || 0);
      const othDeduct = parseFloat(document.getElementById('salaryOthDeduct').value || 0);
      const note = document.getElementById('salaryNote').value.trim();

      try {
        const slip = await API.generateSalarySlip(person.id, person.name, person.role, selectedItems, advDeduct, othDeduct, note);
        window.App.showToast(`Salary slip ${slip.slip_no} generated!`, 'success');
        window.App.openPrintSalarySlipModal(slip.slip_no);
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, '✔ Generate Slip');

      // Run initial calculation
      setTimeout(() => this.recalculateSalarySlip(advDue), 50);
    }, 'Salary Password Required', 'Enter the Salary / Advance password to open salary slip:');
  },

  toggleSalaryPieces(checked) {
    document.querySelectorAll('.salary-piece-cb').forEach(cb => cb.checked = checked);
    const advDue = parseFloat(document.getElementById('salaryAdvDeduct')?.max || 0);
    this.recalculateSalarySlip(advDue);
  },

  recalculateSalarySlip(advDue) {
    const cbs = document.querySelectorAll('.salary-piece-cb:checked');
    let gross = 0;
    cbs.forEach(cb => {
      const idx = cb.dataset.idx;
      const rateEl = document.querySelector(`.salary-piece-rate[data-idx="${idx}"]`);
      gross += parseFloat(rateEl?.value || 0);
    });

    const advInput = document.getElementById('salaryAdvDeduct');
    const othInput = document.getElementById('salaryOthDeduct');

    let adv = parseFloat(advInput?.value || 0);
    let oth = parseFloat(othInput?.value || 0);

    const net = Math.max(0, gross - adv - oth);

    const grossEl = document.getElementById('salaryGross');
    const netEl = document.getElementById('salaryNet');

    if (grossEl) grossEl.innerText = `₹${PrintEngine.fmtMoney(gross)}`;
    if (netEl) netEl.innerText = `₹${PrintEngine.fmtMoney(net)}`;
  },

  // -------------------------------------------------------------
  // 4. Personnel List Modal (Screenshot 1)
  // -------------------------------------------------------------
  openPersonnelListModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="font-size: 13px; color: var(--muted);">
          Click the tick box to switch a person available / unavailable (their records are kept permanently). Double-click a person to open their personal price list.
        </div>

        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <table class="table-custom">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">Available</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th style="text-align: right;">Price List</th>
              </tr>
            </thead>
            <tbody>
              ${this.staff.map(p => `
                <tr style="cursor: pointer;" ondblclick="ManageView.openPriceListModal(${p.id})">
                  <td style="text-align: center;">
                    <input type="checkbox" class="table-checkbox" ${p.available ? 'checked' : ''} 
                           onchange="ManageView.toggleAvailability(${p.id}, this.checked)">
                  </td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.phone || '—'}</td>
                  <td><span class="badge ${p.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${p.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}</span></td>
                  <td><span style="color: ${p.available ? 'var(--green)' : 'var(--muted)'}; font-weight: 600;">${p.available ? 'Available' : 'Unavailable'}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="ManageView.openPriceListModal(${p.id})">
                      ⏱ Price list
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal('Personnel list', html, null, 'Done');
  },

  // -------------------------------------------------------------
  // 5. Price List Modal (Screenshot 1 Right)
  // -------------------------------------------------------------
  async openPriceListModal(personId) {
    const person = await API.getStaff(personId);
    if (!person) return;

    const catalog = window.App?.settings?.garments || {};
    const workerRates = person.rates || {};
    const roleLabel = person.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="text-align: center; margin-bottom: 8px;">
          <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${person.name} · ${roleLabel}</div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            Payment per piece for this person only. These prices are used when you make their salary slip.
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding: 4px;">
          ${Object.keys(catalog).map(g => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <span style="font-weight: 600; font-size: 13px;">${g}</span>
              <div class="input-addon-group" style="width: 160px;">
                <span class="input-addon-left">₹</span>
                <input type="number" class="form-input worker-rate-input" data-garment="${g}" 
                       value="${workerRates[g] || ''}" placeholder="0" step="any" min="0" style="text-align: right;">
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    window.App.showCustomModal(`Price list - ${person.name}`, html, async () => {
      const updatedRates = {};
      document.querySelectorAll('.worker-rate-input').forEach(inp => {
        const val = parseFloat(inp.value);
        if (!isNaN(val) && val > 0) {
          updatedRates[inp.dataset.garment] = val;
        }
      });

      try {
        await API.setStaffRates(person.id, updatedRates);
        window.App.showToast(`Saved price list for ${person.name}!`, 'success');
        await ManageView.loadStaff();
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save price list');
  },

  // -------------------------------------------------------------
  // 6. Salary History Modal
  // Protected with salary_password
  // -------------------------------------------------------------
  openSalaryHistoryModal() {
    window.App.askPassword('salary_password', async () => {
      const [slips, advances] = await Promise.all([
        API.listSalarySlips(),
        API.listAdvances()
      ]);

      // Combine salary slips and advances into a unified ledger sorted by date
      const unified = [];
      (slips || []).forEach(s => {
        unified.push({
          type: 'salary',
          token: s.slip_no,
          date: s.created_at || '',
          worker: s.worker,
          role: s.role,
          pieces: (s.items || []).length,
          amount: s.net,
          gross: s.gross,
          deduction: s.deduction,
          advance: s.advance,
          note: s.note || '',
          raw: s
        });
      });
      (advances || []).forEach(a => {
        unified.push({
          type: 'advance',
          token: a.adv_id,
          date: a.created_at || '',
          worker: a.worker,
          role: a.role,
          pieces: '—',
          amount: a.amount,
          kind: a.kind, // 'given' or 'settled'
          note: a.note || (a.slip_no ? `Recovered on ${a.slip_no}` : (a.kind === 'given' ? 'Cash Advance Given' : 'Advance Settled')),
          raw: a
        });
      });

      unified.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 15px; font-weight: 700; color: var(--ink);">Staff Ledger &amp; Payout History</div>
              <div style="font-size: 12px; color: var(--muted);">Unified history of piece-rate salary settlements (SAL) and advance transactions (ADV).</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <span class="badge" style="background: #FAF0F0; color: #BD1A22; font-weight: 700;">SAL: ${slips.length} Slips</span>
              <span class="badge" style="background: #FEF3C7; color: #B45309; font-weight: 700;">ADV: ${advances.length} Advances</span>
            </div>
          </div>

          <div class="table-responsive" style="max-height: 480px; overflow-y: auto;">
            <table class="table-custom" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="width: 120px;">Token #</th>
                  <th style="width: 130px;">Transaction</th>
                  <th style="width: 100px;">Date</th>
                  <th>Worker Name</th>
                  <th style="width: 90px;">Role</th>
                  <th>Pieces / Description</th>
                  <th style="width: 110px;">Amount</th>
                  <th style="text-align: right; width: 130px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${unified.length === 0 ? `
                  <tr><td colspan="8" style="text-align: center; color: var(--muted); padding: 24px;">No salary or advance history found.</td></tr>
                ` : unified.map(item => {
                  if (item.type === 'salary') {
                    return `
                      <tr style="background: #FFFFFF;">
                        <td><strong style="color: var(--crimson); font-family: var(--font-serif); font-size: 13px;">${item.token}</strong></td>
                        <td><span class="badge" style="background: #FAF0F0; color: #BD1A22; font-weight: 700;">Salary Slip</span></td>
                        <td>${item.date.substring(0, 10)}</td>
                        <td><strong>${item.worker}</strong></td>
                        <td><span class="badge ${item.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${item.role === 'cutting' ? 'Cutter' : 'Sewing'}</span></td>
                        <td>${item.pieces} piece(s) settled</td>
                        <td style="font-weight: 800; color: var(--green);">₹${PrintEngine.fmtMoney(item.amount)}</td>
                        <td style="text-align: right; white-space: nowrap;">
                          <a class="btn btn-ghost btn-sm" title="Download Slip PDF" href="${API.getSalarySlipPdfUrl(item.token)}" target="_blank">📄</a>
                          <button class="btn btn-ghost btn-sm" title="Print Slip" onclick="window.App.openPrintSalarySlipModal('${item.token}')">🖨️</button>
                          <button class="btn btn-green btn-sm" title="WhatsApp Slip" onclick="ManageView.whatsappSalarySlip('${item.token}')">💬</button>
                        </td>
                      </tr>
                    `;
                  } else {
                    const isGiven = item.kind === 'given';
                    return `
                      <tr style="background: #FFFDF9;">
                        <td><strong style="color: #D97706; font-family: var(--font-serif); font-size: 13px;">${item.token}</strong></td>
                        <td>
                          <span class="badge" style="background: ${isGiven ? '#FEF3C7; color: #B45309;' : '#DCFCE7; color: #15803D;'} font-weight: 700;">
                            ${isGiven ? '★ Advance Given' : '✔ Advance Settled'}
                          </span>
                        </td>
                        <td>${item.date.substring(0, 10)}</td>
                        <td><strong>${item.worker}</strong></td>
                        <td><span class="badge ${item.role === 'cutting' ? 'badge-role-cutting' : 'badge-role-sewing'}">${item.role === 'cutting' ? 'Cutter' : 'Sewing'}</span></td>
                        <td style="color: var(--muted); font-size: 11.5px;">${item.note}</td>
                        <td style="font-weight: 800; color: ${isGiven ? '#DC2626' : '#16A34A'};">
                          ${isGiven ? '+' : '-'}₹${PrintEngine.fmtMoney(item.amount)}
                        </td>
                        <td style="text-align: right; white-space: nowrap;">
                          <span style="font-size: 11px; color: var(--muted); padding: 3px 8px; background: var(--paper); border: 1px solid var(--border); border-radius: 4px;">Advance Voucher</span>
                        </td>
                      </tr>
                    `;
                  }
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      window.App.showCustomModal('Salary & Advance History Ledger', html, null, 'Close', 'xl');
    }, 'Salary Password Required', 'Enter the Salary / Advance password to view salary & advance history:');
  },

  async whatsappSalarySlip(slipNo) {
    const slip = await API.getSalarySlip(slipNo);
    if (!slip) return;
    const staff = this.staff.find(s => s.name === slip.worker && s.role === slip.role);
    const phone = staff?.phone || '';
    const shopName = window.App.settings?.shop_name || "7 ART TAILORS";

    const msg = `*${shopName} - Salary slip ${slip.slip_no}*\nDate: ${slip.created_at ? slip.created_at.substring(0, 10) : ''}\nName: ${slip.worker} (${slip.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})\nPieces paid: ${(slip.items || []).length}\nGross: ₹${PrintEngine.fmtMoney(slip.gross)}\nAdvance deducted: ₹${PrintEngine.fmtMoney(slip.advance)}\n*Net Paid: ₹${PrintEngine.fmtMoney(slip.net)}*\nRemaining Advance Due: ₹${PrintEngine.fmtMoney(slip.adv_due)}`;
    PrintEngine.openWhatsApp(phone, msg);
  },

  // -------------------------------------------------------------
  // 7. Add Person Modal
  // -------------------------------------------------------------
  openAddPersonModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="addStaffName" class="form-input" placeholder="e.g. Ramesh Saini" required>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" id="addStaffPhone" class="form-input" placeholder="10-digit mobile number">
        </div>
        <div class="form-group">
          <label class="form-label">Role *</label>
          <select id="addStaffRole" class="form-select">
            <option value="cutting">Cutting Master</option>
            <option value="sewing">Sewing Tailor</option>
          </select>
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Add Staff Person', html, async () => {
      const name = document.getElementById('addStaffName').value.trim();
      const phone = document.getElementById('addStaffPhone').value.trim();
      const role = document.getElementById('addStaffRole').value;

      if (!name) {
        window.App.showToast('Please enter person name', 'warning');
        return;
      }

      try {
        await API.addStaff(name, phone, role);
        window.App.showToast(`Added ${name} as ${role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'}!`, 'success');
        await ManageView.loadStaff();
        ManageView.render(document.getElementById('viewport'));
      } catch (err) {
        window.App.showToast(err.message, 'error');
      }
    }, 'Save Person');
  },

  // -------------------------------------------------------------
  // 8. Employee User Accounts & Login Modal (Authority Only)
  // -------------------------------------------------------------
  async openUserAccountsModal() {
    if (App.currentUser?.role !== 'authority') {
      window.App.showToast('Access restricted to Authority (Bhagirath Saini) only', 'error');
      return;
    }

    let users = [];
    try {
      users = await API.listUsers();
    } catch (e) {
      window.App.showToast('Could not load users', 'error');
      return;
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--ink);">Workshop Staff & Manager Accounts</div>
            <p style="font-size: 12px; color: var(--muted); margin: 0;">
              Add, edit, or remove workers from the login list. Assign IDs and passwords.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="ManageView.openAddUserModal()">
            + Add New User
          </button>
        </div>

        <div class="table-responsive" style="max-height: 420px; overflow-y: auto;">
          <table class="table-custom">
            <thead>
              <tr>
                <th>Username (ID)</th>
                <th>Full Name</th>
                <th>Role Tag</th>
                <th>Linked Staff</th>
                <th>Last Active</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                let roleBadge = '<span class="role-badge role-badge-employee">✂️ Employee</span>';
                if (u.role === 'authority') {
                  roleBadge = '<span class="role-badge role-badge-authority">👑 Authority</span>';
                } else if (u.role === 'manager') {
                  roleBadge = '<span class="role-badge role-badge-manager">💼 Manager</span>';
                }

                const isAuthority = u.role === 'authority' || ['admin', 'bhagirath'].includes(u.username.toLowerCase());

                return `
                  <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.full_name}</td>
                    <td>${roleBadge}</td>
                    <td>${u.staff_name || '<span style="color: var(--muted);">—</span>'}</td>
                    <td style="font-size: 11px; color: var(--muted);">${u.last_login ? u.last_login.substring(0, 16).replace('T', ' ') : 'Never'}</td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button class="btn btn-ghost btn-sm" onclick="ManageView.openEditUserModal(${u.id})">✏️ Edit</button>
                      <button class="btn btn-ghost btn-sm" style="color: var(--red);" onclick="ManageView.deleteUser(${u.id}, '${u.username}', '${u.role}')" title="${isAuthority ? 'Requires Secret Password to delete' : 'Delete user'}">
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.App.showCustomModal('👥 Manage Logins & Workers (Authority Control)', html, null, 'Close');
  },

  async openAddUserModal() {
    let staffList = [];
    try {
      staffList = await API.listStaff();
    } catch (e) {}

    const staffOptions = staffList.map(s => `<option value="${s.name}">${s.name} (${s.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})</option>`).join('');

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Username (Login ID) *</label>
          <input type="text" id="newUsername" class="form-input" placeholder="e.g. rahul" required autocomplete="off">
        </div>
        <div class="form-group">
          <label class="form-label">Password *</label>
          <input type="password" id="newUserPassword" class="form-input" placeholder="Enter password (e.g. 123)" required autocomplete="new-password">
        </div>
        <div class="form-group">
          <label class="form-label">Full Name *</label>
          <input type="text" id="newUserFullName" class="form-input" placeholder="e.g. Rahul Sharma" required>
        </div>
        <div class="form-group">
          <label class="form-label">Role Tag Permission *</label>
          <select id="newUserRole" class="form-select">
            <option value="employee" selected>✂️ Employee (Craftsman / Bench Worker Portal)</option>
            <option value="manager">💼 Manager (Counter Operations - Cannot Add/Remove Workers)</option>
            <option value="authority">👑 Authority (Studio Owner - Full Access & User Management)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Link to Workshop Staff Member (Optional)</label>
          <select id="newUserStaff" class="form-select">
            <option value="">— None / Independent Account —</option>
            ${staffOptions}
          </select>
          <span style="font-size: 11px; color: var(--muted); margin-top: 4px;">Linking connects their login directly to their assigned cutting/sewing pieces</span>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="text" id="newUserPhone" class="form-input" placeholder="+91 ...">
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Create Worker / User Account', html, async () => {
      const username = document.getElementById('newUsername').value.trim();
      const password = document.getElementById('newUserPassword').value.trim();
      const full_name = document.getElementById('newUserFullName').value.trim();
      const role = document.getElementById('newUserRole').value;
      const staff_name = document.getElementById('newUserStaff').value;
      const phone = document.getElementById('newUserPhone').value.trim();

      if (!username || !password || !full_name) {
        window.App.showToast('Please fill in username, password, and full name', 'warning');
        return;
      }

      try {
        await API.createUser({ username, password, full_name, role, staff_name, phone });
        window.App.showToast(`Worker account '${username}' created!`, 'success');
        this.openUserAccountsModal();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to create user', 'error');
      }
    }, 'Create Account');
  },

  async openEditUserModal(userId) {
    try {
      const users = await API.listUsers();
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const isAuthorityAccount = user.role === 'authority' || ['admin', 'bhagirath'].includes(user.username.toLowerCase());

      let staffList = [];
      try {
        staffList = await API.listStaff();
      } catch (e) {}

      const staffOptions = staffList.map(s => `
        <option value="${s.name}" ${s.name === user.staff_name ? 'selected' : ''}>
          ${s.name} (${s.role === 'cutting' ? 'Cutting Master' : 'Sewing Tailor'})
        </option>
      `).join('');

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Username (Login ID)</label>
            <input type="text" class="form-input" value="${user.username}" disabled style="background: #F5F2EB; font-weight: 700;">
          </div>
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="editUserFullName" class="form-input" value="${user.full_name}" required>
          </div>

          ${isAuthorityAccount ? `
            <div style="background: var(--card-warm); border: 1px solid var(--border); padding: 14px; border-radius: var(--radius-sm);">
              <div style="font-size: 12.5px; font-weight: 700; color: var(--rust); margin-bottom: 10px;">
                🔒 Authority Security: Changing password requires Old Password
              </div>
              <div class="form-group" style="margin-bottom: 10px;">
                <label class="form-label">Current (Old) Password</label>
                <input type="password" id="editUserOldPassword" class="form-input" placeholder="Enter current old password" autocomplete="current-password">
              </div>
              <div class="form-group" style="margin-bottom: 10px;">
                <label class="form-label">New Password</label>
                <input type="password" id="editUserNewPassword" class="form-input" placeholder="Enter new password" autocomplete="new-password">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Confirm New Password</label>
                <input type="password" id="editUserConfirmPassword" class="form-input" placeholder="Repeat new password" autocomplete="new-password">
              </div>
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Change Password (leave empty to keep current password)</label>
              <input type="password" id="editUserPassword" class="form-input" placeholder="Type new password if changing" autocomplete="new-password">
            </div>
          `}

          ${isAuthorityAccount ? `
            <div class="form-group">
              <label class="form-label">Role Tag Permission</label>
              <input type="text" class="form-input" value="👑 Authority (Permanent Studio Owner)" disabled style="background: #F5F2EB; font-weight: 700; color: var(--rust);">
              <input type="hidden" id="editUserRole" value="authority">
              <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">Role is permanent and cannot be changed by anyone.</div>
            </div>
          ` : `
            <div class="form-group">
              <label class="form-label">Role Tag Permission</label>
              <select id="editUserRole" class="form-select">
                <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>✂️ Employee (Craftsman Portal)</option>
                <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>💼 Manager (Operations - Cannot Add/Remove Workers)</option>
                <option value="authority" ${user.role === 'authority' ? 'selected' : ''}>👑 Authority (Studio Owner - Full Access & User Management)</option>
              </select>
            </div>
          `}
          <div class="form-group">
            <label class="form-label">Linked Workshop Staff Member</label>
            <select id="editUserStaff" class="form-select">
              <option value="">— None / Independent Account —</option>
              ${staffOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" id="editUserPhone" class="form-input" value="${user.phone || ''}">
          </div>
        </div>
      `;

      window.App.showCustomModal(`Edit Account: ${user.username}`, html, async () => {
        const full_name = document.getElementById('editUserFullName').value.trim();
        const role = document.getElementById('editUserRole').value;
        const staff_name = document.getElementById('editUserStaff').value;
        const phone = document.getElementById('editUserPhone').value.trim();

        const payload = { full_name, role, staff_name, phone };

        if (isAuthorityAccount) {
          const oldPwd = document.getElementById('editUserOldPassword')?.value || '';
          const newPwd = document.getElementById('editUserNewPassword')?.value || '';
          const confirmPwd = document.getElementById('editUserConfirmPassword')?.value || '';

          if (oldPwd || newPwd || confirmPwd) {
            if (!oldPwd) {
              window.App.showToast('Please enter your Old Password to change password', 'warning');
              return;
            }
            if (!newPwd || newPwd.length < 3) {
              window.App.showToast('New password must be at least 3 characters', 'warning');
              return;
            }
            if (newPwd !== confirmPwd) {
              window.App.showToast('New password and confirmation do not match', 'error');
              return;
            }
            payload.old_password = oldPwd;
            payload.password = newPwd;
          }
        } else {
          const password = document.getElementById('editUserPassword')?.value?.trim();
          if (password) payload.password = password;
        }

        try {
          await API.updateUser(userId, payload);
          window.App.showToast(`Worker '${user.username}' updated!`, 'success');
          this.openUserAccountsModal();
        } catch (err) {
          window.App.showToast(err.message || 'Failed to update user', 'error');
        }
      }, 'Save Changes');

    } catch (err) {
      window.App.showToast(err.message, 'error');
    }
  },

  async deleteUser(userId, username, role = '') {
    const isAuthority = role === 'authority' || ['admin', 'bhagirath'].includes((username || '').toLowerCase());

    if (isAuthority) {
      window.App.askPassword('secret_password', async (secretPassword) => {
        try {
          await API.deleteUser(userId, { secret_password: secretPassword });
          window.App.showToast(`Authority account '${username}' removed successfully`, 'success');
          this.openUserAccountsModal();
        } catch (err) {
          window.App.showToast(err.message || 'Failed to delete authority account', 'error');
        }
      }, `Enter Master Secret Password to delete Authority account '${username}':`);
      return;
    }

    if (!confirm(`Are you sure you want to delete worker account '${username}'?`)) return;
    try {
      await API.deleteUser(userId);
      window.App.showToast(`Worker account '${username}' removed`, 'info');
      this.openUserAccountsModal();
    } catch (err) {
      window.App.showToast(err.message || 'Failed to delete user', 'error');
    }
  }
};



/* === js/views/settings.js === */
/* ==========================================================================
   7 ART TAILORS - SETTINGS & SELF-HOSTED CONFIGURATION VIEW (SUITE)
   Matches Exact 8-Card Grid Layout & Locked Settings View
   ========================================================================== */

const SettingsView = {
  settings: {},
  isUnlocked: false,

  async loadSettings() {
    this.settings = await API.getSettings();
    return this.settings;
  },

  lockSettings() {
    this.isUnlocked = false;
    this.render(document.getElementById('viewport'));
  },

  async unlockSettings(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('settingsUnlockInput');
    const pwd = input?.value || '';

    if (!pwd) {
      window.App.showToast('Please enter admin password', 'warning');
      return;
    }

    try {
      const res = await API.verifyPassword('password', pwd);
      if (res.valid) {
        this.isUnlocked = true;
        window.App.showToast('Settings unlocked', 'info');
        this.render(document.getElementById('viewport'));
      } else {
        window.App.showToast('Incorrect password. Access denied.', 'error');
        if (input) input.value = '';
      }
    } catch (err) {
      window.App.showToast('Authentication failed: ' + (err.message || 'Incorrect password'), 'error');
      if (input) input.value = '';
    }
  },

  async render(container) {
    // -------------------------------------------------------------
    // 1. LOCKED SETTINGS VIEW (Matches Photo media_1794492316508_db9dd9cf.png)
    // -------------------------------------------------------------
    if (!this.isUnlocked) {
      container.innerHTML = `
        <div class="locked-settings-wrap">
          <div class="locked-settings-card">
            <div class="locked-icon-badge">
              <span>🔒</span>
            </div>
            <h2 class="locked-settings-title">Locked settings</h2>
            <p class="locked-settings-subtitle">Enter your password to change styles and rates.</p>

            <form onsubmit="SettingsView.unlockSettings(event)">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-weight: 700; color: #1F1A17; margin-bottom: 8px;">Password</label>
                <input type="password" id="settingsUnlockInput" class="form-input" 
                       placeholder="" autofocus autocomplete="current-password"
                       style="font-size: 15px; padding: 10px 12px; border: 1.5px solid #9C4528;">
              </div>

              <button type="submit" class="locked-unlock-btn">
                Unlock
              </button>
            </form>
          </div>
        </div>
      `;
      setTimeout(() => {
        document.getElementById('settingsUnlockInput')?.focus();
      }, 50);
      return;
    }

    // -------------------------------------------------------------
    // 2. UNLOCKED SETTINGS VIEW (Exact 8-Card Grid)
    // -------------------------------------------------------------
    await this.loadSettings();
    const isAuthority = App.currentUser?.role === 'authority';

    container.innerHTML = `
      <div class="settings-container">
        
        <!-- Header: Matches Exact Typography in Design Photo -->
        <div class="settings-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div class="settings-tag">ADMINISTRATION</div>
            <h1 class="settings-title">Settings</h1>
            <p class="settings-subtitle">Styles, rates, cloud sync and security</p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.lockSettings()">
            🔒 Lock Settings
          </button>
        </div>

        <!-- 9-Card Grid (Matching Luxury Crimson Atelier) -->
        <div class="settings-grid">
          
          <!-- Card 1: Tokens & Garments -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Tokens & Garments</h3>
                <p class="settings-card-desc">Shop name, token series, garment types, making charges, and bespoke measurement fields.</p>
              </div>
              <div class="settings-icon-badge">✂️</div>
            </div>
            <div>
              <button type="button" class="btn btn-primary btn-sm" onclick="SettingsView.openTokensGarmentsModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>⚙️</span> Configure Garments & Rates
              </button>
            </div>
          </div>

          <!-- Card 2: Personnel List -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Personnel List</h3>
                <p class="settings-card-desc">Every cutting master and sewing tailor, piece rates, and availability. Records are permanent.</p>
              </div>
              <div class="settings-icon-badge">👥</div>
            </div>
            <div>
              <button type="button" class="btn btn-primary btn-sm" onclick="ManageView.openPersonnelListModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>📋</span> Open Personnel List
              </button>
            </div>
          </div>

          <!-- Card 3: Cloud Sync -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Cloud Database Sync</h3>
                <p class="settings-card-desc">Connect Supabase cloud backend, test connectivity, and restore your studio database.</p>
              </div>
              <div class="settings-icon-badge">☁️</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openCloudSyncModal()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>☁️</span> Configure Cloud Sync
              </button>
            </div>
          </div>

          <!-- Card 4: Excel Sheet -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Excel Spreadsheet</h3>
                <p class="settings-card-desc">Download and open live orders spreadsheet workbook for offline review and accounts.</p>
              </div>
              <div class="settings-icon-badge">📊</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.href=API.getExcelDownloadUrl()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>📥</span> Download Excel (.xlsx)
              </button>
            </div>
          </div>

          <!-- Card 5: Sync Cloud Now -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Sync Cloud Now</h3>
                <p class="settings-card-desc">Upload local changes and download new orders immediately to/from the cloud server.</p>
              </div>
              <div class="settings-icon-badge">🔄</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.syncCloudNow()" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔄</span> Instant Cloud Sync
              </button>
            </div>
          </div>

          <!-- Card 6: Admin Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Admin Password</h3>
                <p class="settings-card-desc">Protects this Settings area and shop configuration. Change master admin password here.</p>
              </div>
              <div class="settings-icon-badge">🔑</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('password', 'Admin Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔑</span> Change Admin Password
              </button>
            </div>
          </div>

          <!-- Card 7: Delete Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Delete Password</h3>
                <p class="settings-card-desc">Asked whenever an order is deleted. Normal order edits require no password.</p>
              </div>
              <div class="settings-icon-badge">🗑️</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('delete_password', 'Delete Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🛡️</span> Change Delete Password
              </button>
            </div>
          </div>

          <!-- Card 8: Salary Password -->
          <div class="settings-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Salary Password</h3>
                <p class="settings-card-desc">Required before opening salary slips, settlement history, or recording cash advances.</p>
              </div>
              <div class="settings-icon-badge">💰</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('salary_password', 'Salary Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>🔒</span> Change Salary Password
              </button>
            </div>
          </div>

          <!-- Card 9: Secret Password -->
          <div class="settings-card" style="border-left: 3px solid var(--crimson);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <h3 class="settings-card-title">Secret Password</h3>
                <p class="settings-card-desc">Master authorization passcode required to delete or remove Authority studio owner accounts.</p>
              </div>
              <div class="settings-icon-badge">👑</div>
            </div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openChangePasswordModal('secret_password', 'Secret Password')" style="width: 100%; justify-content: center; padding: 9px 14px;">
                <span>👑</span> Change Secret Password
              </button>
            </div>
          </div>

          <!-- Card 10: Manage Logins & Workers -->
          <div class="settings-card" style="border-left: 3px solid var(--rust);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h3 class="settings-card-title" style="margin: 0;">Manage Logins</h3>
                <span class="badge" style="background: var(--gold-light); color: #7D4E0D; font-size: 10px;">AUTHORITY CONTROL</span>
              </div>
              <p class="settings-card-desc">Create worker logins, manage IDs and passwords, assign roles (Authority, Manager, Employee).</p>
            </div>
            <div>
              <button type="button" class="btn-settings-rust" onclick="ManageView.openUserAccountsModal()">
                Manage logins
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  // Proxy to ManageView for worker accounts
  openAddUserModal() { return ManageView.openAddUserModal(); },
  openEditUserModal(id) { return ManageView.openEditUserModal(id); },
  deleteUser(id, name) { return ManageView.deleteUser(id, name); },

  // =========================================================================
  // 1. Tokens & Garments Modal
  // =========================================================================
  async openTokensGarmentsModal() {
    await this.loadSettings();
    const s = this.settings;
    const garments = s.garments || {};

    const garmentsRows = Object.entries(garments).map(([name, info]) => `
      <tr data-garment="${name}">
        <td><strong>${name}</strong></td>
        <td>₹${PrintEngine.fmtMoney(info.rate || 0)}</td>
        <td style="color: var(--muted); font-size: 11px;">${(info.fields || 'Default').replace(/;/g, ', ')}</td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="btn btn-ghost btn-sm" onclick="SettingsView.openEditGarmentModal('${name}')">✏️ Edit</button>
          <button type="button" class="btn btn-ghost btn-sm" style="color: var(--red);" onclick="SettingsView.deleteGarment('${name}')">🗑️</button>
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="display: flex; flex-direction: column; gap: 20px; max-height: 75vh; overflow-y: auto; padding-right: 4px;">
        
        <!-- Studio Identity & Token Series -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <h4 style="font-family: var(--font-serif); font-size: 16px; margin: 0 0 12px 0; color: var(--ink);">Atelier Profile & Token Configuration</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div class="form-group">
              <label class="form-label">Shop / Atelier Name</label>
              <input type="text" id="mCfgShopName" class="form-input" value="${s.shop_name || '7 ART TAILORS'}">
            </div>
            <div class="form-group">
              <label class="form-label">Master Atelier Owner Name</label>
              <input type="text" id="mCfgOwnerName" class="form-input" value="${s.owner_name || 'BHAGIRATH SAINI'}">
            </div>
            <div class="form-group">
              <label class="form-label">Studio Phone / WhatsApp</label>
              <input type="text" id="mCfgShopPhone" class="form-input" value="${s.shop_phone || '+91 98290 12345'}">
            </div>
            <div class="form-group">
              <label class="form-label">Studio Address / Location</label>
              <input type="text" id="mCfgShopAddress" class="form-input" value="${s.shop_address || 'Main Market, Atelier Workshop'}">
            </div>
            <div class="form-group">
              <label class="form-label">Token Series Prefix</label>
              <input type="text" id="mCfgTokenPrefix" class="form-input" value="${s.token_prefix || '26'}">
            </div>
            <div class="form-group">
              <label class="form-label">Next Token Sequence Counter</label>
              <input type="number" id="mCfgTokenCounter" class="form-input" value="${s.token_counter || '1001'}">
            </div>
          </div>
        </div>

        <!-- Garment Types & Price Rates -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-family: var(--font-serif); font-size: 16px; margin: 0; color: var(--ink);">Garment Types & Base Rates</h4>
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.openAddGarmentModal()">+ Add Garment</button>
          </div>
          
          <div class="table-responsive">
            <table class="table-custom" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Garment</th>
                  <th>Base Rate (₹)</th>
                  <th>Measurement Sizing Fields</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${garmentsRows || '<tr><td colspan="4" style="text-align: center; color: var(--muted); padding: 14px;">No garments configured.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    window.App.showCustomModal('Tokens & Garments Configuration', html, async () => {
      const payload = {
        shop_name: document.getElementById('mCfgShopName').value.trim(),
        owner_name: document.getElementById('mCfgOwnerName').value.trim(),
        shop_phone: document.getElementById('mCfgShopPhone').value.trim(),
        shop_address: document.getElementById('mCfgShopAddress').value.trim(),
        token_prefix: document.getElementById('mCfgTokenPrefix').value.trim(),
        token_counter: parseInt(document.getElementById('mCfgTokenCounter').value || 100)
      };

      try {
        await API.saveSettings(payload);
        window.App.showToast('Tokens & Garments updated successfully!', 'success');
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to save settings', 'error');
      }
    }, 'Save Changes');
  },

  openEditGarmentModal(name) {
    const gInfo = this.settings.garments?.[name] || { rate: 0, fields: '' };
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Garment Name</label>
          <input type="text" class="form-input" value="${name}" disabled>
        </div>
        <div class="form-group">
          <label class="form-label">Base Tailoring Rate (₹)</label>
          <input type="number" id="editGarmentRate" class="form-input" value="${gInfo.rate}" min="0" step="any">
        </div>
        <div class="form-group">
          <label class="form-label">Measurement Fields (semicolon-separated)</label>
          <textarea id="editGarmentFields" class="form-textarea">${gInfo.fields || ''}</textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal(`Edit Garment: ${name}`, html, async () => {
      const rate = parseFloat(document.getElementById('editGarmentRate').value || 0);
      const fields = document.getElementById('editGarmentFields').value.trim();

      const updatedGarments = { ...this.settings.garments };
      updatedGarments[name] = { rate, fields };

      await API.saveSettings({ garments: updatedGarments });
      window.App.showToast(`Updated ${name} catalog entry!`, 'success');
      await this.loadSettings();
      this.openTokensGarmentsModal();
    }, 'Save Garment');
  },

  openAddGarmentModal() {
    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Garment Name *</label>
          <input type="text" id="newGarmentName" class="form-input" placeholder="e.g. Indo-Western Coat" required>
        </div>
        <div class="form-group">
          <label class="form-label">Base Tailoring Rate (₹) *</label>
          <input type="number" id="newGarmentRate" class="form-input" placeholder="1200" min="0" step="any" required>
        </div>
        <div class="form-group">
          <label class="form-label">Measurement Fields (semicolon-separated)</label>
          <textarea id="newGarmentFields" class="form-textarea" placeholder="Length;Chest;Waist;Shoulder;Sleeve"></textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal('+ Add New Garment', html, async () => {
      const name = document.getElementById('newGarmentName').value.trim();
      const rate = parseFloat(document.getElementById('newGarmentRate').value || 0);
      const fields = document.getElementById('newGarmentFields').value.trim();

      if (!name) {
        window.App.showToast('Please enter garment name', 'warning');
        return;
      }

      const updatedGarments = { ...this.settings.garments };
      updatedGarments[name] = { rate, fields };

      await API.saveSettings({ garments: updatedGarments });
      window.App.showToast(`Added ${name} to catalog!`, 'success');
      await this.loadSettings();
      this.openTokensGarmentsModal();
    }, 'Add Garment');
  },

  async deleteGarment(name) {
    if (!confirm(`Are you sure you want to remove '${name}' from garments?`)) return;
    const updatedGarments = { ...this.settings.garments };
    delete updatedGarments[name];
    await API.saveSettings({ garments: updatedGarments });
    window.App.showToast(`Removed ${name}`, 'info');
    await this.loadSettings();
    this.openTokensGarmentsModal();
  },

  // =========================================================================
  // 2. Cloud Sync Modal
  // =========================================================================
  async openCloudSyncModal() {
    await this.loadSettings();
    const s = this.settings;

    const supabaseSql = `create table if not exists orders (
  token text primary key,
  customer text,
  phone text,
  garments text,
  measurements text,
  notes text,
  order_date text,
  delivery_date text,
  status text,
  urgent boolean default false,
  total double precision default 0,
  advance double precision default 0,
  balance double precision default 0,
  pay_mode text default 'Pending',
  delivered_at text default '',
  cutting_master text default '',
  sewing_tailor text default '',
  work text default '[]',
  updated_at text
);

alter table orders enable row level security;
drop policy if exists "anon_all" on orders;
create policy "anon_all" on orders for all using (true) with check (true);

create table if not exists app_settings (
  key text primary key,
  value text
);
alter table app_settings enable row level security;
drop policy if exists "anon_all" on app_settings;
create policy "anon_all" on app_settings for all using (true) with check (true);

drop table if exists users cascade;

create table users (
  id bigint generated by default as identity,
  username text primary key,
  password text,
  full_name text,
  role text default 'employee',
  staff_name text,
  phone text,
  active boolean default true,
  last_login text,
  created_at text
);
alter table users enable row level security;
drop policy if exists "anon_all" on users;
create policy "anon_all" on users for all using (true) with check (true);

notify pgrst, 'reload schema';`;

    const html = `
      <div style="display: flex; flex-direction: column; gap: 18px; max-height: 75vh; overflow-y: auto; padding-right: 4px;">
        <div style="font-size: 13px; color: var(--muted); line-height: 1.5;">
          Connect your free Supabase cloud database to automatically backup all orders, customers, and atelier master settings in real-time.
        </div>

        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <h4 style="font-family: var(--font-serif); font-size: 15px; margin: 0 0 12px 0;">Supabase API Credentials</h4>
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Supabase Project URL</label>
            <input type="url" id="mCfgSupabaseUrl" class="form-input" placeholder="https://xyzcompany.supabase.co" value="${s.supabase_url || ''}">
          </div>

          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Supabase Anon Public API Key</label>
            <input type="text" id="mCfgSupabaseKey" class="form-input" placeholder="eyJhbGciOi..." value="${s.supabase_key || ''}">
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="mCfgSupabaseAutoSync" class="table-checkbox" ${s.supabase_auto_sync ? 'checked' : ''}>
              <span>Enable automatic background cloud synchronization</span>
            </label>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.testCloudConnection()">
              ⚡ Test Cloud Connection
            </button>
            <button type="button" class="btn btn-green btn-sm" onclick="SettingsView.syncCloudNow()">
              ☁️ Backup All Orders Now
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="SettingsView.restoreFromCloud()">
              📥 Restore Orders from Cloud
            </button>
          </div>
        </div>

        <!-- SQL Schema Setup Helper -->
        <div class="card" style="padding: 16px; background: var(--card-warm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="font-family: var(--font-serif); font-size: 15px; margin: 0;">Supabase SQL Table Setup</h4>
            <button type="button" class="btn btn-ghost btn-sm" onclick="SettingsView.copySql()">📋 Copy SQL</button>
          </div>
          <p style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">Run this SQL once in your Supabase SQL Editor:</p>
          <textarea id="supabaseSqlArea" class="form-textarea" style="font-family: monospace; font-size: 11px; height: 120px;" readonly>${supabaseSql}</textarea>
        </div>
      </div>
    `;

    window.App.showCustomModal('Cloud Sync & Supabase Setup', html, async () => {
      const payload = {
        supabase_url: document.getElementById('mCfgSupabaseUrl').value.trim(),
        supabase_key: document.getElementById('mCfgSupabaseKey').value.trim(),
        supabase_auto_sync: document.getElementById('mCfgSupabaseAutoSync').checked
      };

      try {
        await API.saveSettings(payload);
        window.App.showToast('Cloud sync settings saved successfully!', 'success');
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to save cloud settings', 'error');
      }
    }, 'Save Cloud Settings');
  },

  async testCloudConnection() {
    const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
    const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;

    if (!url || !key) {
      window.App.showToast('Please enter both Supabase URL and Key', 'warning');
      return;
    }

    window.App.showToast('Testing Supabase cloud connection...', 'info');
    try {
      const res = await API.testSupabase(url, key);
      if (res.success) {
        window.App.showToast(res.message, 'success');
      } else {
        window.App.showToast(res.message, 'error');
      }
    } catch (err) {
      window.App.showToast(err.message || 'Connection test failed', 'error');
    }
  },

  async restoreFromCloud() {
    if (!confirm('This will download orders from Supabase cloud into your local studio database. Proceed?')) return;
    window.App.showToast('Restoring orders from Supabase...', 'info');
    try {
      const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
      const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;
      const res = await API.restoreFromSupabase(url, key);
      window.App.showToast(res.message || 'Cloud restore completed!', 'success');
      if (window.App.currentPage === 'orders') {
        window.App.navigate('orders');
      }
    } catch (err) {
      window.App.showToast(err.message || 'Restore failed', 'error');
    }
  },

  copySql() {
    const area = document.getElementById('supabaseSqlArea');
    if (area) {
      navigator.clipboard.writeText(area.value);
      window.App.showToast('SQL schema copied to clipboard!', 'success');
    }
  },

  // =========================================================================
  // 3. Sync Cloud Now Action
  // =========================================================================
  async syncCloudNow() {
    await this.loadSettings();
    const url = document.getElementById('mCfgSupabaseUrl')?.value.trim() || this.settings.supabase_url;
    const key = document.getElementById('mCfgSupabaseKey')?.value.trim() || this.settings.supabase_key;

    if (!url || !key) {
      window.App.showToast('Please configure Supabase in Cloud Sync first.', 'warning');
      this.openCloudSyncModal();
      return;
    }

    window.App.showToast('☁️ Uploading orders to Supabase cloud...', 'info');
    try {
      const res = await API.syncSupabaseNow(url, key);
      if (res.success) {
        window.App.showToast(res.message || `☁️ Successfully backed up ${res.count || 0} orders to Supabase!`, 'success');
      } else {
        window.App.showToast(`Cloud backup error: ${res.message}`, 'error');
      }
    } catch (err) {
      window.App.showToast(`Sync failed: ${err.message}`, 'error');
    }
  },

  // =========================================================================
  // 4. Change Password Modal (Admin, Delete, or Salary Password)
  // =========================================================================
  openChangePasswordModal(key, title) {
    let purposeDesc = 'Opens this Settings area. Protects administrative configuration.';
    if (key === 'delete_password') {
      purposeDesc = 'Asked every time an order or batch is deleted. Editing an order needs no password.';
    } else if (key === 'salary_password') {
      purposeDesc = 'Asked before opening a salary slip, viewing salary history, or managing advance ledger.';
    } else if (key === 'secret_password') {
      purposeDesc = 'Master authorization password. This password is strictly required to delete or remove any Authority (Studio Owner) account.';
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="background: var(--card-warm); border: 1px solid var(--border); padding: 12px 14px; border-radius: var(--radius-sm); font-size: 12.5px; color: var(--muted); line-height: 1.5;">
          ${purposeDesc}
        </div>

        <div class="form-group">
          <label class="form-label">Current Admin Password (Required to authorize change)</label>
          <input type="password" id="chgCurrentAdminPwd" class="form-input" placeholder="Enter current admin password" autofocus autocomplete="off">
        </div>

        <div class="form-group">
          <label class="form-label">New ${title} *</label>
          <input type="password" id="chgNewPwd" class="form-input" placeholder="Enter new ${title.toLowerCase()}" autocomplete="new-password">
        </div>

        <div class="form-group">
          <label class="form-label">Confirm New ${title} *</label>
          <input type="password" id="chgConfirmPwd" class="form-input" placeholder="Repeat new ${title.toLowerCase()}" autocomplete="new-password">
        </div>
      </div>
    `;

    window.App.showCustomModal(`Change ${title}`, html, async () => {
      const currAdmin = document.getElementById('chgCurrentAdminPwd').value;
      const newPwd = document.getElementById('chgNewPwd').value;
      const confirmPwd = document.getElementById('chgConfirmPwd').value;

      if (!currAdmin) {
        window.App.showToast('Please enter your current admin password', 'warning');
        return;
      }
      if (!newPwd || newPwd.length < 3) {
        window.App.showToast('New password must be at least 3 characters', 'warning');
        return;
      }
      if (newPwd !== confirmPwd) {
        window.App.showToast('New password and confirmation do not match', 'error');
        return;
      }

      // Verify current admin password
      try {
        const verifyRes = await API.verifyPassword('password', currAdmin);
        if (!verifyRes.valid) {
          window.App.showToast('Current admin password incorrect. Authorization failed.', 'error');
          return;
        }

        // Save updated password
        await API.saveSettings({ [key]: newPwd });
        window.App.showToast(`✅ ${title} changed successfully!`, 'success');
        window.App.closeCustomModal();
        await this.loadSettings();
      } catch (err) {
        window.App.showToast(err.message || 'Failed to update password', 'error');
      }
    }, `Update ${title}`);
  }
};


/* === js/app.js === */
/* ==========================================================================
   7 ART TAILORS - ENTERPRISE STUDIO APP CONTROLLER (MULTI-DEVICE)
   ========================================================================== */

window.App = {
  currentPage: 'dashboard',
  currentUser: null,
  settings: {},
  networkInfo: null,
  routes: {
    dashboard: DashboardView,
    booking: BookingView,
    orders: OrdersView,
    customers: CustomersView,
    manage: ManageView,
    settings: SettingsView,
    'my-work': MyWorkView,
    login: LoginView
  },

  async init() {
    // 1. Check existing authenticated session
    const hasAuth = this.checkAuth();

    if (hasAuth && this.currentUser) {
      // User is already logged in: restore session, DO NOT show login window on reload!
      document.documentElement.classList.add('has-active-session');
      this.applyRolePermissions();
      this.startServerHeartbeat();
      this.startSmartAutoRefresh();
      const hash = window.location.hash.replace('#', '') || (this.currentUser.role === 'employee' ? 'my-work' : 'dashboard');
      this.navigate(hash);
    } else {
      // No active session: show login window
      document.documentElement.classList.remove('has-active-session');
      this.navigate('login');
    }

    // 2. Load remote settings & network info in background without blocking initial UI
    this.settings = {
      shop_name: "7 ART TAILORS",
      owner_name: "BHAGIRATH SAINI",
      token_prefix: "26"
    };
    API.getSettings().then(s => {
      if (s) {
        this.settings = s;
        this.updateHeaderBranding();
      }
    }).catch(e => console.warn("Using default settings", e));

    API.getNetworkInfo().then(info => {
      this.networkInfo = info;
    }).catch(() => {});

    this.bindGlobalNavigation();
    this.bindKeyboardShortcuts();
    this.registerPWA();
  },

  checkAuth() {
    const raw = localStorage.getItem('7art_user') || sessionStorage.getItem('7art_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u && (u.username || u.id)) {
          this.currentUser = u;
          return true;
        }
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.currentUser = null;
    return false;
  },

  onLoginSuccess(user) {
    this.currentUser = user;
    localStorage.setItem('7art_user', JSON.stringify(user));
    sessionStorage.setItem('7art_user', JSON.stringify(user));
    document.documentElement.classList.add('has-active-session');
    this.applyRolePermissions();
    this.startServerHeartbeat();
    this.startSmartAutoRefresh();
    this.showToast(`Signed in as ${user.full_name || user.username} (${user.role.toUpperCase()})`, 'success');
    
    if (user.role === 'employee') {
      this.navigate('my-work');
    } else {
      this.navigate('dashboard');
    }
  },

  confirmLogout() {
    if (!this.currentUser) return;
    this.showCustomModal('Sign Out of Studio', `
      <div style="text-align: center; padding: 10px 0;">
        <p style="font-size: 15px; color: var(--ink); margin-bottom: 6px;">
          Signed in as <strong>${this.currentUser.full_name}</strong> (${this.currentUser.role.toUpperCase()})
        </p>
        <p style="font-size: 13px; color: var(--muted);">
          Are you sure you want to sign out or switch accounts?
        </p>
      </div>
    `, async () => {
      this.logout();
    }, 'Sign Out');
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('7art_user');
    sessionStorage.removeItem('7art_user');
    document.documentElement.classList.remove('has-active-session');
    try { API.logout(); } catch(e) {}
    this.applyRolePermissions();
    this.navigate('login');
    this.showToast('You have been signed out', 'info');
  },

  applyRolePermissions() {
    const user = this.currentUser;
    const isAuth = user && user.role === 'authority';
    const isMgr = user && user.role === 'manager';
    const isEmp = user && user.role === 'employee';

    const myWorkNav = document.getElementById('navItemMyWork');
    const bookingNav = document.getElementById('navItemBooking');
    const manageNav = document.getElementById('navItemManage');
    const settingsNav = document.getElementById('navItemSettings');
    const newOrderBtn = document.getElementById('topBarNewOrderBtn');
    const topBarUserPill = document.getElementById('topBarUserPill');
    const sidebarAvatar = document.getElementById('sidebarUserAvatar');
    const sidebarName = document.getElementById('sidebarUserName');
    const sidebarRole = document.getElementById('sidebarUserRole');

    if (!user) {
      if (topBarUserPill) topBarUserPill.innerHTML = '';
      return;
    }

    if (topBarUserPill) {
      let badgeClass = 'role-badge-employee';
      let badgeIcon = '✂️';
      let tagText = 'Employee';

      if (isAuth) {
        badgeClass = 'role-badge-authority';
        badgeIcon = '👑';
        tagText = 'Authority';
      } else if (isMgr) {
        badgeClass = 'role-badge-manager';
        badgeIcon = '💼';
        tagText = 'Manager';
      }

      topBarUserPill.innerHTML = `
        <span class="role-badge ${badgeClass}" style="cursor: pointer;" onclick="App.confirmLogout()" title="Click to Sign Out">
          <span>${badgeIcon}</span> ${user.full_name || user.username} (${tagText})
        </span>
      `;
    }

    if (sidebarName) sidebarName.innerText = user.full_name || user.username;
    if (sidebarRole) {
      if (isAuth) {
        sidebarRole.innerText = 'Master Atelier Authority';
      } else if (isMgr) {
        sidebarRole.innerText = 'Studio Operations Manager';
      } else {
        sidebarRole.innerText = user.staff_name ? `${user.staff_name.toUpperCase()} · Craftsman` : 'Employee';
      }
    }
    if (sidebarAvatar) {
      const initials = (user.full_name || user.username).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      sidebarAvatar.innerText = initials || '7A';
    }

    // Role visibility
    const dashboardNav = document.getElementById('navItemDashboard');
    const ordersNav = document.getElementById('navItemOrders');
    const customersNav = document.getElementById('navItemCustomers');

    const mobMyWork = document.getElementById('mobileNavMyWork');
    const mobDashboard = document.getElementById('mobileNavDashboard');
    const mobBooking = document.getElementById('mobileNavBooking');
    const mobOrders = document.getElementById('mobileNavOrders');
    const mobCustomers = document.getElementById('mobileNavCustomers');
    const mobManage = document.getElementById('mobileNavManage');
    const mobSettings = document.getElementById('mobileNavSettings');
    const mobLogout = document.getElementById('mobileNavLogout');

    if (isEmp) {
      // Desktop Sidebar
      if (myWorkNav) myWorkNav.style.display = 'flex';
      if (dashboardNav) dashboardNav.style.display = 'none';
      if (bookingNav) bookingNav.style.display = 'none';
      if (ordersNav) ordersNav.style.display = 'none';
      if (customersNav) customersNav.style.display = 'none';
      if (manageNav) manageNav.style.display = 'none';
      if (settingsNav) settingsNav.style.display = 'none';
      if (newOrderBtn) newOrderBtn.style.display = 'none';

      // Mobile Bottom Nav: dedicated bench portal & sign out
      if (mobMyWork) mobMyWork.style.display = 'flex';
      if (mobLogout) mobLogout.style.display = 'flex';
      if (mobDashboard) mobDashboard.style.display = 'none';
      if (mobBooking) mobBooking.style.display = 'none';
      if (mobOrders) mobOrders.style.display = 'none';
      if (mobCustomers) mobCustomers.style.display = 'none';
      if (mobManage) mobManage.style.display = 'none';
      if (mobSettings) mobSettings.style.display = 'none';
    } else {
      // Authority & Manager have full studio access
      if (myWorkNav) myWorkNav.style.display = 'none';
      if (dashboardNav) dashboardNav.style.display = 'flex';
      if (bookingNav) bookingNav.style.display = 'flex';
      if (ordersNav) ordersNav.style.display = 'flex';
      if (customersNav) customersNav.style.display = 'flex';
      if (manageNav) manageNav.style.display = 'flex';
      if (settingsNav) settingsNav.style.display = 'flex';
      if (newOrderBtn) newOrderBtn.style.display = 'inline-flex';

      // Mobile Bottom Nav
      if (mobMyWork) mobMyWork.style.display = 'none';
      if (mobLogout) mobLogout.style.display = 'none';
      if (mobDashboard) mobDashboard.style.display = 'flex';
      if (mobBooking) mobBooking.style.display = 'flex';
      if (mobOrders) mobOrders.style.display = 'flex';
      if (mobCustomers) mobCustomers.style.display = 'flex';
      if (mobManage) mobManage.style.display = 'flex';
      if (mobSettings) mobSettings.style.display = 'flex';
    }
  },

  registerPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch((err) => {
          console.log('SW registration note:', err.message);
        });
      });
    }
  },

  updateHeaderBranding() {
    const shopName = this.settings.shop_name || "7 ART TAILORS";
    const ownerName = this.settings.owner_name || "BHAGIRATH SAINI";

    document.querySelectorAll('.app-brand-title').forEach(el => el.innerText = shopName);
    document.querySelectorAll('.owner-name-display').forEach(el => el.innerText = ownerName);
  },

  bindGlobalNavigation() {
    // Desktop Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Mobile Bottom Nav Links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Mobile hamburger menu toggle
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Sidebar collapse toggle
    const collapseBtn = document.getElementById('collapseSidebarBtn');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
  },

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+N / Cmd+N for New Order
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (this.currentUser?.role === 'authority') {
          this.navigate('booking');
        }
      }
      // Esc to close active modals
      if (e.key === 'Escape') {
        this.closeCustomModal();
        this.closePrintModal();
      }
    });
  },

  navigate(pageKey, params = {}) {
    if (!this.currentUser && pageKey !== 'login') {
      pageKey = 'login';
    }

    // Role guard: employees strictly restricted to my-work portal
    if (this.currentUser?.role === 'employee') {
      if (pageKey !== 'login' && pageKey !== 'my-work') {
        pageKey = 'my-work';
      }
    }

    if (!this.routes[pageKey]) pageKey = this.currentUser?.role === 'employee' ? 'my-work' : 'dashboard';
    this.currentPage = pageKey;
    if (pageKey !== 'login') {
      window.location.hash = pageKey;
    }

    // Update active nav class (Sidebar)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === pageKey);
    });

    // Update active nav class (Mobile Bottom Nav)
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageKey);
    });

    // Close mobile drawer if open
    document.querySelector('.app-sidebar')?.classList.remove('mobile-open');

    // Toggle chrome for login vs app pages
    const isLogin = pageKey === 'login';
    document.querySelector('.app-sidebar')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.top-bar')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.mobile-bottom-nav')?.classList.toggle('hide-for-login', isLogin);
    document.querySelector('.app-container')?.classList.toggle('login-mode', isLogin);

    // Update top bar title
    const titles = {
      dashboard: { title: "Dashboard", sub: "Atelier Summary & Alerts", badge: "OVERVIEW" },
      booking: { title: "Order Booking", sub: "Counter Registration & Craft Sizing", badge: "NEW ORDER" },
      orders: { title: "Orders Pipeline", sub: "Production Management & Tracking", badge: "WORKSHOP" },
      customers: { title: "Customers Directory", sub: "Client Records & Ledger", badge: "CLIENTS" },
      manage: { title: "Personnel & Team", sub: "Cutting Masters & Sewing Tailors", badge: "MANAGEMENT" },
      settings: { title: "Studio Settings", sub: "System Configuration & Cloud", badge: "SETTINGS" },
      'my-work': { title: "Craftsman Portal", sub: "Assigned Cutting & Sewing Pieces", badge: "BENCH WORK" },
      login: { title: "Studio Sign In", sub: "Staff & Authority Authentication", badge: "LOGIN" }
    };

    const info = titles[pageKey] || titles.dashboard;
    const titleEl = document.getElementById('topBarTitle');
    const subEl = document.getElementById('topBarSubtitle');
    const badgeEl = document.getElementById('topBarBadge');

    if (titleEl) titleEl.innerText = info.title;
    if (subEl) subEl.innerText = info.sub;
    if (badgeEl) badgeEl.innerText = info.badge;

    // Render View with smooth fade
    const viewport = document.getElementById('viewport');
    if (viewport) {
      viewport.style.opacity = '0.7';
      viewport.style.transform = 'translateY(4px)';
      setTimeout(() => {
        try {
          this.routes[pageKey].render(viewport, params);
        } catch (renderErr) {
          console.error(`Error rendering page ${pageKey}:`, renderErr);
          viewport.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px; color: var(--red); max-width: 500px; margin: 40px auto;">
              <h3>Unable to Display Page</h3>
              <p style="margin-top: 8px; color: var(--muted);">${renderErr.message}</p>
              <button class="btn btn-primary" style="margin-top: 16px;" onclick="window.location.reload()">Reload Application</button>
            </div>
          `;
        }
        viewport.style.transition = 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
        viewport.style.opacity = '1';
        viewport.style.transform = 'translateY(0)';
      }, 50);
    }
  },

  startServerHeartbeat() {
    const checkServer = async () => {
      if (document.hidden) return; // Do not waste mobile battery/network when screen is off
      const dot = document.getElementById('sidebarEngineStatusDot');
      const text = document.getElementById('sidebarEngineStatusText');
      const pill = document.getElementById('sidebarEngineStatusPill');
      if (!dot || !text) return;

      try {
        await fetch('/api/network-info', { method: 'GET', signal: AbortSignal.timeout(3000) });
        dot.style.background = 'var(--green)';
        text.innerText = 'Local Studio Engine Active';
        if (pill) pill.title = 'Studio Engine is running smoothly (Click for details)';
      } catch (err) {
        dot.style.background = 'var(--red)';
        text.innerText = 'Studio Server Offline';
        if (pill) pill.title = 'Cannot connect to server on port 5000. Click to diagnose.';
      }
    };

    checkServer();
    setInterval(checkServer, 25000);
  },

  // Intelligent Non-Disruptive Background Auto-Sync
  startSmartAutoRefresh() {
    if (this._smartRefreshTimer) clearInterval(this._smartRefreshTimer);

    this._smartRefreshTimer = setInterval(async () => {
      // 1. Skip if user is not authenticated or tab is in background (saves mobile data/battery)
      if (!this.currentUser || document.hidden) return;

      // 2. SAFETY: Never refresh if ANY modal dialog is open (Print Slip, Settle, Edit, Settings, etc.)
      const modalOpen = document.querySelector('.modal-overlay.active');
      if (modalOpen) return;

      // 3. SAFETY: Never refresh if an input, textarea, or select is currently being edited
      const activeEl = document.activeElement;
      if (activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
        return;
      }

      // 4. CRITICAL SAFETY: Counter / Booking view protection
      const curPage = this.currentPage || window.location.hash.replace('#', '') || 'dashboard';
      if (curPage === 'booking' || curPage === 'counter') {
        // If user has ANY customer info, notes, selected garments, or measurements entered:
        if (typeof BookingView !== 'undefined' && BookingView.hasUnsavedWork && BookingView.hasUnsavedWork()) {
          return; // DO NOT TOUCH THE BOOKING FORM!
        }
        return; // Keep counter form stable even if blank to prevent token input flicker
      }

      // 5. Intelligent silent in-place refresh per active page:
      try {
        if (curPage === 'dashboard' && typeof DashboardView !== 'undefined' && DashboardView.render) {
          const vp = document.getElementById('viewport');
          if (vp) await DashboardView.render(vp);
        } else if (curPage === 'orders' && typeof OrdersView !== 'undefined' && OrdersView.loadOrders) {
          // If no order checkboxes are checked, silently update table
          if (!OrdersView.selectedTokens || OrdersView.selectedTokens.size === 0) {
            await OrdersView.loadOrders();
          }
        } else if (curPage === 'my-work' && typeof MyWorkView !== 'undefined' && MyWorkView.loadPieces) {
          await MyWorkView.loadPieces();
        }
      } catch (err) {
        console.debug('[Smart Refresh Note]', err);
      }
    }, 25000);
  },

  async openStudioStatusModal() {
    let isOnline = false;
    let latency = null;
    let net = this.networkInfo || {};

    const t0 = performance.now();
    try {
      const res = await fetch('/api/network-info', { method: 'GET', signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        isOnline = true;
        latency = Math.round(performance.now() - t0);
        net = await res.json();
        this.networkInfo = net;
      }
    } catch (e) {
      isOnline = false;
    }

    const port = net.port || 5000;
    const wifiIp = net.primary_wifi || (net.wifi_ips && net.wifi_ips[0]) || '127.0.0.1';
    const tailscaleIp = net.primary_tailscale || (net.tailscale_ips && net.tailscale_ips[0]) || '100.99.162.118';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Status Banner -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-radius: var(--radius-md); background: ${isOnline ? '#F0F9F4' : '#FDF2F2'}; border: 1.5px solid ${isOnline ? 'var(--green)' : 'var(--red)'};">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 26px;">${isOnline ? '🟢' : '🔴'}</span>
            <div>
              <div style="font-size: 16px; font-weight: 700; color: ${isOnline ? 'var(--green-dark)' : 'var(--red)'};">
                ${isOnline ? 'Local Studio Engine Active' : 'Studio Engine Disconnected'}
              </div>
              <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                ${isOnline ? `Python Web Server responding in ${latency}ms on port ${port}` : 'Python server process on port 5000 is not reachable'}
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="App.openStudioStatusModal()">
            🔄 Test Again
          </button>
        </div>

        ${!isOnline ? `
          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; font-size: 13px; line-height: 1.6;">
            <div style="font-weight: 700; color: var(--rust); margin-bottom: 6px;">How to start your Local Studio Server:</div>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Open folder: <code>d:\\art\\arts\\7art_studio_suite</code></li>
              <li>Double-click <strong>start_studio.bat</strong></li>
              <li>Keep the black terminal window open in the background.</li>
              <li>Click <strong>Test Again</strong> above once the window opens!</li>
            </ol>
          </div>
        ` : `
          <!-- System Details Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="background: var(--card-warm); padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Database Engine</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 4px;">Isolated SQLite WAL</div>
              <div style="font-size: 11px; color: var(--green); margin-top: 2px;">✔ studio.db active & healthy</div>
            </div>
            <div style="background: var(--card-warm); padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Active Account</div>
              <div style="font-size: 14px; font-weight: 700; color: var(--ink); margin-top: 4px;">${this.currentUser ? this.currentUser.full_name : 'Guest'}</div>
              <div style="font-size: 11px; color: var(--rust); margin-top: 2px;">Role: ${this.currentUser ? this.currentUser.role.toUpperCase() : 'None'}</div>
            </div>
          </div>

          <!-- Network Addresses -->
          <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px;">
            <div style="font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 10px;">Available Connection Points:</div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>💻 <strong>This PC:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://localhost:${port}</code>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🏠 <strong>Workshop Wi-Fi:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://${wifiIp}:${port}</code>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🌍 <strong>Tailscale Anywhere:</strong></span>
                <code style="background: var(--sidebar); padding: 2px 8px; border-radius: 4px;">http://${tailscaleIp}:${port}</code>
              </div>
              ${net.tunnel_url ? `
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 2px;">
                <span>🚀 <strong>Public Anywhere:</strong></span>
                <a href="${net.tunnel_url}" target="_blank" style="background: #E8F5E9; color: #1B5E20; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-family: var(--font-mono); text-decoration: none;">
                  ${net.tunnel_url}
                </a>
              </div>
              ` : `
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 2px; color: var(--muted); font-size: 12px;">
                <span>🚀 <strong>Public Anywhere:</strong></span>
                <span>Connecting background tunnel...</span>
              </div>
              `}
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn btn-green btn-sm" onclick="App.openMobileConnectModal()">
              📱 Connect Phones / Tablets (QR)
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.href=API.getExcelDownloadUrl()">
              📊 Download Live Excel
            </button>
          </div>
        `}
      </div>
    `;

    this.showCustomModal('7 Art Tailors — Studio Engine Status', html, null, 'Close');
  },

  // Helper for generating vector offline QR codes with zero external dependency
  getQrSvgOrImg(url, size = 160) {
    if (!url) return '';
    if (typeof qrcode !== 'undefined') {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        const svg = qr.createSvgTag({ scalable: true, margin: 2, cellSize: 4 });
        return `<div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: white;">${svg}</div>`;
      } catch (e) {
        console.warn('Local QR generator note:', e);
      }
    }
    const onlineImg = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
    return `<img src="${onlineImg}" alt="QR" width="${size}" height="${size}" style="display: block;" onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'padding: 12px; font-family: var(--font-mono); font-size: 13px; font-weight: bold; color: var(--rust); word-break: break-all;\\'>${url}</div>';">`;
  },

  // Mobile / Tablet & Anywhere Connection Modal
  async openMobileConnectModal() {
    try {
      this.networkInfo = await API.getNetworkInfo();
    } catch (e) {}

    const port = this.networkInfo?.port || 5000;
    const wifiIps = this.networkInfo?.wifi_ips || [];
    const tailscaleIps = this.networkInfo?.tailscale_ips || [];
    const primaryWifi = wifiIps[0] || window.location.hostname;
    const primaryTailscale = tailscaleIps[0] || '100.99.162.118';
    const rawTunnel = this.networkInfo?.tunnel_url || '';
    const tunnelUrl = (rawTunnel && !rawTunnel.includes('admin.localhost.run') && !rawTunnel.startsWith('https://localhost.run')) ? rawTunnel : null;

    const wifiUrl = `http://${primaryWifi}:${port}`;
    const tailscaleUrl = `http://${primaryTailscale}:${port}`;

    const qrWifi = this.getQrSvgOrImg(wifiUrl, 160);
    const qrTailscale = this.getQrSvgOrImg(tailscaleUrl, 160);
    const qrTunnel = tunnelUrl ? this.getQrSvgOrImg(tunnelUrl, 160) : '';

    const html = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Tab Buttons -->
        <div class="network-tab-buttons">
          <button type="button" class="network-tab-btn active" id="netTabWifiBtn" onclick="App.switchNetTab('wifi')">
            <span>🏠</span> 1. Shop Wi-Fi (Local)
          </button>
          <button type="button" class="network-tab-btn" id="netTabTunnelBtn" onclick="App.switchNetTab('tunnel')">
            <span>🚀</span> 2. Online Anywhere (Public Link)
          </button>
          <button type="button" class="network-tab-btn" id="netTabTailscaleBtn" onclick="App.switchNetTab('tailscale')">
            <span>🛡️</span> 3. Tailscale Mesh
          </button>
        </div>

        <!-- TAB 1: Local Wi-Fi -->
        <div id="netTabWifi" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          <p style="font-size: 13px; color: var(--muted); margin: 0; max-width: 440px;">
            Fastest speed, <strong>100% offline</strong> with zero internet required. Connect phone/tablet to the workshop Wi-Fi:
          </p>

          <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
            ${qrWifi}
          </div>

          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">In-Shop Wi-Fi Web Address</div>
            <a href="${wifiUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--rust); text-decoration: none;">
              ${wifiUrl}
            </a>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="App.copyToClipboard('${wifiUrl}', 'Wi-Fi Address Copied!')">
              📋 Copy Wi-Fi Link
            </button>
          </div>

          <div style="font-size: 11px; color: var(--muted);">
            💡 <strong>Phone Tip:</strong> In Chrome or Safari, tap <strong>"Add to Home Screen"</strong> to use as a full-screen app!
          </div>

          <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: var(--radius-sm); padding: 12px; width: 100%; text-align: left; font-size: 12px; color: #5D4037; line-height: 1.5;">
            <strong>⚠️ Phone says "Site can't be reached" or connection times out?</strong>
            <ul style="margin: 6px 0 0 16px; padding: 0;">
              <li>Ensure your phone is connected to the <strong>exact same Wi-Fi router</strong> as this computer (not mobile data).</li>
              <li>Windows Firewall blocks inbound port 5000 until permitted.</li>
            </ul>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top: 10px; width: 100%; justify-content: center; font-weight: 700;" onclick="App.triggerFirewallFix()">
              🛡️ 1-Click: Unlock Windows Firewall &amp; Wi-Fi
            </button>
          </div>
        </div>

        <!-- TAB 2: Zero-Password Public Worldwide Tunnel Link -->
        <div id="netTabTunnel" style="display: none; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          ${tunnelUrl ? `
            <div style="background: #E8F5E9; border: 1px solid #81C784; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #1B5E20; text-align: left; width: 100%;">
              <strong>🟢 Worldwide Online Public Link Active:</strong> Open on ANY phone or tablet worldwide. No VPN or app install needed. Works directly on 4G/5G mobile data!
            </div>

            <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
              ${qrTunnel}
            </div>

            <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Worldwide HTTPS Web Address</div>
              <a href="${tunnelUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: #1B5E20; text-decoration: none; word-break: break-all;">
                ${tunnelUrl}
              </a>
            </div>

            <div style="display: flex; gap: 8px; justify-content: center; width: 100%;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="App.copyToClipboard('${tunnelUrl}', 'Public HTTPS Link Copied!')">
                📋 Copy Public Link
              </button>
              <button type="button" class="btn btn-ghost btn-sm" onclick="App.refreshTunnelModal()">
                🔄 Refresh Link
              </button>
            </div>

            <div style="text-align: left; font-size: 12px; color: var(--muted); background: white; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; width: 100%; line-height: 1.6;">
              <strong>Atelier Sign-In from Mobile:</strong><br>
              • Authority Owner: <code>bhagirath</code> / <code>admin</code><br>
              • Workers log in using their assigned ID & Password directly in their mobile browser.
            </div>
          ` : `
            <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 24px 16px; width: 100%;">
              <div style="font-size: 26px; animation: spin 1s infinite linear; margin-bottom: 8px;">⏳</div>
              <div style="font-weight: 700; font-size: 15px; color: var(--ink);">Connecting Worldwide Public Tunnel...</div>
              <p style="font-size: 13px; color: var(--muted); margin-top: 6px; max-width: 400px; margin-left: auto; margin-right: auto;">
                Establishing zero-password public HTTPS tunnel in the background. It takes 3 to 5 seconds upon studio launch.
              </p>
              <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 14px;" onclick="App.refreshTunnelModal()">
                🔄 Check Live Status Now
              </button>
            </div>
          `}
        </div>

        <!-- TAB 3: Tailscale Anywhere -->
        <div id="netTabTailscale" style="display: none; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          <div style="background: var(--gold-light); border: 1px solid rgba(197,139,58,0.4); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #7D4E0D; text-align: left; width: 100%;">
            <strong>🛡️ Tailscale Encrypted Mesh:</strong> Dedicated private network between your devices without public URLs.
          </div>

          <div style="background: white; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; justify-content: center; align-items: center;">
            ${qrTailscale}
          </div>

          <div style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; width: 100%;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 700;">Worldwide Tailscale Address</div>
            <a href="${tailscaleUrl}" target="_blank" style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: #7D4E0D; text-decoration: none;">
              ${tailscaleUrl}
            </a>
          </div>

          <div style="text-align: left; font-size: 12px; color: var(--muted); background: white; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; width: 100%; line-height: 1.6;">
            <strong>Quick Setup (Takes 1 minute & 100% Free):</strong><br>
            1. Install free <strong>Tailscale</strong> app on your iPhone, Android, or laptop.<br>
            2. Sign in with the same account as this host machine.<br>
            3. Open <code>${tailscaleUrl}</code> on your device from anywhere on Earth!
          </div>

          <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: var(--radius-sm); padding: 12px; width: 100%; text-align: left; font-size: 12px; color: #5D4037; line-height: 1.5;">
            <strong>⚠️ Tailscale checklist if not opening:</strong>
            <ul style="margin: 6px 0 0 16px; padding: 0;">
              <li>The free <strong>Tailscale app</strong> must be active &amp; Connected on your phone.</li>
              <li>Your phone must be signed in to the <strong>same Tailscale account</strong> as this PC.</li>
              <li>Windows Firewall must allow port 5000 on the Tailscale network interface.</li>
            </ul>
            <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 10px; width: 100%; justify-content: center;" onclick="App.triggerFirewallFix()">
              🛡️ Unlock Windows Firewall for Tailscale
            </button>
          </div>
        </div>

      </div>
    `;

    this.showCustomModal('📱 Connect Devices & Online Anywhere', html, null, 'Close');

    if (!tunnelUrl) {
      if (this._tunnelPollTimer) clearInterval(this._tunnelPollTimer);
      this._tunnelPollTimer = setInterval(async () => {
        try {
          const net = await API.getNetworkInfo();
          if (net && net.tunnel_url && !net.tunnel_url.includes('admin.localhost.run') && !net.tunnel_url.startsWith('https://localhost.run')) {
            clearInterval(this._tunnelPollTimer);
            this._tunnelPollTimer = null;
            this.networkInfo = net;
            const modalTitle = document.querySelector('#customModal .modal-title');
            if (modalTitle && modalTitle.innerText.includes('Connect Devices')) {
              this.openMobileConnectModal();
              this.switchNetTab('tunnel');
            }
          }
        } catch(e) {}
      }, 2500);
    } else {
      if (this._tunnelPollTimer) {
        clearInterval(this._tunnelPollTimer);
        this._tunnelPollTimer = null;
      }
    }
  },

  async refreshTunnelModal() {
    try {
      this.networkInfo = await API.getNetworkInfo();
      this.openMobileConnectModal();
      this.switchNetTab('tunnel');
    } catch(e) {}
  },

  async triggerFirewallFix() {
    try {
      this.showToast('Launching Firewall unlock tool... Please click YES on the Windows prompt on your PC screen!', 'info');
      const res = await API.fixFirewall();
      if (res && res.message) {
        this.showToast(res.message, 'success');
      }
    } catch (err) {
      this.showToast('Please right-click "fix_wifi_and_tailscale.bat" on your PC and run as Administrator.', 'warning');
    }
  },

  copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMsg, 'success');
      }).catch(() => {
        this.showToast('Please copy manually: ' + text, 'info');
      });
    } else {
      this.showToast('Please copy manually: ' + text, 'info');
    }
  },

  switchNetTab(tab) {
    const tabs = ['wifi', 'tailscale', 'tunnel'];
    tabs.forEach(t => {
      const btn = document.getElementById(`netTab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
      const content = document.getElementById(`netTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle('active', t === tab);
      if (content) content.style.display = (t === tab) ? 'flex' : 'none';
    });
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✔';
    if (type === 'error') icon = '✗';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  // Custom Modal
  showCustomModal(title, bodyHtml, onConfirm = null, confirmText = 'Save', size = null) {
    const overlay = document.getElementById('customModalOverlay');
    const cardEl = overlay?.querySelector('.modal-card');
    const titleEl = document.getElementById('customModalTitle');
    const bodyEl = document.getElementById('customModalBody');
    const confirmBtn = document.getElementById('customModalConfirmBtn');

    if (cardEl) {
      cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      if (size === 'lg') cardEl.classList.add('modal-card-lg');
      else if (size === 'xl') cardEl.classList.add('modal-card-xl');
    }

    titleEl.innerText = title;
    bodyEl.innerHTML = bodyHtml;

    if (onConfirm) {
      confirmBtn.style.display = 'inline-flex';
      confirmBtn.innerText = confirmText;
      confirmBtn.onclick = async () => {
        await onConfirm();
        overlay.classList.remove('active');
        if (cardEl) cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      };
    } else {
      confirmBtn.style.display = 'none';
    }

    overlay.classList.add('active');
  },

  closeCustomModal() {
    if (this._tunnelPollTimer) {
      clearInterval(this._tunnelPollTimer);
      this._tunnelPollTimer = null;
    }
    const overlay = document.getElementById('customModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      const cardEl = overlay.querySelector('.modal-card');
      if (cardEl) cardEl.classList.remove('modal-card-lg', 'modal-card-xl');
      const footerEl = overlay.querySelector('.modal-footer');
      if (footerEl) footerEl.style.display = '';
    }
  },

  // Password Prompt Modal
  askPassword(key = 'password', onValid, customTitle = null, customPrompt = null) {
    let title = customTitle || 'Admin Authentication Required';
    let promptText = customPrompt || 'Please enter administrative password to continue:';

    if (key === 'delete_password') {
      title = customTitle || '🗑️ Delete Password Required';
      promptText = customPrompt || 'Asked every time an order is deleted. Please enter delete password:';
    } else if (key === 'salary_password') {
      title = customTitle || '💰 Salary Password Required';
      promptText = customPrompt || 'Asked before opening a salary slip, salary history or Manage advance. Enter salary password:';
    }

    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="font-size: 13px; color: var(--muted);">${promptText}</p>
        <input type="password" id="modalPasswordInput" class="form-input" placeholder="Enter password" autofocus style="font-size: 16px;">
      </div>
    `;

    this.showCustomModal(title, html, async () => {
      const pwd = document.getElementById('modalPasswordInput').value;
      try {
        const res = await API.verifyPassword(key, pwd);
        if (res.valid) {
          onValid(pwd);
        } else {
          this.showToast('Incorrect password. Access denied.', 'error');
        }
      } catch (err) {
        this.showToast('Authentication failed: ' + (err.message || 'Incorrect password'), 'error');
      }
    }, 'Authenticate');
  },

  setPrintPageSize(size = 'A6') {
    this.printPageSize = size;
    let styleEl = document.getElementById('dynamicPrintPageSizeStyle');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamicPrintPageSizeStyle';
      document.head.appendChild(styleEl);
    }
    let sizeCss = 'A6 portrait';
    let marginCss = '4mm 6mm';
    if (size === 'A4') {
      sizeCss = 'A4 portrait';
      marginCss = '10mm 12mm';
    } else if (size === 'A5') {
      sizeCss = 'A5 portrait';
      marginCss = '6mm 8mm';
    } else if (size === 'Thermal80') {
      sizeCss = '80mm auto';
      marginCss = '2mm 3mm';
    } else if (size === 'Thermal58') {
      sizeCss = '58mm auto';
      marginCss = '2mm 2mm';
    } else {
      sizeCss = 'A6 portrait';
      marginCss = '4mm 6mm';
    }
    styleEl.innerHTML = `@media print { @page { size: ${sizeCss} !important; margin: ${marginCss} !important; } }`;
  },

  // Print Station Modal (Matching Image 3 & Image 4)
  async openPrintModal(tokens = []) {
    if (tokens.length === 0) return;
    const orders = [];
    for (const t of tokens) {
      const o = await API.getOrder(t);
      if (o) orders.push(o);
    }
    if (orders.length === 0) return;

    this.setPrintPageSize(this.printPageSize || 'A6');

    const first = orders[0];
    const overlay = document.getElementById('printModalOverlay');
    const bodyEl = document.getElementById('printModalBody');

    let totalPieces = 0;
    orders.forEach(o => {
      let gList = o.garments;
      if (typeof gList === 'string') {
        try { gList = JSON.parse(gList); } catch (e) { gList = []; }
      }
      if (!Array.isArray(gList)) gList = [];
      const pieces = gList.reduce((acc, g) => acc + (parseInt(g?.qty) || 1), 0);
      totalPieces += pieces;
    });

    bodyEl.innerHTML = `
      <div style="display: grid; grid-template-columns: 290px 1fr; gap: 20px; min-height: 520px;">
        <div class="print-options-panel no-print" style="background: var(--card-warm); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 14px;">
              WHAT TO PRINT
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                <input type="checkbox" id="prCustSlip" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                <span>Customer slip</span>
              </label>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                  <input type="checkbox" id="prClothTag" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                  <span>Uncut cloth tag</span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);">
                  <span>Copies</span>
                  <input type="number" id="prTagCopies" value="1" min="1" max="10" style="width: 44px; padding: 2px 4px; text-align: center; border: 1px solid var(--border-subtle); border-radius: 4px; font-weight: 600; color: var(--ink); background: white;" onchange="App.refreshPrintPreview()">
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; color: var(--ink);">
                  <input type="checkbox" id="prJobCard" checked class="table-checkbox" onchange="App.refreshPrintPreview()">
                  <span>Master job card</span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);">
                  <span>Copies</span>
                  <input type="number" id="prJobCopies" value="1" min="1" max="10" style="width: 44px; padding: 2px 4px; text-align: center; border: 1px solid var(--border-subtle); border-radius: 4px; font-weight: 600; color: var(--ink); background: white;" onchange="App.refreshPrintPreview()">
                </div>
              </div>

              <!-- Page Size Selector (A6 by Default) -->
              <div style="margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--border);">
                <label class="form-label" style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 6px;">Paper / Slip Size</label>
                <select id="prPageSizeSelect" class="form-select" style="font-size: 12px;" onchange="App.setPrintPageSize(this.value)">
                  <option value="A6" selected>A6 (Standard Tailor Slip - 105 × 148 mm)</option>
                  <option value="A4">A4 (Full Sheet - 210 × 297 mm)</option>
                  <option value="A5">A5 (Half Sheet - 148 × 210 mm)</option>
                  <option value="Thermal80">Thermal 80mm Roll (POS Receipt)</option>
                  <option value="Thermal58">Thermal 58mm Roll (Mini POS)</option>
                </select>
              </div>
            </div>

            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted);">
              <div>${first.token} has <strong>${totalPieces}</strong> piece(s).</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--ink); margin-top: 4px;">
                Pages to print: <span id="prPageCountDisplay">3</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary" style="flex: 1; padding: 10px;" onclick="window.print()">
                <span>🖨️</span> Print...
              </button>
              <button class="btn btn-secondary" style="padding: 10px 16px;" onclick="App.closePrintModal()">
                Close
              </button>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="App.sendOrderWhatsAppFromPrint('${first.token}')" style="color: var(--burgundy); font-weight: 600;">
              <span>💬</span> WhatsApp Slip to Customer
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; min-width: 0;">
          <div class="no-print" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px;">
            PRINT PREVIEW
          </div>
          <div style="border: 1px solid var(--border); border-radius: var(--radius-md); background: white; padding: 16px; overflow-y: auto; max-height: 72vh; flex: 1;" id="printPreviewContainer">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    this._currentPrintOrders = orders;
    this.refreshPrintPreview();
  },

  refreshPrintPreview() {
    const container = document.getElementById('printPreviewContainer');
    if (!container || !this._currentPrintOrders) return;

    const showCust = document.getElementById('prCustSlip')?.checked;
    const showTag = document.getElementById('prClothTag')?.checked;
    const showJob = document.getElementById('prJobCard')?.checked;
    const tagCopies = parseInt(document.getElementById('prTagCopies')?.value) || 1;
    const jobCopies = parseInt(document.getElementById('prJobCopies')?.value) || 1;

    let html = '';
    let totalPages = 0;

    this._currentPrintOrders.forEach((o, idx) => {
      const pageBreak = '<div class="page-break" style="margin: 20px 0; border-top: 2px dashed #CBD5E1;"></div>';

      if (showCust) {
        html += PrintEngine.buildCustomerSlipHtml(o, this.settings) + '<div style="height: 16px;"></div>';
        totalPages += 1;
      }
      if (showTag) {
        for (let i = 0; i < tagCopies; i++) {
          html += PrintEngine.buildClothTagHtml(o, this.settings?.shop_name) + '<div style="height: 16px;"></div>';
          totalPages += 1;
        }
      }
      if (showJob) {
        for (let i = 0; i < jobCopies; i++) {
          html += PrintEngine.buildJobCardHtml(o, this.settings) + '<div style="height: 16px;"></div>';
          totalPages += 1;
        }
      }

      if (idx < this._currentPrintOrders.length - 1) {
        html += pageBreak;
      }
    });

    if (!showCust && !showTag && !showJob) {
      html = '<div style="text-align: center; color: var(--muted); padding: 40px;">Select at least one slip option on the left to preview.</div>';
    }

    container.innerHTML = html;
    const countDisplay = document.getElementById('prPageCountDisplay');
    if (countDisplay) countDisplay.innerText = totalPages;
  },

  closePrintModal() {
    document.getElementById('printModalOverlay')?.classList.remove('active');
  },

  async openPrintSalarySlipModal(slipNo) {
    const slip = await API.getSalarySlip(slipNo);
    if (!slip) return;

    const overlay = document.getElementById('printModalOverlay');
    const bodyEl = document.getElementById('printModalBody');

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="max-height: 75vh; overflow-y: auto; background: white; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md);">
          ${PrintEngine.buildSalarySlipHtml(slip, this.settings)}
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" onclick="App.closePrintModal()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Slip</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  },

  async openWhatsAppQueue(tokens = []) {
    if (tokens.length === 0) return;
    const orders = [];
    for (const t of tokens) {
      const o = await API.getOrder(t);
      if (o) orders.push(o);
    }
    if (orders.length === 0) return;

    let currentIndex = 0;
    let templateType = 'ready';

    const renderStep = () => {
      const o = orders[currentIndex];
      const message = PrintEngine.generateOrderWhatsApp(o, templateType, this.settings?.shop_name);

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${o.customer}</div>
              <div style="font-size: 12px; color: var(--muted);">📞 ${o.phone} · Order ${o.token}</div>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--rust);">
              Customer ${currentIndex + 1} of ${orders.length}
            </div>
          </div>

          <div style="display: flex; gap: 16px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waTemplate" value="ready" ${templateType === 'ready' ? 'checked' : ''} onchange="App.updateQueueTemplate('ready')">
              <span>Garment Ready</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waTemplate" value="due" ${templateType === 'due' ? 'checked' : ''} onchange="App.updateQueueTemplate('due')">
              <span>Balance Due Reminder</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Message Preview (Editable)</label>
            <textarea id="waQueueMessageText" class="form-textarea" style="height: 120px;">${message}</textarea>
          </div>
        </div>
      `;

      this.showCustomModal(`WhatsApp Quick-Send Queue`, html, async () => {
        const text = document.getElementById('waQueueMessageText').value;
        PrintEngine.openWhatsApp(o.phone, text);

        if (currentIndex + 1 < orders.length) {
          currentIndex++;
          renderStep();
        } else {
          this.showToast('WhatsApp queue completed!', 'success');
          this.closeCustomModal();
        }
      }, currentIndex + 1 < orders.length ? 'Open WhatsApp ▶ Next' : 'Open WhatsApp & Finish');
    };

    this.updateQueueTemplate = (type) => {
      templateType = type;
      const o = orders[currentIndex];
      const area = document.getElementById('waQueueMessageText');
      if (area) {
        area.value = PrintEngine.generateOrderWhatsApp(o, templateType, this.settings?.shop_name);
      }
    };

    renderStep();
  },

  openCustomerWhatsAppQueue(customers = []) {
    if (!customers || customers.length === 0) return;

    let currentIndex = 0;
    let templateType = (customers[0]?.pending_balance > 0) ? 'due' : 'ready';
    const shopName = this.settings?.shop_name || "7 ART TAILORS";

    const generateCustomerMsg = (c, tType) => {
      const bal = c.pending_balance || 0;
      if (tType === 'due') {
        if (bal > 0) {
          return `Hello ${c.customer}, greetings from ${shopName}!\n\nThis is a friendly reminder that you have a pending balance of ₹${PrintEngine.fmtMoney(bal)} on your orders. Please feel free to clear the balance at your convenience.\n\nThank you!`;
        } else {
          return `Hello ${c.customer}, greetings from ${shopName}!\n\nAll your previous orders are fully cleared with zero pending balance. Thank you for your continued trust!`;
        }
      } else if (tType === 'ready') {
        return `Hello ${c.customer}, greetings from ${shopName}!\n\nYour bespoke tailoring order is ready at the workshop. You are welcome to visit us for trial and delivery.\n\nThank you!`;
      } else {
        return `Hello ${c.customer}, greetings from ${shopName}!\n\nThank you for choosing 7 ART TAILORS. Please let us know if you need any tailoring service or alterations.`;
      }
    };

    const renderStep = () => {
      const c = customers[currentIndex];
      const message = generateCustomerMsg(c, templateType);
      const bal = c.pending_balance || 0;

      const html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-warm); padding: 12px 16px; border: 1px solid var(--border); border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${c.customer}</div>
              <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">📞 ${c.phone} ${bal > 0 ? `· <span style="color: var(--red); font-weight: 700;">Due: ₹${PrintEngine.fmtMoney(bal)}</span>` : '· <span style="color: var(--green); font-weight: 600;">Balance Cleared</span>'}</div>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--rust);">
              Customer ${currentIndex + 1} of ${customers.length}
            </div>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="ready" ${templateType === 'ready' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('ready')">
              <span>Order Ready</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="due" ${templateType === 'due' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('due')">
              <span>Balance Reminder</span>
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">
              <input type="radio" name="waCustTemplate" value="general" ${templateType === 'general' ? 'checked' : ''} onchange="App.updateCustQueueTemplate('general')">
              <span>Studio Greetings</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Message Preview (Editable)</label>
            <textarea id="waCustQueueMessageText" class="form-textarea" style="height: 120px;">${message}</textarea>
          </div>

          ${customers.length > 1 ? `
          <div style="display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="App.skipCustQueueStep()" style="color: var(--muted);">
              Skip this customer ⏭
            </button>
          </div>
          ` : ''}
        </div>
      `;

      this.showCustomModal(`WhatsApp Customer Queue`, html, async () => {
        const text = document.getElementById('waCustQueueMessageText').value;
        PrintEngine.openWhatsApp(c.phone, text);

        if (currentIndex + 1 < customers.length) {
          currentIndex++;
          renderStep();
        } else {
          this.showToast('WhatsApp customer queue completed!', 'success');
          this.closeCustomModal();
        }
      }, currentIndex + 1 < customers.length ? 'Open WhatsApp ▶ Next' : 'Open WhatsApp & Finish');
    };

    this.updateCustQueueTemplate = (type) => {
      templateType = type;
      const c = customers[currentIndex];
      const area = document.getElementById('waCustQueueMessageText');
      if (area) {
        area.value = generateCustomerMsg(c, templateType);
      }
    };

    this.skipCustQueueStep = () => {
      if (currentIndex + 1 < customers.length) {
        currentIndex++;
        renderStep();
      } else {
        this.closeCustomModal();
      }
    };

    renderStep();
  },

  async quickWhatsApp(token) {
    const o = await API.getOrder(token);
    if (!o) return;
    const msg = PrintEngine.generateOrderWhatsApp(o, 'ready', this.settings?.shop_name);
    PrintEngine.openWhatsApp(o.phone, msg);
  },

  async sendOrderWhatsAppFromPrint(token) {
    this.quickWhatsApp(token);
  },

  async openSettleModal(token) {
    const o = await API.getOrder(token);
    if (!o) return;

    const overlay = document.getElementById('customModalOverlay');
    const titleEl = document.getElementById('customModalTitle');
    const bodyEl = document.getElementById('customModalBody');
    const footerEl = overlay.querySelector('.modal-footer');

    titleEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #BD1A22; color: white; border-radius: 6px; font-size: 14px;">✂️</span>
        <span style="font-weight: 700; color: #1E1617;">Settle & Deliver</span>
      </div>
    `;

    const totalFmt = PrintEngine.fmtMoney(o.total || 0);
    const advanceFmt = PrintEngine.fmtMoney(o.advance || 0);
    const balanceFmt = PrintEngine.fmtMoney(o.balance || 0);

    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 4px 0;">
        <div style="text-align: center; margin-bottom: 2px;">
          <h2 style="font-family: var(--font-serif); font-size: 24px; font-weight: 700; color: #1E1617; margin: 0;">Settle & Deliver</h2>
          <div style="font-size: 13px; color: #4A3B3C; margin-top: 4px; font-weight: 500;">
            <strong>${o.token}</strong> · ${o.customer} · ${o.phone}
          </div>
        </div>

        <!-- Bill Summary Card (Matches Image 2) -->
        <div style="background: #FFFFFF; border: 1.5px solid #EFE9E9; border-radius: 12px; padding: 18px 22px; box-shadow: 0 2px 8px rgba(17,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 14px; color: #8E7274;">Total bill</span>
            <span style="font-size: 15px; font-weight: 700; color: #1E1617;">₹ ${totalFmt}</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #8E7274;">Advance already paid</span>
            <span style="font-size: 15px; font-weight: 700; color: #1E1617;">₹ ${advanceFmt}</span>
          </div>

          <div style="border-top: 1px solid #EFE9E9; margin: 12px 0;"></div>

          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #BD1A22; text-transform: uppercase;">BALANCE DUE</span>
            <span style="font-size: 26px; font-weight: 800; color: #BD1A22; font-family: var(--font-sans);">₹ ${balanceFmt}</span>
          </div>
        </div>

        <!-- Amount Received Input (Matches Image 2) -->
        <div style="margin-top: 4px;">
          <label style="display: block; font-size: 13px; font-weight: 700; color: #1E1617; margin-bottom: 6px;">
            Amount received from the customer (₹)
          </label>
          <div style="display: flex; gap: 8px; align-items: center;">
            <input type="number" id="settleReceivedAmt" class="form-input" value="${o.balance}" min="0" step="any"
                   style="flex: 1; font-size: 18px; font-weight: 700; text-align: right; color: #1E1617; padding: 10px 14px; border: 1.5px solid #D3B6B8; border-radius: 8px; background: #FFFFFF;"
                   oninput="App.updateSettleCalculations(${o.total || 0}, ${o.advance || 0}, ${o.balance || 0})">
            <select id="settlePayMode" class="form-select" style="width: 120px; font-size: 13px; padding: 10px 8px; border: 1.5px solid #D3B6B8; border-radius: 8px;">
              <option value="Cash" ${o.pay_mode === 'Cash' ? 'selected' : ''}>Cash</option>
              <option value="UPI" ${o.pay_mode === 'UPI' ? 'selected' : ''}>UPI</option>
              <option value="Card">Card</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
          <div id="settleStatusPill" style="margin-top: 8px; font-size: 13px; font-weight: 700; color: #10B981; display: flex; align-items: center; gap: 5px;">
            ✔ Account fully settled
          </div>
        </div>

        <!-- Action Buttons (Matches Image 2) -->
        <div style="display: flex; gap: 10px; margin-top: 14px; justify-content: flex-end;">
          <button type="button" class="btn btn-green" id="btnCollectDeliver" onclick="App.executeSettle('${o.token}', true)"
                  style="background: #10B981; color: white; font-weight: 700; padding: 10px 18px; border-radius: 8px; border: none; font-size: 13px;">
            Collect & Deliver
          </button>
          <button type="button" class="btn btn-primary" id="btnCollectStayOpen" onclick="App.executeSettle('${o.token}', false)"
                  style="background: #BD1A22; color: white; font-weight: 700; padding: 10px 18px; border-radius: 8px; border: none; font-size: 13px;">
            Collect & Stay Open
          </button>
          <button type="button" class="btn btn-secondary" onclick="App.closeCustomModal()"
                  style="background: #FFFFFF; border: 1px solid #D3B6B8; color: #1E1617; font-weight: 600; padding: 10px 18px; border-radius: 8px; font-size: 13px;">
            Cancel
          </button>
        </div>
      </div>
    `;

    if (footerEl) footerEl.style.display = 'none';
    overlay.classList.add('active');
  },

  updateSettleCalculations(total, advance, balance) {
    const input = document.getElementById('settleReceivedAmt');
    const statusEl = document.getElementById('settleStatusPill');
    if (!input || !statusEl) return;
    const val = parseFloat(input.value) || 0;
    const remaining = balance - val;
    if (Math.abs(remaining) < 0.01) {
      statusEl.innerHTML = `<span style="color: #10B981; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">✔ Account fully settled</span>`;
    } else if (remaining > 0) {
      statusEl.innerHTML = `<span style="color: #BD1A22; font-weight: 700;">Remaining Balance Due: ₹${PrintEngine.fmtMoney(remaining)}</span>`;
    } else {
      statusEl.innerHTML = `<span style="color: #8E7274; font-weight: 700;">Overpayment / Return Change: ₹${PrintEngine.fmtMoney(-remaining)}</span>`;
    }
  },

  async executeSettle(token, deliver = true) {
    const amtInput = document.getElementById('settleReceivedAmt');
    const payModeSelect = document.getElementById('settlePayMode');
    const amt = amtInput ? parseFloat(amtInput.value || 0) : null;
    const payMode = payModeSelect ? payModeSelect.value : 'Cash';

    try {
      await API.settleOrder(token, payMode, amt, deliver);
      this.closeCustomModal();
      if (deliver) {
        this.showToast(`Order ${token} settled and marked Delivered!`, 'success');
      } else {
        this.showToast(`Payment of ₹${PrintEngine.fmtMoney(amt)} recorded for Order ${token}!`, 'success');
      }

      // Refresh view
      if (this.currentPage === 'orders' && window.OrdersView) {
        await OrdersView.loadOrders();
        const tbody = document.getElementById('ordersTableBody');
        if (tbody) tbody.innerHTML = OrdersView.renderTableRows();
        OrdersView.updateBulkActionBar();
      } else if (this.currentPage === 'dashboard' && window.DashboardView) {
        await DashboardView.render(document.getElementById('contentViewport'));
      } else if (this.currentPage === 'customers' && window.CustomersView) {
        await CustomersView.loadCustomers();
        CustomersView.render();
      }

      // Offer to print settled invoice
      if (deliver) {
        setTimeout(() => {
          if (confirm(`Order ${token} has been delivered. Would you like to print the settled delivery invoice slip?`)) {
            this.openPrintModal([token]);
          }
        }, 300);
      }
    } catch (err) {
      this.showToast(err.message || 'Settlement failed', 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});


