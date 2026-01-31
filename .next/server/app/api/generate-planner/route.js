"use strict";(()=>{var e={};e.id=698,e.ids=[698],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},62266:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>es,patchFetch:()=>ei,requestAsyncStorage:()=>eo,routeModule:()=>et,serverHooks:()=>ea,staticGenerationAsyncStorage:()=>en});var n,a,s,i,r,c,d,l,u,m,E,f,h={};o.r(h),o.d(h,{POST:()=>ee});var p=o(49303),g=o(88716),x=o(60670),C=o(87070);(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(n||(n={})),function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"}(a||(a={})),function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"}(s||(s={}));let O=["user","model","function","system"];(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(i||(i={})),function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"}(r||(r={})),function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"}(c||(c={})),function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"}(d||(d={})),function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.OTHER="OTHER"}(l||(l={})),function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"}(u||(u={})),function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"}(m||(m={})),function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"}(E||(E={}));class A extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class I extends A{constructor(e,t){super(e),this.response=t}}class R extends A{constructor(e,t,o,n){super(e),this.status=t,this.statusText=o,this.errorDetails=n}}class T extends A{}!function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"}(f||(f={}));class v{constructor(e,t,o,n,a){this.model=e,this.task=t,this.apiKey=o,this.stream=n,this.requestOptions=a}toString(){var e,t;let o=(null===(e=this.requestOptions)||void 0===e?void 0:e.apiVersion)||"v1beta",n=(null===(t=this.requestOptions)||void 0===t?void 0:t.baseUrl)||"https://generativelanguage.googleapis.com",a=`${n}/${o}/${this.model}:${this.task}`;return this.stream&&(a+="?alt=sse"),a}}async function S(e){var t;let o=new Headers;o.append("Content-Type","application/json"),o.append("x-goog-api-client",function(e){let t=[];return(null==e?void 0:e.apiClient)&&t.push(e.apiClient),t.push("genai-js/0.21.0"),t.join(" ")}(e.requestOptions)),o.append("x-goog-api-key",e.apiKey);let n=null===(t=e.requestOptions)||void 0===t?void 0:t.customHeaders;if(n){if(!(n instanceof Headers))try{n=new Headers(n)}catch(e){throw new T(`unable to convert customHeaders value ${JSON.stringify(n)} to Headers: ${e.message}`)}for(let[e,t]of n.entries()){if("x-goog-api-key"===e)throw new T(`Cannot set reserved header name ${e}`);if("x-goog-api-client"===e)throw new T(`Header name ${e} can only be set using the apiClient field`);o.append(e,t)}}return o}async function N(e,t,o,n,a,s){let i=new v(e,t,o,n,s);return{url:i.toString(),fetchOptions:Object.assign(Object.assign({},function(e){let t={};if((null==e?void 0:e.signal)!==void 0||(null==e?void 0:e.timeout)>=0){let o=new AbortController;(null==e?void 0:e.timeout)>=0&&setTimeout(()=>o.abort(),e.timeout),(null==e?void 0:e.signal)&&e.signal.addEventListener("abort",()=>{o.abort()}),t.signal=o.signal}return t}(s)),{method:"POST",headers:await S(i),body:a})}}async function y(e,t,o,n,a,s={},i=fetch){let{url:r,fetchOptions:c}=await N(e,t,o,n,a,s);return D(r,c,i)}async function D(e,t,o=fetch){let n;try{n=await o(e,t)}catch(t){(function(e,t){let o=e;throw e instanceof R||e instanceof T||((o=new A(`Error fetching from ${t.toString()}: ${e.message}`)).stack=e.stack),o})(t,e)}return n.ok||await _(n,e),n}async function _(e,t){let o,n="";try{let t=await e.json();n=t.error.message,t.error.details&&(n+=` ${JSON.stringify(t.error.details)}`,o=t.error.details)}catch(e){}throw new R(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`,e.status,e.statusText,o)}function P(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),w(e.candidates[0]))throw new I(`${L(e)}`,e);return function(e){var t,o,n,a;let s=[];if(null===(o=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===o?void 0:o.parts)for(let t of null===(a=null===(n=e.candidates)||void 0===n?void 0:n[0].content)||void 0===a?void 0:a.parts)t.text&&s.push(t.text),t.executableCode&&s.push("\n```"+t.executableCode.language+"\n"+t.executableCode.code+"\n```\n"),t.codeExecutionResult&&s.push("\n```\n"+t.codeExecutionResult.output+"\n```\n");return s.length>0?s.join(""):""}(e)}if(e.promptFeedback)throw new I(`Text not available. ${L(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),w(e.candidates[0]))throw new I(`${L(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),b(e)[0]}if(e.promptFeedback)throw new I(`Function call not available. ${L(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),w(e.candidates[0]))throw new I(`${L(e)}`,e);return b(e)}if(e.promptFeedback)throw new I(`Function call not available. ${L(e)}`,e)},e}function b(e){var t,o,n,a;let s=[];if(null===(o=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===o?void 0:o.parts)for(let t of null===(a=null===(n=e.candidates)||void 0===n?void 0:n[0].content)||void 0===a?void 0:a.parts)t.functionCall&&s.push(t.functionCall);return s.length>0?s:void 0}let M=[l.RECITATION,l.SAFETY,l.LANGUAGE];function w(e){return!!e.finishReason&&M.includes(e.finishReason)}function L(e){var t,o,n;let a="";if((!e.candidates||0===e.candidates.length)&&e.promptFeedback)a+="Response was blocked",(null===(t=e.promptFeedback)||void 0===t?void 0:t.blockReason)&&(a+=` due to ${e.promptFeedback.blockReason}`),(null===(o=e.promptFeedback)||void 0===o?void 0:o.blockReasonMessage)&&(a+=`: ${e.promptFeedback.blockReasonMessage}`);else if(null===(n=e.candidates)||void 0===n?void 0:n[0]){let t=e.candidates[0];w(t)&&(a+=`Candidate was blocked due to ${t.finishReason}`,t.finishMessage&&(a+=`: ${t.finishMessage}`))}return a}function U(e){return this instanceof U?(this.v=e,this):new U(e)}"function"==typeof SuppressedError&&SuppressedError;let $=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function F(e){let t=[],o=e.getReader();for(;;){let{done:e,value:n}=await o.read();if(e)return P(function(e){let t=e[e.length-1],o={promptFeedback:null==t?void 0:t.promptFeedback};for(let t of e){if(t.candidates)for(let e of t.candidates){let t=e.index;if(o.candidates||(o.candidates=[]),o.candidates[t]||(o.candidates[t]={index:e.index}),o.candidates[t].citationMetadata=e.citationMetadata,o.candidates[t].groundingMetadata=e.groundingMetadata,o.candidates[t].finishReason=e.finishReason,o.candidates[t].finishMessage=e.finishMessage,o.candidates[t].safetyRatings=e.safetyRatings,e.content&&e.content.parts){o.candidates[t].content||(o.candidates[t].content={role:e.content.role||"user",parts:[]});let n={};for(let a of e.content.parts)a.text&&(n.text=a.text),a.functionCall&&(n.functionCall=a.functionCall),a.executableCode&&(n.executableCode=a.executableCode),a.codeExecutionResult&&(n.codeExecutionResult=a.codeExecutionResult),0===Object.keys(n).length&&(n.text=""),o.candidates[t].content.parts.push(n)}}t.usageMetadata&&(o.usageMetadata=t.usageMetadata)}return o}(t));t.push(n)}}async function j(e,t,o,n){return function(e){let[t,o]=(function(e){let t=e.getReader();return new ReadableStream({start(e){let o="";return function n(){return t.read().then(({value:t,done:a})=>{let s;if(a){if(o.trim()){e.error(new A("Failed to parse stream"));return}e.close();return}let i=(o+=t).match($);for(;i;){try{s=JSON.parse(i[1])}catch(t){e.error(new A(`Error parsing JSON response: "${i[1]}"`));return}e.enqueue(s),i=(o=o.substring(i[0].length)).match($)}return n()})}()}})})(e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(e){return function(e,t,o){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var n,a=o.apply(e,t||[]),s=[];return n={},i("next"),i("throw"),i("return"),n[Symbol.asyncIterator]=function(){return this},n;function i(e){a[e]&&(n[e]=function(t){return new Promise(function(o,n){s.push([e,t,o,n])>1||r(e,t)})})}function r(e,t){try{var o;(o=a[e](t)).value instanceof U?Promise.resolve(o.value.v).then(c,d):l(s[0][2],o)}catch(e){l(s[0][3],e)}}function c(e){r("next",e)}function d(e){r("throw",e)}function l(e,t){e(t),s.shift(),s.length&&r(s[0][0],s[0][1])}}(this,arguments,function*(){let t=e.getReader();for(;;){let{value:e,done:o}=yield U(t.read());if(o)break;yield yield U(P(e))}})}(t),response:F(o)}}(await y(t,f.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(o),n))}async function G(e,t,o,n){let a=await y(t,f.GENERATE_CONTENT,e,!1,JSON.stringify(o),n);return{response:P(await a.json())}}function q(e){if(null!=e){if("string"==typeof e)return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function H(e){let t=[];if("string"==typeof e)t=[{text:e}];else for(let o of e)"string"==typeof o?t.push({text:o}):t.push(o);return function(e){let t={role:"user",parts:[]},o={role:"function",parts:[]},n=!1,a=!1;for(let s of e)"functionResponse"in s?(o.parts.push(s),a=!0):(t.parts.push(s),n=!0);if(n&&a)throw new A("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!n&&!a)throw new A("No content is provided for sending chat message.");return n?t:o}(t)}function k(e){let t;return t=e.contents?e:{contents:[H(e)]},e.systemInstruction&&(t.systemInstruction=q(e.systemInstruction)),t}let B=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],K={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]},Y="SILENT_ERROR";class V{constructor(e,t,o,n={}){this.model=t,this.params=o,this._requestOptions=n,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,(null==o?void 0:o.history)&&(function(e){let t=!1;for(let o of e){let{role:e,parts:n}=o;if(!t&&"user"!==e)throw new A(`First content should be with role 'user', got ${e}`);if(!O.includes(e))throw new A(`Each item should include role field. Got ${e} but valid roles are: ${JSON.stringify(O)}`);if(!Array.isArray(n))throw new A("Content should have 'parts' property with an array of Parts");if(0===n.length)throw new A("Each Content should have at least one part");let a={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let e of n)for(let t of B)t in e&&(a[t]+=1);let s=K[e];for(let t of B)if(!s.includes(t)&&a[t]>0)throw new A(`Content with role '${e}' can't contain '${t}' part`);t=!0}}(o.history),this._history=o.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e,t={}){var o,n,a,s,i,r;let c;await this._sendPromise;let d=H(e),l={safetySettings:null===(o=this.params)||void 0===o?void 0:o.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(a=this.params)||void 0===a?void 0:a.tools,toolConfig:null===(s=this.params)||void 0===s?void 0:s.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(r=this.params)||void 0===r?void 0:r.cachedContent,contents:[...this._history,d]},u=Object.assign(Object.assign({},this._requestOptions),t);return this._sendPromise=this._sendPromise.then(()=>G(this._apiKey,this.model,l,u)).then(e=>{var t;if(e.response.candidates&&e.response.candidates.length>0){this._history.push(d);let o=Object.assign({parts:[],role:"model"},null===(t=e.response.candidates)||void 0===t?void 0:t[0].content);this._history.push(o)}else{let t=L(e.response);t&&console.warn(`sendMessage() was unsuccessful. ${t}. Inspect response object for details.`)}c=e}),await this._sendPromise,c}async sendMessageStream(e,t={}){var o,n,a,s,i,r;await this._sendPromise;let c=H(e),d={safetySettings:null===(o=this.params)||void 0===o?void 0:o.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(a=this.params)||void 0===a?void 0:a.tools,toolConfig:null===(s=this.params)||void 0===s?void 0:s.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(r=this.params)||void 0===r?void 0:r.cachedContent,contents:[...this._history,c]},l=Object.assign(Object.assign({},this._requestOptions),t),u=j(this._apiKey,this.model,d,l);return this._sendPromise=this._sendPromise.then(()=>u).catch(e=>{throw Error(Y)}).then(e=>e.response).then(e=>{if(e.candidates&&e.candidates.length>0){this._history.push(c);let t=Object.assign({},e.candidates[0].content);t.role||(t.role="model"),this._history.push(t)}else{let t=L(e);t&&console.warn(`sendMessageStream() was unsuccessful. ${t}. Inspect response object for details.`)}}).catch(e=>{e.message!==Y&&console.error(e)}),u}}async function J(e,t,o,n){return(await y(t,f.COUNT_TOKENS,e,!1,JSON.stringify(o),n)).json()}async function X(e,t,o,n){return(await y(t,f.EMBED_CONTENT,e,!1,JSON.stringify(o),n)).json()}async function z(e,t,o,n){let a=o.requests.map(e=>Object.assign(Object.assign({},e),{model:t}));return(await y(t,f.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:a}),n)).json()}class Q{constructor(e,t,o={}){this.apiKey=e,this._requestOptions=o,t.model.includes("/")?this.model=t.model:this.model=`models/${t.model}`,this.generationConfig=t.generationConfig||{},this.safetySettings=t.safetySettings||[],this.tools=t.tools,this.toolConfig=t.toolConfig,this.systemInstruction=q(t.systemInstruction),this.cachedContent=t.cachedContent}async generateContent(e,t={}){var o;let n=k(e),a=Object.assign(Object.assign({},this._requestOptions),t);return G(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(o=this.cachedContent)||void 0===o?void 0:o.name},n),a)}async generateContentStream(e,t={}){var o;let n=k(e),a=Object.assign(Object.assign({},this._requestOptions),t);return j(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(o=this.cachedContent)||void 0===o?void 0:o.name},n),a)}startChat(e){var t;return new V(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(t=this.cachedContent)||void 0===t?void 0:t.name},e),this._requestOptions)}async countTokens(e,t={}){let o=function(e,t){var o;let n={model:null==t?void 0:t.model,generationConfig:null==t?void 0:t.generationConfig,safetySettings:null==t?void 0:t.safetySettings,tools:null==t?void 0:t.tools,toolConfig:null==t?void 0:t.toolConfig,systemInstruction:null==t?void 0:t.systemInstruction,cachedContent:null===(o=null==t?void 0:t.cachedContent)||void 0===o?void 0:o.name,contents:[]},a=null!=e.generateContentRequest;if(e.contents){if(a)throw new T("CountTokensRequest must have one of contents or generateContentRequest, not both.");n.contents=e.contents}else if(a)n=Object.assign(Object.assign({},n),e.generateContentRequest);else{let t=H(e);n.contents=[t]}return{generateContentRequest:n}}(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),n=Object.assign(Object.assign({},this._requestOptions),t);return J(this.apiKey,this.model,o,n)}async embedContent(e,t={}){let o="string"==typeof e||Array.isArray(e)?{content:H(e)}:e,n=Object.assign(Object.assign({},this._requestOptions),t);return X(this.apiKey,this.model,o,n)}async batchEmbedContents(e,t={}){let o=Object.assign(Object.assign({},this._requestOptions),t);return z(this.apiKey,this.model,e,o)}}class W{constructor(e){this.apiKey=e}getGenerativeModel(e,t){if(!e.model)throw new A("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new Q(this.apiKey,e,t)}getGenerativeModelFromCachedContent(e,t,o){if(!e.name)throw new T("Cached content must contain a `name` field.");if(!e.model)throw new T("Cached content must contain a `model` field.");for(let o of["model","systemInstruction"])if((null==t?void 0:t[o])&&e[o]&&(null==t?void 0:t[o])!==e[o]){if("model"===o&&(t.model.startsWith("models/")?t.model.replace("models/",""):t.model)===(e.model.startsWith("models/")?e.model.replace("models/",""):e.model))continue;throw new T(`Different value for "${o}" specified in modelParams (${t[o]}) and cachedContent (${e[o]})`)}let n=Object.assign(Object.assign({},t),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new Q(this.apiKey,n,o)}}let Z={terra:{name:"Terra",icon:"\uD83C\uDF0D",meaning:"Seguran\xe7a e Estrutura"},agua:{name:"\xc1gua",icon:"\uD83D\uDCA7",meaning:"Emo\xe7\xe3o e Intimidade"},ar:{name:"Ar",icon:"\uD83C\uDF2C️",meaning:"Comunica\xe7\xe3o"},fogo:{name:"Fogo",icon:"\uD83D\uDD25",meaning:"Paix\xe3o e Desejo"},eter:{name:"\xc9ter",icon:"✨",meaning:"Prop\xf3sito Compartilhado"}};async function ee(e){try{let t;let o=process.env.GEMINI_API_KEY;if(!o)return console.error("GEMINI_API_KEY n\xe3o configurada"),C.NextResponse.json({error:"Servi\xe7o de IA n\xe3o configurado"},{status:500});let{lowestElement:n,scores:a,secondLowestElement:s,pattern:i}=await e.json();if(!n||!a)return C.NextResponse.json({error:"Dados inv\xe1lidos"},{status:400});let r=[a.terra,a.agua,a.ar,a.fogo,a.eter],c=Math.min(...r),d=Math.max(...r),l=d-c,u=c>=13&&d<=17&&l<=3||i?.includes("relacao_morna"),m=Z[n],E=s?Z[s]:null;t=u?`
Voc\xea \xe9 Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experi\xeancia transformando casais. Voc\xea desenvolveu o M\xe9todo dos 5 Elementos.

