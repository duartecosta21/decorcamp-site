(function(){
var d=document,R=matchMedia('(prefers-reduced-motion: reduce)').matches,IO='IntersectionObserver' in window;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}
/* abertura: a foto assenta (zoom suave); entrada de secoes ao rolar */
var hf=$('.hero.full');
if(hf){if(R){hf.classList.add('go')}else{requestAnimationFrame(function(){requestAnimationFrame(function(){hf.classList.add('go')})})}}
var rev=$$('.fade,.head-s,.cols>div,.time>div,.passos .intro');
if(R||!IO){rev.forEach(function(e){e.classList.add('in')});$$('.gal a').forEach(function(e){e.classList.add('in')})}
else{
  var fio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fio.unobserve(e.target);var el=e.target,i=+el.dataset.i||0;setTimeout(function(){el.classList.add('in')},Math.min(i,8)*70)}})},{rootMargin:'0px 0px -8% 0px'});
  rev.forEach(function(e,i){if(e.classList.contains('tile')||e.classList.contains('mt'))e.dataset.i=(i%3);fio.observe(e)});
  $$('.gal').forEach(function(g){$$('a',g).forEach(function(a,i){a.dataset.i=i%6;fio.observe(a)})});
}
/* paralaxe sutil das fotos de fundo (so sem preferencia de movimento reduzido) */
var par=$$('[data-par]');
if(par.length&&!R){
  var tk=false;
  var pu=function(){tk=false;var vh=innerHeight;par.forEach(function(p){var r=p.parentNode.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;var k=(r.top+r.height/2-vh/2)/vh;p.style.transform='translate3d(0,'+(k*-6).toFixed(2)+'%,0)'})};
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(pu)}},{passive:true});pu();
}
/* cabecalho: solido depois da primeira dobra e com o menu aberto */
var hd=$('.head');
if(hd){var hs=function(){hd.classList.toggle('solid',scrollY>40)};addEventListener('scroll',hs,{passive:true});hs()}
/* contador */
function fmt(n,dec){return dec?n.toFixed(1).replace('.',','):String(Math.round(n))}
$$('[data-count]').forEach(function(el){
  var to=parseFloat(el.dataset.count),dec=el.dataset.count.indexOf('.')>-1?1:0;
  if(R||!IO){el.textContent=fmt(to,dec);return}
  var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;ob.disconnect();var t0=performance.now(),du=1300;
    (function f(t){var p=Math.min(1,(t-t0)/du),k=1-Math.pow(1-p,3);el.textContent=fmt(to*k,dec);if(p<1)requestAnimationFrame(f);else el.textContent=fmt(to,dec)})(t0)})},{threshold:.6});
  ob.observe(el);
});
/* menu */
var mb=$('.menu-b'),pn=$('.panel');
if(mb&&pn){
  mb.addEventListener('click',function(){var o=pn.classList.toggle('on');if(hd)hd.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Fechar menu':'Abrir menu');d.body.style.overflow=o?'hidden':''});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&pn.classList.contains('on')){mb.click();mb.focus()}});
  $$('a',pn).forEach(function(a){a.addEventListener('click',function(){pn.classList.remove('on');d.body.style.overflow=''})});
}
/* barra fixa celular: aparece depois do hero, some quando o contato esta na tela */
var barra=$('.barra'),hero=$('.hero'),alvo=$$('[data-contato]');
if(barra){
  var vis={},upd=function(){var y=scrollY,h=hero?hero.offsetHeight*.7:200,hide=Object.keys(vis).some(function(k){return vis[k]});barra.classList.toggle('on',y>h&&!hide)};
  if(IO){var bo=new IntersectionObserver(function(es){es.forEach(function(e){vis[e.target.dataset.contato+'_'+(e.target.id||'x')]=e.isIntersecting});upd()});alvo.forEach(function(e,i){e.id=e.id||'ct'+i;bo.observe(e)})}
  addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
}
/* carrosseis */
$$('.car').forEach(function(car){
  var tr=$('.car-t',car),pv=$('.car-b.p',car),nx=$('.car-b.n',car),pb=$('.car-p i',car),drag=null,moved=0;
  function step(){var c=tr.children[0];return c?c.getBoundingClientRect().width+16:300}
  function upd(){var m=tr.scrollWidth-tr.clientWidth,s=tr.scrollLeft;if(pv)pv.disabled=s<4;if(nx)nx.disabled=s>m-4;if(pb){var w=Math.max(.12,tr.clientWidth/tr.scrollWidth);pb.style.width=(w*100)+'%';pb.style.marginLeft=(m>0?(s/m)*(100-w*100):0)+'%'}}
  function go(k){tr.scrollBy({left:k*step(),behavior:R?'auto':'smooth'})}
  if(pv)pv.addEventListener('click',function(){go(-1)});
  if(nx)nx.addEventListener('click',function(){go(1)});
  tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  addEventListener('resize',upd);
  tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
  tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,s:tr.scrollLeft};moved=0});
  addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x;if(Math.abs(dx)>4){moved=1;tr.classList.add('drag')}if(moved)tr.scrollLeft=drag.s-dx});
  addEventListener('pointerup',function(){if(!drag)return;drag=null;if(moved){var s=step(),t=Math.round(tr.scrollLeft/s)*s;tr.classList.remove('drag');tr.scrollTo({left:t,behavior:R?'auto':'smooth'})}});
  $$('.rv p.cl',car).forEach(function(p){p.addEventListener('click',function(){p.classList.toggle('open')})});
  upd();
});
/* passos */
var pas=$$('.passo');
if(pas.length&&IO&&!R){
  var po=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('on',e.isIntersecting)});
    var pbar=$('.pbar i');if(pbar){var on=pas.filter(function(x){return x.classList.contains('on')});var last=on.length?pas.indexOf(on[on.length-1])+1:0;pbar.parentNode.style.setProperty('--p',last/pas.length)}
  },{rootMargin:'-38% 0px -38% 0px'});
  pas.forEach(function(p){po.observe(p)});
  $('.pbar').style.setProperty('--p',0);
}else{pas.forEach(function(p){p.classList.add('on')})}
/* galeria / lightbox */
var dlg=$('dialog.lb');
if(dlg){
  var items=[],cur=0,opener=null,img=$('img',dlg),cnt=$('.lbc',dlg);
  function show(i){cur=(i+items.length)%items.length;var a=items[cur];img.src=a.href;img.alt=a.dataset.alt||'';cnt.textContent=(cur+1)+' de '+items.length+'. '+(a.dataset.cr||'')}
  $$('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){
    e.preventDefault();var g=a.dataset.lb;items=$$('[data-lb="'+g+'"]');opener=a;show(items.indexOf(a));if(!dlg.open)dlg.showModal()})});
  $('.lbx',dlg).addEventListener('click',function(){dlg.close()});
  $('.lbp',dlg).addEventListener('click',function(){show(cur-1)});
  $('.lbn',dlg).addEventListener('click',function(){show(cur+1)});
  dlg.addEventListener('close',function(){if(opener)opener.focus()});
  dlg.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+1);else if(e.key==='ArrowLeft')show(cur-1)});
  dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.classList.contains('lbw'))dlg.close()});
  var tx=null;dlg.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  dlg.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))},{passive:true});
}
/* videos sob demanda */
var PL='<svg class="i f" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';
$$('.vd').forEach(function(b){b.addEventListener('click',function(){
  $$('.vd.on video').forEach(function(v){v.pause()});
  var v=$('video',b);
  if(!v){v=d.createElement('video');v.src=b.dataset.src;v.controls=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-label',b.dataset.t||'Vídeo');v.addEventListener('ended',function(){});b.appendChild(v);}
  b.classList.add('on');var p=v.play();if(p&&p.catch)p.catch(function(){});
  b.setAttribute('aria-label','Reproduzindo: '+(b.dataset.t||'vídeo'));
  $$('.vd').forEach(function(o){if(o!==b){var ov=$('video',o);if(ov)ov.pause()}});
})});
/* filtros de avaliacoes */
var lista=$('.lista');
if(lista){
  var cards=$$('.rv',lista),fp='todas',fs='todas',fotos=false,shown=24,st=$('#resumo'),mais=$('#mais');
  function ok(c){return (fp==='todas'||c.dataset.p.split(' ').indexOf(fp)>-1||(fp==='geral'&&c.dataset.p===''))&&(fs==='todas'||(fs==='5'?c.dataset.s==='5':+c.dataset.s<5))&&(!fotos||c.dataset.f==='1')}
  function apply(first){
    var m=cards.filter(ok);
    cards.forEach(function(c){var show=m.indexOf(c)>-1&&m.indexOf(c)<shown;
      if(show){if(c.hidden){c.hidden=false}}else if(!c.hidden){c.hidden=true}});
    st.textContent=m.length+' '+(m.length===1?'avaliação':'avaliações');
    mais.hidden=m.length<=shown;
  }
  function chips(sel,fn){$$(sel).forEach(function(b){b.addEventListener('click',function(){
    $$(sel).forEach(function(o){o.setAttribute('aria-pressed',o===b)});fn(b.dataset.v);shown=24;
    apply();
  })})}
  chips('[data-f=p] .chip',function(v){fp=v});
  chips('[data-f=s] .chip[data-v]',function(v){fs=v});
  var cf=$('#cf');if(cf)cf.addEventListener('click',function(){fotos=!fotos;cf.setAttribute('aria-pressed',fotos);shown=24;apply()});
  mais.addEventListener('click',function(){shown+=24;apply()});
  var h=location.hash.replace('#','');if(h){var b=$('[data-f=p] .chip[data-v="'+h+'"]');if(b)b.click()}
  d.documentElement.classList.add('fl');apply();
}
/* contato: monta o link do WhatsApp com a mensagem revisavel */
var fm=$('#fm');
if(fm){
  var ta=$('textarea',fm),a=$('#fwa'),n=a.dataset.n;
  var M={cortinas:'cortinas de tecido',persianas:'persianas',rolo:'rolô, Double Vision ou Romana',motor:'motorização para cortinas ou persianas',toldos:'toldo',papel:'papel de parede',outro:'cortinas ou persianas'};
  var edit=false;
  function msg(){var v=($('input:checked',fm)||{}).value||'outro';return 'Olá! Vim pelo site da Decor Camp e quero um orçamento de '+M[v]+'. Pode me ajudar?'}
  function link(){a.href='https://wa.me/'+n+'?text='+encodeURIComponent(ta.value)}
  ta.value=msg();link();
  $$('input[name=prod]',fm).forEach(function(i){i.addEventListener('change',function(){if(!edit)ta.value=msg();link()})});
  ta.addEventListener('input',function(){edit=true;link()});
  var q=location.hash.replace('#','');if(q&&M[q]){var r=$('input[value="'+q+'"]',fm);if(r){r.checked=true;ta.value=msg();link()}}
}
})();

/* rodizio da capa da home: troca a cada 6 s, so com a pagina visivel e sem movimento reduzido */
(function(){var h=document.querySelector('.hero.rod');if(!h)return;var s=[].slice.call(h.querySelectorAll('.hbg.sl'));if(s.length<2)return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;var i=0;
function nx(){if(document.hidden)return;var n=(i+1)%s.length,img=s[n].querySelector('img');img.loading='eager';
var go=function(){s[i].classList.remove('on');s[i].setAttribute('aria-hidden','true');s[n].classList.add('on');s[n].removeAttribute('aria-hidden');i=n};
if(img.complete&&img.naturalWidth)go();else (img.decode?img.decode().then(go,go):img.addEventListener('load',go,{once:true}))}
setTimeout(function(){s.slice(1,2).forEach(function(x){x.querySelector('img').loading='eager'});setInterval(nx,6000)},1500)})();
