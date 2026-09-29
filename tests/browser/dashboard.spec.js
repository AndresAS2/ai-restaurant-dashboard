import {test,expect} from '@playwright/test';
const host='https://aqxgvlygrhdssxjmjxqb.supabase.co';
const restaurant={id:'demo-burger-ai',name:'Demo Burger AI',status:'active'};
const now=new Date().toISOString();
async function setup(page,{empty=false,denied=false}={}){
 const db={
 restaurant_users:denied?[]:[{restaurant_id:restaurant.id,restaurants:restaurant}],
 orders:empty?[]:[{id:'order1',restaurant_id:restaurant.id,status:'CONFIRMED',total:22000,created_at:now,is_test:false,details:{fulfillment:'pickup',payment_method:'efectivo'},customers:{name:'Ana',phone:'3000000000'},order_items:[{id:'item1',quantity:1,price:22000,product_id:'p1',menu_products:{name:'Hamburguesa clásica'}}]},{id:'test1',restaurant_id:restaurant.id,status:'TEST',is_test:true,total:99000,created_at:now,details:{},order_items:[]}],
 customers:empty?[]:[{id:'c1',restaurant_id:restaurant.id,name:'Ana',phone:'3000000000'}],
 conversation_history:empty?[]:[{id:'m1',restaurant_id:restaurant.id,customer_id:'c1',channel:'chat',direction:'incoming',message:'Quiero una clásica',created_at:now,metadata:{is_test:true}},{id:'m2',restaurant_id:restaurant.id,customer_id:'c1',channel:'chat',direction:'outgoing',message:'Claro, cuesta 22.000 COP',created_at:now,metadata:{is_test:true}}],
 menu_categories:[{id:'cat1',restaurant_id:restaurant.id,name:'Hamburguesas',active:true}],
 menu_products:empty?[]:[{id:'p1',restaurant_id:restaurant.id,category_id:'cat1',name:'Hamburguesa clásica',price:22000,available:true,description:'Pan y carne'}],
 restaurant_settings:[{id:1,restaurant_id:restaurant.id,config:{welcome:'Hola',untouched:'preserved',menu_images:[]}}]
 };
 const writes=[];
 await page.addInitScript(({key})=>{localStorage.setItem(key,JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+7200,expires_in:7200,token_type:'bearer',user:{id:'user1',email:'test@example.com',app_metadata:{}}}));},{key:'sb-aqxgvlygrhdssxjmjxqb-auth-token'});
 await page.route(host+'/**',async route=>{
 const req=route.request(),u=new URL(req.url());
 if(req.method()==='OPTIONS')return route.fulfill({status:200,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
 if(u.pathname.includes('/auth/'))return route.fulfill({json:{id:'user1',email:'test@example.com',app_metadata:{}}});
 const table=u.pathname.split('/').at(-1);
 if(!(table in db))return route.fulfill({status:404,json:{message:'Unknown table '+table}});
 if(req.method()==='POST')expect(req.postDataJSON().restaurant_id).toBe(restaurant.id);
 else if(!['restaurant_users'].includes(table))expect(u.searchParams.get('restaurant_id')).toBe('eq.demo-burger-ai');
 if(req.method()==='PATCH'||req.method()==='POST'){
 const body=req.postDataJSON();writes.push({table,body});let row=db[table].find(r=>'eq.'+r.id===u.searchParams.get('id'));if(!row){row={id:body.id||2};db[table].push(row);}Object.assign(row,body);return route.fulfill({json:row});
 }
 const single=req.headers().accept?.includes('object+json');
 return route.fulfill({json:single?(db[table][0]||null):db[table]});
 });
 return {db,writes};
}
test('six modules render, edit and preserve settings; no JS errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const {writes}=await setup(page);
 await page.goto('/dashboard');await expect(page.getByRole('heading',{name:'Demo Burger AI'})).toBeVisible();
 await page.getByRole('link',{name:'Pedidos',exact:true}).click();await expect(page.getByText('Total productos').first()).toBeVisible();
 await page.getByRole('combobox',{name:'Estado',exact:true}).selectOption('PREPARING');await expect.poll(()=>writes.some(w=>w.table==='orders'&&w.body.status==='PREPARING')).toBeTruthy();
 await page.getByLabel('Filtrar pedidos').selectOption('test');await expect(page.getByRole('combobox',{name:'Estado',exact:true})).toHaveCount(0);
 await page.getByRole('link',{name:'Conversaciones',exact:true}).click();await expect(page.getByText('Quiero una clásica')).toBeVisible();
 await page.getByRole('link',{name:'Clientes',exact:true}).click();await page.getByRole('button',{name:'Editar nombre'}).click();await page.getByLabel('Nombre',{exact:true}).fill('Ana Actualizada');await page.getByRole('button',{name:'Guardar nombre'}).click();await expect(page.getByRole('heading',{name:'Ana Actualizada'})).toBeVisible();
 await page.getByRole('link',{name:'Menú',exact:true}).click();await page.getByRole('button',{name:'Editar producto'}).click();await page.getByLabel('Precio (COP)').fill('23000');await page.getByRole('button',{name:'Guardar producto'}).click();await expect.poll(()=>writes.some(w=>w.table==='menu_products'&&w.body.price===23000)).toBeTruthy();
 await page.getByRole('link',{name:'Configuración',exact:true}).click();await page.getByLabel('Mensaje de bienvenida').fill('Bienvenido a tu restaurante');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByRole('status')).toHaveText('Configuración guardada.');expect(writes.find(w=>w.table==='restaurant_settings').body.config.untouched).toBe('preserved');
 await page.goto('/master/users');await expect(page).toHaveURL(/dashboard/);expect(errors).toEqual([]);
 await expect(page.getByText('Cargando información…')).toHaveCount(0);
 await page.screenshot({path:'test-results/dashboard-desktop.png',fullPage:true});
});
test('empty screens and mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844});await setup(page,{empty:true});
 for(const path of ['/orders','/conversations','/customers','/menu','/settings','/loyalty','/ai-test']){await page.goto(path);await expect(page.getByRole('heading').first()).toBeVisible();await expect(page.getByText('Cargando información…')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();}
 await page.goto('/menu');await expect(page.getByText('Agrega el primer producto de tu restaurante.')).toBeVisible();
 await page.screenshot({path:'test-results/dashboard-mobile.png',fullPage:true});
});
test('membership missing does not expose restaurant data',async({page})=>{await setup(page,{denied:true});await page.goto('/dashboard');await expect(page.getByRole('heading',{name:'Acceso pendiente'})).toBeVisible();});
test('service failure is visible and retry recovers',async({page})=>{
 await setup(page);let fail=true;
 await page.route(host+'/rest/v1/orders?**',async route=>{if(fail)return route.fulfill({status:403,json:{message:'Acceso denegado'}});return route.fallback();});
 await page.goto('/orders');await expect(page.getByRole('alert')).toContainText('Acceso denegado');fail=false;await page.getByRole('button',{name:'Actualizar'}).click();await expect(page.getByText('Total productos').first()).toBeVisible();
});