O usu\xe1rio completou o Quiz dos 5 Elementos e estes s\xe3o os resultados:

SCORES (de 5 a 25 cada - 5 perguntas por elemento, 1-5 pontos cada):
- Terra: ${a.terra}/25
- \xc1gua: ${a.agua}/25
- Ar: ${a.ar}/25
- Fogo: ${a.fogo}/25
- \xc9ter: ${a.eter}/25

🔥 SITUA\xc7\xc3O ESPECIAL: A BRASA ADORMECIDA - RELACIONAMENTO NO PILOTO AUTOM\xc1TICO

Este \xe9 o relacionamento no piloto autom\xe1tico — n\xe3o est\xe1 em crise, mas tamb\xe9m n\xe3o est\xe1 vivo. 
Nenhum elemento em crise, nenhum elemento brilhando. Relacionamento funcional, mas estagnado. 
"Colegas de quarto confort\xe1veis". O perigo: \xc9 o tipo de relacionamento que morre lentamente 
sem ningu\xe9m perceber. N\xe3o h\xe1 dor suficiente para agir, mas tamb\xe9m n\xe3o h\xe1 vida.

CRIE UM "PLANNER DESPERTAR - Relacionamento Fora do Piloto Autom\xe1tico" de 30 dias.

METODOLOGIA: Baseado no M\xe9todo dos 5 Elementos de Jaya Roberta.

