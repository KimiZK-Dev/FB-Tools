async function onStart(t){return checkLogin(t).then((async e=>{switch(t){case"mbasic.facebook.com":return await mbasic(e);case"www.facebook.com":return await facebook(e);case"m.facebook.com":return await m_facebook(e)}})).catch((t=>(console.log(t),errorAlert({title:"Đã xảy ra lỗi",callback:()=>{window.close()}}))))}async function facebook(t){let e=await chrome.cookies.getAll({domain:"facebook.com"});const o=e.map((t=>`${t.name}=${t.value}`)).join("; ");let n=e.map((t=>({key:t.name,value:t.value,domain:"facebook.com",path:t.path,hostOnly:t.hostOnly,creation:(new Date).toISOString(),lastAccessed:(new Date).toISOString()}))),i=JSON.stringify(n,null,4);$("#floatingTextarea").val(i),$("#btn-get-token").click((async function(){try{const e=Swal.fire({title:"Đang xử lý",html:"Vui lòng đợi trong giây lát.",allowOutsideClick:!1,showConfirmButton:!1,timerProgressBar:!0,width:"380px",didOpen:()=>{Swal.showLoading()}}),n=$("#app-id").val(),i=new URLSearchParams;i.append("cookie",o),i.append("app_id",n),i.append("fb_dtsg",t);const{data:a}=await axios({method:"POST",url:"https://dev-ndk.id.vn/api/v1/facebook/token",data:i});"ok"==a.status&&(e.close(),$("#result-token").removeClass("d-none"),$("#input-token").val(a.data),successAlert({title:"Thành công",text:"Đã lấy token thành công",timer:1e3})),"error"==a.status&&(e.close(),errorAlert({title:"Kiểm tra đăng nhập",text:a.message,timer:1500}))}catch(t){return console.error(t),errorAlert({title:"Đã xảy ra lỗi khi lấy token",timer:3e3})}})),$("#btn-copy-token").click((function(){return copyToClipboard({text:$("#input-token").val(),success:"Copy token thành công!",error:"Đã xảy ra lỗi khi copy token!"})})),$("#btn-copy-fbstate").click((function(){return copyToClipboard({text:$("#floatingTextarea").val(),success:"Copy FB-State thành công!",error:"Đã xảy ra lỗi khi copy FB-State!"})})),$("#btn-copy-cookie").click((function(){return copyToClipboard({text:o,success:"Copy Cookie thành công!",error:"Đã xảy ra lỗi khi copy Cookie!"})})),$("#btn-down-fbstate").click((function(){const t=ToastAlert();let e=stringToBlob(i,"application/json"),o=window.webkitURL||window.URL||window.mozURL||window.msURL;const n=$("#input-name-file").val();let a=document.createElement("a");return a.download=`${n}.json`,a.href=o.createObjectURL(e),a.textContent="",a.dataset.downloadurl=["json",a.download,a.href].join(":"),a.click(),t.fire({icon:"success",title:"Download FB-State thành công!"}),a.remove()})),$("#btn-logout-fbstate").click((function(){return Swal.fire({text:"Bạn muốn đăng xuất Facebook?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, Logout!",allowOutsideClick:!1,width:"380px"}).then((t=>{t.isConfirmed&&Swal.fire({text:"Đăng xuất Facebook thành công",icon:"success",showConfirmButton:!1,allowOutsideClick:!1,timer:1e3,timerProgressBar:!0,width:"380px"}).then((()=>{chrome.cookies.getAll({domain:"facebook.com"},(function(t){t=t.filter((t=>"sb"!=t.name&&"dbln"!=t.name));for(let e in t)chrome.cookies.remove({url:`https://facebook.com${t[e].path}`,name:t[e].name});chrome.tabs.query({active:!0},(function(t){const{host:e}=new URL(t[0].url);"facebook"==e.split(".")[1]&&(window.close(),chrome.tabs.update(t[0].id,{url:t[0].url}))}))}))}))}))})),$("#btn-paste-url").click((function(){return navigator.clipboard.readText().then((t=>{$("#input-url-download").val(t)}))})),$("#btn-download-video").click((async function(){const t=$("#input-url-download").val();if(!isValidURL(t))return errorAlert({text:"URL không hợp lệ",timer:1500});const e=Swal.fire({title:"Đang xử lý",html:"Vui lòng đợi trong giây lát.",allowOutsideClick:!1,showConfirmButton:!1,timerProgressBar:!0,width:"380px",didOpen:()=>{Swal.showLoading()}});try{const{data:o}=await axios.get(t,{headers:{Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"}}),n=(new DOMParser).parseFromString(o,"text/html"),i=$(n).find('script[type="application/json"]');let a=[],r=[];i.each((function(){const t=$(this).html();t.includes("playlist")&&a.push(JSON.parse(t)),t.includes("CometFeedStoryDefaultMessageRenderingStrategy")&&r.push(JSON.parse(t))}));let l=lodashArray(a,"__bbox.result",t),c=lodashArray(r,"__bbox.result.data",t);if(!l)return errorAlert({title:"Không tìm thấy video",timer:1500});const s=findParentKeysWithPlaylist(l),d=findMimeType(l.extensions,"audio/mp4"),u=findTitlesAndMessages(c);if($.each(s,(function(t,e){const o=_.get(l,e);let n='<div class="d-flex w-100 justify-content-between align-items-center border border-primary-subtle shadow_hover p-2 rounded-3 mb-2" style="height: 100px; gap: 0.8rem" >';n+=`<a class="position-relative downloadLink" href="${o.preferred_thumbnail.image.uri}" >`,n+=`<img src="${o.preferred_thumbnail.image.uri}" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Download Thumbnail" class="img-thumbnail rounded shadow-tad h-100" style="width: 150px; object-fit: contain" alt="${u[0]}" />`,n+='<span class="position-absolute translate-middle text-bg-success border border-light rounded-circle" style="top: 5px; left: 97%; padding: 1px" >',n+='<span class="position-absolute translate-middle text-bg-success border border-light rounded-circle" style="top: 5px; left: 97%; padding: 1px" >',n+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16" >',n+='<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />',n+="</svg>",n+="</span>",n+="</a>",n+='<div class="d-flex flex-column gap-2">',n+=`<button data-href="${o.browser_native_sd_url}" class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 justify-content-center downloadLink" style="width: 120px" ${o.browser_native_sd_url?"":"disabled"}>`,n+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-badge-sd" viewBox="0 0 16 16" >',n+='<path fill-rule="evenodd" d="M15 4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.077 7.114c-1.524 0-2.263-.8-2.315-1.749h1.147c.079.466.527.809 1.234.809.739 0 1.13-.339 1.13-.83 0-.418-.3-.634-.923-.779l-.927-.215c-.932-.21-1.52-.747-1.52-1.657 0-1.098.918-1.815 2.24-1.815 1.371 0 2.162.77 2.22 1.692H6.238c-.075-.43-.466-.76-1.103-.76-.655 0-1.046.338-1.046.804 0 .36.294.598.821.712l.932.216c.971.22 1.613.685 1.613 1.691 0 1.117-.857 1.881-2.378 1.881M8.307 11V5.001h2.19c1.823 0 2.684 1.09 2.684 2.984 0 1.908-.874 3.015-2.685 3.015zm2.031-5.032h-.844v4.06h.844c1.116 0 1.622-.667 1.622-2.02 0-1.354-.51-2.04-1.622-2.04" />',n+="</svg>",n+="MP4",n+="</button>",n+=`<button style="width: 120px" data-href="${o.browser_native_hd_url}" class="btn btn-outline-success btn-sm d-flex align-items-center gap-1 justify-content-center downloadLink" ${o.browser_native_hd_url?"":"disabled"}>`,n+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-badge-hd" viewBox="0 0 16 16" >',n+='<path d="M7.396 11V5.001H6.209v2.44H3.687V5H2.5v6h1.187V8.43h2.522V11zM8.5 5.001V11h2.188c1.811 0 2.685-1.107 2.685-3.015 0-1.894-.86-2.984-2.684-2.984zm1.187.967h.843c1.112 0 1.622.686 1.622 2.04 0 1.353-.505 2.02-1.622 2.02h-.843z" />',n+='<path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />',n+="</svg>",n+="MP4",n+="</button>",n+="</div>",n+="</div>",$("#download-result .row > div > #video-tab-pane").append(n)})),[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map((t=>new bootstrap.Tooltip(t))),$.each(d,(function(t,e){let o='<audio class="w-100 border border-primary-subtle shadow_hover p-2 rounded-3 auto_dow mb-2" controls>';o+=`<source src="${e.base_url}" type="${e.mime_type}" />`,o+="</audio>",$("#download-result .row > div > #audio-tab-pane").append(o)})),s.length>1){let t='<button id="btn-downAll-video" type="button" class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1 w-100 btn-sm">';t+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi  bi-arrow-down-circle" viewBox="0 0 16 16" >',t+='<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />',t+="</svg>",t+="Download All",t+="</button>",$("#download-result .row > div > #video-tab-pane").append(t)}if(d.length>1){let t='<button id="btn-downAll-audio" type="button" class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1 w-100 btn-sm">';t+='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi  bi-arrow-down-circle" viewBox="0 0 16 16" >',t+='<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />',t+="</svg>",t+="Download All",t+="</button>",$("#download-result .row > div > #audio-tab-pane").append(t)}$("#download-form").addClass("d-none"),$("#download-result").removeClass("d-none"),$("#button-home").removeClass("d-none"),$("#download-title").text(u[0]?u[0]:"Không có tiêu đề"),e.close(),$("audio").on("play",(function(){$("audio").not(this).each((function(t,e){e.paused||e.pause()}))})),$(".downloadLink").on("click",(function(t){t.preventDefault(),Swal.fire({title:"Đang thực hiện tải vui lòng đợi",allowOutsideClick:!1,showConfirmButton:!1,timerProgressBar:!0,width:"380px",didOpen:()=>{Swal.showLoading()}});const e=$(this).attr("data-href");chrome.downloads.download({url:e}).then((()=>successAlert({title:"Tải thành công",timer:1500}))).catch((t=>(console.error(t),errorAlert({title:"Đã xảy ra lỗi khi tải xuống",timer:1500}))))})),$("#btn-downAll-video").click((function(){Swal.fire({title:"Vui lòng chọn chế độ tải",showDenyButton:!0,showCancelButton:!0,confirmButtonText:"MP4 (SD)",denyButtonText:"MP4 (HD)",width:"380px"}).then((async t=>{if(t.isConfirmed){for(const t of s)try{const e=_.get(l,t).browser_native_sd_url;if(!e)continue;await chrome.downloads.download({url:e})}catch(t){}return successAlert({title:"Tải thành công",timer:1500})}if(t.isDenied){for(const t of s)try{const e=_.get(l,t).browser_native_hd_url;if(!e)continue;await chrome.downloads.download({url:e})}catch(t){continue}return successAlert({title:"Tải thành công",timer:1500})}}))})),$("#btn-downAll-audio").click((function(){return d.forEach((async function(t){const e=t.base_url;await chrome.downloads.download({url:e})})),successAlert({title:"Tải thành công",timer:1500})}))}catch(t){console.log(t)}}))}async function m_facebook(){}async function mbasic(){}async function checkLogin(t){return new Promise((async(e,o)=>{let[n]=await chrome.tabs.query({active:!0,currentWindow:!0});chrome.scripting.executeScript({target:{tabId:n.id},func:()=>document.documentElement.outerHTML},(n=>{if(chrome.runtime.lastError)console.error("Lỗi khi thực thi executeScript:",chrome.runtime.lastError),o();else if(n&&n[0]&&n[0].result){let o="";switch(t){case"mbasic.facebook.com":case"m.facebook.com":return;case"www.facebook.com":return null==n[0].result.split('"DTSGInitialData",[],{"token":"')[1]?errorAlert({title:"Vui lòng đăng nhập Facebook trước",timer:3e3,callback:()=>window.close()}):(o=n[0].result.split('"DTSGInitialData",[],{"token":"')[1].split('"')[0],e(o))}}else o()}))}))}function stringToBlob(t,e){for(var o=t,n=o.length,i=new Uint8Array(n),a=0;a<n;++a)i[a]=o.charCodeAt(a);return new Blob([i.buffer],{type:e})}function isValidURL(t){return/(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me|watch)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/.test(t)}function lodashArray(t,e,o=""){const n=new URL(o).search.includes("comment_id=")?2:1;t=_.take(t,n);let i=null;return t.forEach((t=>{const o=_([t]).map("require").flattenDeep().filter((t=>_.isObject(t)&&!_.some(t,(t=>null===t)))).map("__bbox.require").flattenDeep().filter((t=>_.has(t,"__bbox")&&_.isObject(_.get(t,e)))).map(e).head();i?i.comment_id=o:i=o})),i}function findParentKeysWithPlaylist(t){let e=[];function o(t,n=""){_.isObject(t)&&_.forOwn(t,((t,i)=>{const a=n?`${n}.${i}`:i;"playlist"===i?e.push(n):(_.isArray(t)||_.isObject(t))&&o(t,a)}))}return["bucket","video","group","node","feedback","comment_id"].forEach((e=>{_.has(t,`data.${e}`)&&o(_.get(t,`data.${e}`),`data.${e}`)})),e}function findTitlesAndMessages(t){let e=[];return function t(o){_.isObject(o)&&_.forOwn(o,((o,n)=>{_.isObject(o)&&o.message&&o.message.text&&e.push(o.message.text),_.isArray(o)?o.forEach((e=>t(e))):_.isObject(o)&&t(o)}))}(t),e}function findMimeType(t,e){let o=[];return function t(n){_.isObject(n)&&_.forOwn(n,((i,a)=>{"mime_type"===a&&i===e&&o.push(n),_.isArray(i)?i.forEach((e=>t(e))):_.isObject(i)&&t(i)}))}(t),o}function sanitizeFilename(t){return t.replace(/[\\/:"*?<>|]/g," ")}function successAlert({title:t,text:e="",timer:o=1500,callback:n}){return Swal.fire({icon:"success",title:t,text:e,showConfirmButton:!1,allowOutsideClick:!1,timer:o,timerProgressBar:!0,width:"380px"}).then((()=>{n&&n()}))}function errorAlert({title:t,text:e="",timer:o=1500,callback:n}){return Swal.fire({icon:"error",title:t,text:e,showConfirmButton:!1,allowOutsideClick:!1,timer:o,timerProgressBar:!0,width:"380px"}).then((()=>{n&&n()}))}function ToastAlert(t=1500){return Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:t,timerProgressBar:!0,didOpen:t=>{t.onmouseenter=Swal.stopTimer,t.onmouseleave=Swal.resumeTimer}})}async function copyToClipboard({text:t,success:e,error:o}){const n=ToastAlert();try{await navigator.clipboard.writeText(t),n.fire({icon:"success",title:e})}catch(t){console.error("Lỗi:",t),n.fire({icon:"error",title:o})}}document.addEventListener("DOMContentLoaded",(function(){chrome.tabs.query({active:!0,currentWindow:!0},(t=>{let e=t[0],o=new URL(e.url).hostname;return["m.facebook.com","www.facebook.com","mbasic.facebook.com"].includes(o)?onStart(o):Swal.fire({icon:"warning",title:"Chỉ hoạt động tại Facebook",showConfirmButton:!1,allowOutsideClick:!1,timer:3e3,timerProgressBar:!0,width:"380px"}).then((()=>{window.close()}))}))})),$("#button-home").click((function(){$("#download-form").removeClass("d-none"),$("#download-result").addClass("d-none"),$("#button-home").addClass("d-none"),$("#download-result .row > div > #video-tab-pane").empty(),$("#download-result .row > div > #audio-tab-pane").empty(),$("#download-title").text("Facebook Video Downloader")})),$(".coming-soon").click((function(){return Swal.fire({icon:"info",title:"Coming Soon",showConfirmButton:!1,allowOutsideClick:!1,timer:2e3,timerProgressBar:!0,width:"380px"})}));