test('conversation with latest message is selected first',async({page})=>{
 const {db}=await setup(page);
 db.customers.push({id:'c2',name:'Luis',restaurant_id:restaurant.id});
 db.conversation_history=[
 {...db.conversation_history[0],created_at:'2026-09-28T10:00:00Z'},
 {id:'m3',customer_id:'c2',channel:'chat',direction:'incoming',message:'Mensaje de Luis',created_at:'2026-09-28T11:00:00Z'},
 {...db.conversation_history[1],message:'Último mensaje de Ana',created_at:'2026-09-28T12:00:00Z'}];
 await page.goto('/conversations');
 await expect(page.getByText('Último mensaje de Ana')).toBeVisible();
 await page.getByRole('button',{name:/Luis/}).click();
 await expect(page.getByText('Mensaje de Luis')).toBeVisible();
});

test('new category and product save; invalid prices do not submit',async({page})=>{
 const {writes}=await setup(page,{empty:true});await page.goto('/menu');
 await page.getByRole('button',{name:'Nueva categoría'}).click();
 await page.getByLabel('Nombre de categoría').fill('Bebidas');
 await page.getByRole('button',{name:'Guardar categoría'}).click();
 await expect(page.getByRole('button',{name:'Bebidas',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Nuevo producto'}).click();
 await page.getByLabel('Nombre',{exact:true}).fill('Limonada');
 await page.getByLabel('Precio (COP)').fill('-1');
 await page.getByRole('button',{name:'Guardar producto'}).click();
 expect(writes.filter(w=>w.table==='menu_products')).toHaveLength(0);
 await page.getByLabel('Precio (COP)').fill('9000');
 await page.getByRole('button',{name:'Guardar producto'}).click();
 await expect(page.getByRole('heading',{name:'Limonada'})).toBeVisible();
 expect(writes.find(w=>w.table==='menu_products').body.restaurant_id).toBe(restaurant.id);
});

test('settings reject insecure image; failed save preserves edits',async({page})=>{
 const {writes}=await setup(page);await page.goto('/settings');
 await expect(page.getByLabel('Mensaje de bienvenida')).toHaveValue('Hola');
 await page.getByLabel('Mensaje de bienvenida').fill('Nuevo saludo');
 await page.getByRole('button',{name:'Agregar imagen'}).click();
 await page.getByLabel('Enlace de imagen').fill('http://example.com/menu.png');
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByRole('alert')).toContainText('HTTPS');expect(writes).toHaveLength(0);
 await page.getByLabel('Enlace de imagen').fill('https://example.com/menu.png');
 await page.route(host+'/rest/v1/restaurant_settings?**',route=>route.request().method()==='PATCH'?route.fulfill({status:403,json:{message:'Sin permiso para guardar'}}):route.fallback());
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByRole('alert')).toContainText('Sin permiso');
 await expect(page.getByLabel('Mensaje de bienvenida')).toHaveValue('Nuevo saludo');
});

test('pending access shows logout error',async({page})=>{
 await setup(page,{denied:true});
 await page.route(host+'/auth/v1/logout**',route=>route.fulfill({status:422,json:{message:'No se pudo cerrar sesión'}}));
 await page.goto('/dashboard');await page.getByRole('button',{name:'Cerrar sesión'}).click();
 await expect(page.getByRole('alert')).toContainText('No se pudo cerrar sesión');
});