ESTRUTURA DOS 30 DIAS (trabalhando os 5 elementos em ciclos de 6 dias cada):

=== CICLO 1: TERRA (Dias 1-6) — Presen\xe7a ===
Tema: "Voltar a estar aqui"
- Reconstruir base e seguran\xe7a
- Rituais de presen\xe7a
- Micro-compromissos di\xe1rios

=== CICLO 2: \xc1GUA (Dias 7-12) — Profundidade ===
Tema: "Voltar a sentir"
- Reconex\xe3o emocional
- Vulnerabilidade gradual
- Exerc\xedcios de escuta profunda

=== CICLO 3: FOGO (Dias 13-18) — Desejo ===
Tema: "Voltar a querer"
- Reacender desejo e admira\xe7\xe3o
- Novidade e surpresa
- Presen\xe7a f\xedsica intencional

=== CICLO 4: AR (Dias 19-24) — Verdade ===
Tema: "Voltar a falar"
- Comunica\xe7\xe3o consciente
- Express\xe3o de necessidades
- Resolu\xe7\xe3o de pend\xeancias

=== CICLO 5: \xc9TER (Dias 25-30) — Prop\xf3sito ===
Tema: "Voltar a sonhar juntos"
- Vis\xe3o compartilhada de futuro
- Prop\xf3sito da rela\xe7\xe3o
- Ritual de fechamento e renova\xe7\xe3o

