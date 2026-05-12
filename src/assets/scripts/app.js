import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import intersect from '@alpinejs/intersect';

Alpine.plugin(collapse);
Alpine.plugin(focus);
Alpine.plugin(intersect);

Alpine.store('cart', {
  items:[], count:0, subtotal:'0 SAR', checkoutUrl:'/checkout', freeShippingThreshold:200,
  init() { if(window.salla){salla.cart.event.onUpdated(s=>this.update(s));salla.cart.event.onItemAdded(()=>this.handleItemAdded());} this.refresh(); },
  async refresh() { if(!window.salla)return; try{const c=await salla.cart.getSummary();this.update(c);}catch(e){} },
  update(s) { this.items=s.items||[];this.count=s.count||0;this.subtotal=s.sub_total_string||'0 SAR'; },
  async remove(id){await salla.cart.deleteItem(id);},
  handleItemAdded(){window.dispatchEvent(new CustomEvent('open-cart'));this.refresh();}
});

Alpine.store('wishlist',{
  ids:new Set(),
  init(){if(window.salla){salla.wishlist.event.onAdded(id=>this.ids.add(id));salla.wishlist.event.onRemoved(id=>this.ids.delete(id));this.refresh();}},
  async refresh(){if(!window.salla)return;try{const i=await salla.wishlist.fetch();this.ids=new Set(i.map(x=>x.id));}catch(e){}},
  has(id){return this.ids.has(id);},
  async toggle(id){this.has(id)?await salla.wishlist.removeItem(id):await salla.wishlist.addItem(id);}
});

Alpine.store('ui',{
  scrollY:0,
  init(){window.addEventListener('scroll',()=>{this.scrollY=window.scrollY;},{passive:true});},
  get scrolled(){return this.scrollY>50;}
});

window.Alpine=Alpine;
Alpine.start();

document.addEventListener('DOMContentLoaded',()=>{
  if(window.salla){salla.onReady(()=>{console.log('🎵 Sonic ready');});}
  document.querySelectorAll('[data-reveal]').forEach(el=>{
    new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('is-revealed');}},{threshold:0.1}).observe(el);
  });
});
