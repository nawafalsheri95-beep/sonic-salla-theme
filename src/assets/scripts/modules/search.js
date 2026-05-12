window.searchProducts = async (q) => { if(!window.salla||!q) return []; const r = await salla.api.search({keyword:q,limit:8}); return r.data; };