REGRAS:

1. Cada dia deve ter 1 EXERC\xcdCIO PR\xc1TICO de 10-20 minutos
2. Cada exerc\xedcio deve ter:
   - Nome criativo e envolvente
   - Dura\xe7\xe3o (10-20 min)
   - Por que funciona (1 frase sobre como "desperta" o relacionamento)
   - Passo a passo claro e pr\xe1tico
3. Ao final de cada ciclo (Dias 6, 12, 18, 24), inclua uma "Reflex\xe3o [Elemento]" perguntando o que mudou
4. Tom: ENERG\xc9TICO, inspirador, com foco em despertar a brasa adormecida
5. Use a met\xe1fora da "brasa sob cinzas" — o relacionamento n\xe3o morreu, precisa ser despertado

FORMATO DE RESPOSTA (use EXATAMENTE esta estrutura):

# PLANNER DESPERTAR - Relacionamento Fora do Piloto Autom\xe1tico

## Introdu\xe7\xe3o
[Uma p\xe1gina explicando o conceito de "relacionamento morno" e a met\xe1fora da brasa adormecida]

## CICLO 1: TERRA (Dias 1-6) — Presen\xe7a
### Tema: "Voltar a estar aqui"

#### Dia 1
**Exerc\xedcio: Check-in de presen\xe7a (10 minutos)**
- Por que funciona: Reconecta voc\xeas com o momento presente e um ao outro
- Passo a passo:
  1. Sentem-se frente a frente
  2. Olhem-se nos olhos por 2 minutos em sil\xeancio
  3. Compartilhem uma palavra que descreve como est\xe3o se sentindo agora

