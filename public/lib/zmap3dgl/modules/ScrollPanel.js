export default class{constructor(t={}){const{delay:e,height:n,width:s,left:i,top:l,bottom:o,right:c}=t;this.delay=e||500,this.panel=document.createElement("div"),this.panel.className="scrollpanel",this.panel.style.width=s,this.panel.style.height=n,this.panel.style.left=i,this.panel.style.top=l,this.panel.style.bottom=o,this.panel.style.right=c,this.content=document.createElement("ul"),this.content.className="content",this.contentcp=document.createElement("ul"),this.contentcp.className="contentcopy",this.panel.appendChild(this.content),this.panel.appendChild(this.contentcp),this.contentcp.innerHTML=this.content.innerHTML,document.body.appendChild(this.panel),this.content.addEventListener("DOMSubtreeModified",t=>{this.update()})}startScroll(){this.timer=window.setInterval(this.scroll,this.delay,this)}stop(){window.clearTimeout(this.timer)}scroll(t){const{panel:e,content:n,contentcp:s}=t;s.offsetTop-n.offsetTop<e.scrollTop?e.scrollTop=0:e.scrollTop++}add(t){const{content:e}=this,n=document.createElement("li");n.innerText=t,e.appendChild(n),this.update()}update(){this.contentcp.innerHTML=this.content.innerHTML}clear(){this.stop(),document.body.removeChild(this.panel)}}