[... continue para dias 2-6 com exerc\xedcios espec\xedficos de TERRA]

#### Dia 6 - Reflex\xe3o Terra
[Perguntas para refletir sobre o que mudou na sensa\xe7\xe3o de seguran\xe7a e presen\xe7a]

## CICLO 2: \xc1GUA (Dias 7-12) — Profundidade
### Tema: "Voltar a sentir"

[... continue seguindo a mesma estrutura para todos os 5 ciclos]

## CICLO 5: \xc9TER (Dias 25-30) — Prop\xf3sito
### Tema: "Voltar a sonhar juntos"

#### Dia 30
**Exerc\xedcio: Carta ao futuro (20 minutos)**
- Por que funciona: Cria uma vis\xe3o compartilhada e compromisso com o futuro
- Passo a passo:
  1. Individualmente, escrevam uma carta para o casal que ser\xe3o em 1 ano
  2. Compartilhem as cartas
  3. Criem um ritual simb\xf3lico de "recome\xe7o" juntos

## Mensagem Final
[Uma mensagem de encorajamento sobre despertar a brasa e manter o relacionamento vivo]

IMPORTANTE: Foque em exerc\xedcios que tragam PRESEN\xc7A, PROFUNDIDADE, DESEJO, VERDADE e PROP\xd3SITO. 
O objetivo \xe9 despertar a brasa adormecida e tirar o relacionamento do piloto autom\xe1tico.
`:c>=18&&l<=3?`
Voc\xea \xe9 Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experi\xeancia transformando casais. Voc\xea desenvolveu o M\xe9todo dos 5 Elementos.

O usu\xe1rio completou o Quiz dos 5 Elementos e estes s\xe3o os resultados:

SCORES (de 5 a 25 cada - 5 perguntas por elemento, 1-5 pontos cada):
- Terra: ${a.terra}/25
- \xc1gua: ${a.agua}/25
- Ar: ${a.ar}/25
- Fogo: ${a.fogo}/25
- \xc9ter: ${a.eter}/25

🎉 SITUA\xc7\xc3O ESPECIAL: TODOS OS ELEMENTOS EST\xc3O EQUILIBRADOS!
${25===c&&25===d?"Todos os elementos est\xe3o com score m\xe1ximo (25/25) - Equil\xedbrio Perfeito!":"Todos os elementos est\xe3o em equil\xedbrio harmonioso."}

CRIE UM PLANNER DE 30 DIAS DE MANUTEN\xc7\xc3O para este casal, seguindo estas regras:

1. FOCO: MANUTEN\xc7\xc3O do equil\xedbrio perfeito dos 5 Elementos
2. Cada dia deve ter 1 EXERC\xcdCIO PR\xc1TICO de 5-15 minutos
3. Progress\xe3o:
   - Semana 1: Exerc\xedcios de CONSOLIDA\xc7\xc3O dos rituais existentes
   - Semana 2: Exerc\xedcios de APROFUNDAMENTO da conex\xe3o
   - Semana 3: Exerc\xedcios de CRESCIMENTO conjunto
   - Semana 4: Exerc\xedcios de CELEBRA\xc7\xc3O e renova\xe7\xe3o
4. Tom: POSITIVO, encorajador, celebrativo, mas pr\xe1tico
5. Cada exerc\xedcio deve ter:
   - Nome criativo
   - Dura\xe7\xe3o (5-15 min)
   - Por que funciona (1 frase)
   - Passo a passo claro
6. Distribua os exerc\xedcios entre os 5 elementos de forma equilibrada

FORMATO DE RESPOSTA (use EXATAMENTE esta estrutura):

# PLANNER DE 30 DIAS - MANUTEN\xc7\xc3O DO EQUIL\xcdBRIO

## Semana 1: Consolidando Rituais
### Dia 1
**[Nome do Exerc\xedcio]** (X minutos)
*Por que funciona:* [explica\xe7\xe3o curta]
- Passo 1
- Passo 2
- Passo 3

[Continue para os dias 2-7]

## Semana 2: Aprofundando a Conex\xe3o
[Dias 8-14]

## Semana 3: Crescimento Conjunto
[Dias 15-21]

## Semana 4: Celebra\xe7\xe3o e Renova\xe7\xe3o
[Dias 22-30]

## Mensagem Final
[Uma mensagem de encorajamento e celebra\xe7\xe3o de 2-3 frases]
`:`
Voc\xea \xe9 Jaya Roberta, terapeuta integrativa especializada em relacionamentos e sexualidade humana,
com 8 anos de experi\xeancia transformando casais. Voc\xea desenvolveu o M\xe9todo dos 5 Elementos.

O usu\xe1rio completou o Quiz dos 5 Elementos e estes s\xe3o os resultados:

SCORES (de 5 a 25 cada - 5 perguntas por elemento, 1-5 pontos cada):
- Terra: ${a.terra}/25
- \xc1gua: ${a.agua}/25
- Ar: ${a.ar}/25
- Fogo: ${a.fogo}/25
- \xc9ter: ${a.eter}/25

ELEMENTO MAIS DESALINHADO: ${m.name.toUpperCase()} (${m.icon})
- Score: ${a[n]}/25
- Significa: ${m.meaning}

${E?`
SEGUNDO ELEMENTO EM RISCO: ${E.name.toUpperCase()} (${E.icon})
- Score: ${a[s]}/25
`:""}

${i?`PADR\xc3O IDENTIFICADO: ${i}`:""}

CRIE UM PLANNER DE 30 DIAS para este casal, seguindo estas regras:

1. FOCO PRINCIPAL no elemento ${m.name} (o mais desalinhado)
2. Cada dia deve ter 1 EXERC\xcdCIO PR\xc1TICO de 5-15 minutos
3. Progress\xe3o:
   - Semana 1: Exerc\xedcios INDIVIDUAIS (sem pressionar o parceiro)
   - Semana 2: Exerc\xedcios LEVES a dois
   - Semana 3: Exerc\xedcios de CONEX\xc3O mais profundos
   - Semana 4: RITUAIS de consolida\xe7\xe3o
4. Tom: DIRETO, pr\xe1tico, sem jarg\xe3o new age
5. Cada exerc\xedcio deve ter:
   - Nome criativo
   - Dura\xe7\xe3o (5-15 min)
   - Por que funciona (1 frase)
   - Passo a passo claro

FORMATO DE RESPOSTA (use EXATAMENTE esta estrutura):

# PLANNER DE 30 DIAS - ELEMENTO ${m.name.toUpperCase()}

## Semana 1: Reconex\xe3o Individual
### Dia 1
**[Nome do Exerc\xedcio]** (X minutos)
*Por que funciona:* [explica\xe7\xe3o curta]
- Passo 1
- Passo 2
- Passo 3

[Continue para os dias 2-7]

## Semana 2: Primeiros Passos a Dois
[Dias 8-14]

## Semana 3: Aprofundando a Conex\xe3o
[Dias 15-21]

## Semana 4: Consolidando Rituais
[Dias 22-30]

## Mensagem Final
[Uma mensagem de encorajamento de 2-3 frases]
`;let f=new W(o),h=process.env.GEMINI_MODEL||"gemini-2.0-flash";console.log("\uD83E\uDD16 Usando modelo Gemini:",h);let p=f.getGenerativeModel({model:h});console.log("\uD83D\uDCDD Gerando planner para elemento:",n);let g=await p.generateContent(t),x=(await g.response).text();return console.log("✅ Planner gerado com sucesso!"),C.NextResponse.json({success:!0,planner:x,element:n,generatedAt:new Date().toISOString()})}catch(o){console.error("❌ Erro ao gerar planner:",o),console.error("Detalhes completos do erro:",{message:o.message,stack:o.stack,name:o.name,status:o.status,errorCode:o.code});let e="Erro ao gerar planner",t=500;return o.message?.includes("API key")?(e="Chave Gemini inv\xe1lida ou n\xe3o configurada",t=503):o.message?.includes("quota")||429===o.status?(e="Limite de requisi\xe7\xf5es atingido. Tente novamente em alguns minutos",t=429):o.message?.includes("UNAUTHENTICATED")&&(e="Autentica\xe7\xe3o Gemini falhou. Chave pode estar expirada",t=401),C.NextResponse.json({error:e,details:o.message,errorType:o.name},{status:t})}}let et=new p.AppRouteRouteModule({definition:{kind:g.x.APP_ROUTE,page:"/api/generate-planner/route",pathname:"/api/generate-planner",filename:"route",bundlePath:"app/api/generate-planner/route"},resolvedPagePath:"C:\\Users\\Jaya\\Projetos\\AulaAvancada\\quiz-5-elementos\\src\\app\\api\\generate-planner\\route.ts",nextConfigOutput:"",userland:h}),{requestAsyncStorage:eo,staticGenerationAsyncStorage:en,serverHooks:ea}=et,es="/api/generate-planner/route";function ei(){return(0,x.patchFetch)({serverHooks:ea,staticGenerationAsyncStorage:en})}}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),n=t.X(0,[276,972],()=>o(62266));module.exports=n})();