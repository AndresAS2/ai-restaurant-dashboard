import {test,expect} from '@playwright/test';
test('menu files extract into editable review and save only on confirmation',async({page})=>{
 const {writes,uploads}=await setup(page);
 await page.goto('/menu');await page.getByText('Importar menú desde imágenes o PDF',{exact:true}).click();
 await page.getByLabel('Archivos del menú').setInputFiles({name:'menu.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 test fixture')});
 await page.getByRole('button',{name:'Subir 1 archivo(s)',exact:true}).click();
 await expect.poll(()=>uploads.length).toBe(1);
 await page.getByRole('button',{name:'Extraer productos',exact:true}).click();
 await expect(page.getByLabel('Nombre extraído')).toHaveValue('Pizza de prueba');
 expect(writes.some(w=>w.table==='import_reviewed_menu')).toBeFalsy();
 await page.getByLabel('Precio extraído (COP)').fill('27000');
 await page.getByRole('button',{name:'Confirmar y guardar productos seleccionados'}).click();
 await expect(page.getByText('1 productos guardados.')).toBeVisible();
 expect(writes.find(w=>w.table==='import_reviewed_menu').body.p_products[0].price).toBe(27000);
});
test('logo preview and active visual payment save compatible config on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 const {writes,uploads}=await setup(page);
 await page.goto('/settings');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=','base64');
 await page.getByLabel('Subir logo',{exact:true}).setInputFiles({name:'logo.png',mimeType:'image/png',buffer:png});
 await expect(page.getByAltText('Vista previa de logo.png')).toBeVisible();
 await page.getByRole('button',{name:'Subir 1 archivo(s)',exact:true}).click();
 await expect.poll(()=>uploads.length).toBe(1);
 await page.getByRole('button',{name:'Agregar método de pago'}).click();
 await page.getByLabel('Número o cuenta').fill('3000000000');
 await page.getByLabel('Instrucciones de pago').fill('Indica tu número de pedido');
 await page.getByLabel('Imagen para Nequi').setInputFiles({name:'qr.png',mimeType:'image/png',buffer:png});
 await page.getByRole('button',{name:'Subir 1 archivo(s)',exact:true}).click();
 await expect.poll(()=>uploads.length).toBe(2);
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByText('Configuración guardada.',{exact:true})).toBeVisible();
 const c=writes.find(w=>w.table==='restaurant_settings').body.config;
 expect(c.payment_options[0].image_url).toContain('restaurant-assets/demo-burger-ai');
 expect(c.restaurant_profile.logo_url).toContain('restaurant-assets/demo-burger-ai');
 expect(c.payment_methods).toEqual(['nequi']);expect(c.paymentMethods).toContain('3000000000');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.screenshot({path:'test-results/menu-settings-mobile.png',fullPage:true});
});
test('product with order history cannot be deleted',async({page})=>{
 await setup(page);await page.goto('/menu');await page.getByRole('button',{name:'Editar producto'}).click();
 await page.getByText('Eliminar producto',{exact:true}).click();
 await page.getByRole('button',{name:'Confirmar eliminación'}).click();
 await expect(page.getByRole('alert')).toContainText('historial de pedidos');
});
const host='https://aqxgvlygrhdssxjmjxqb.supabase.co';
const restaurant={id:'demo-burger-ai',name:'Demo Burger AI',status:'active'};
const now=new Date().toISOString();
async function setup(page,{empty=false,denied=false,owner=false}={}){
 const email=owner?'suarezjulian2227@gmail.com':'test@example.com';
 const reports={};
 const db={
 restaurants:[{...restaurant}],
 restaurant_users:denied?[]:[{restaurant_id:restaurant.id,restaurants:restaurant}],
 orders:empty?[]:[{id:'order1',restaurant_id:restaurant.id,status:'CONFIRMED',total:22000,created_at:now,is_test:false,details:{fulfillment:'pickup',payment_method:'efectivo'},customers:{name:'Ana',phone:'3000000000'},order_items:[{id:'item1',quantity:1,price:22000,product_id:'p1',menu_products:{name:'Hamburguesa clásica'}}]},{id:'test1',restaurant_id:restaurant.id,status:'TEST',is_test:true,total:99000,created_at:now,details:{},order_items:[]}],
 customers:empty?[]:[{id:'c1',restaurant_id:restaurant.id,name:'Ana',phone:'3000000000'}],
 conversation_history:empty?[]:[{id:'m1',restaurant_id:restaurant.id,customer_id:'c1',channel:'chat',direction:'incoming',message:'Quiero una clásica',created_at:now,metadata:{is_test:true}},{id:'m2',restaurant_id:restaurant.id,customer_id:'c1',channel:'chat',direction:'outgoing',message:'Claro, cuesta 22.000 COP',created_at:now,metadata:{is_test:true}}],
 menu_categories:[{id:'cat1',restaurant_id:restaurant.id,name:'Hamburguesas',active:true}],
 menu_products:empty?[]:[{id:'p1',restaurant_id:restaurant.id,category_id:'cat1',name:'Hamburguesa clásica',price:22000,available:true,description:'Pan y carne'}],
 restaurant_settings:[{id:1,restaurant_id:restaurant.id,config:{welcome:'Hola',untouched:'preserved',menu_images:[]}}]
 };
 const writes=[];
 const uploads=[];
 await page.addInitScript(({key,email})=>{localStorage.setItem(key,JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+7200,expires_in:7200,token_type:'bearer',user:{id:'user1',email,app_metadata:{}}}));},{key:'sb-aqxgvlygrhdssxjmjxqb-auth-token',email});
 await page.route(host+'/**',async route=>{
 const req=route.request(),u=new URL(req.url());
 if(req.method()==='OPTIONS')return route.fulfill({status:200,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}});
 if(u.pathname.includes('/auth/'))return route.fulfill({json:{id:'user1',email,app_metadata:{}}});
 const table=u.pathname.split('/').at(-1);
 if(u.pathname.includes('/storage/v1/object/public/restaurant-assets/'))return route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=','base64')});
 if(u.pathname.includes('/storage/v1/object/restaurant-assets/')){
 expect(u.pathname).toContain('/restaurant-assets/demo-burger-ai/');
 uploads.push(u.pathname);return route.fulfill({json:{Key:u.pathname.split('/object/')[1]}});
 }
 if(u.pathname.includes('/functions/v1/extract-menu')){
 expect(req.postDataJSON().restaurant_id).toBe(restaurant.id);
 return route.fulfill({json:{products:[{name:'Pizza de prueba',category:'Pizzas',price:25000,description:'Tomate y queso',ingredients:['tomate','queso'],available:true}]}});
 }
 if(u.pathname.includes('/rpc/')){
 if(table==='import_reviewed_menu'){const body=req.postDataJSON();expect(body.p_restaurant_id).toBe(restaurant.id);writes.push({table,body});return route.fulfill({json:body.p_products.length});}
 if(table==='delete_unused_menu_product')return route.fulfill({status:400,json:{message:'Este producto tiene historial de pedidos. Desactívalo para conservarlo.'}});
 if(!owner)return route.fulfill({status:403,json:{message:'Forbidden'}});
 const body=req.postDataJSON();
 if(table==='save_owner_finance'){reports[body.p_month]=body.p_values;writes.push({table,body});return route.fulfill({json:null});}
 if(table==='owner_usage_report')return route.fulfill({json:{restaurants:[{restaurant_id:restaurant.id,restaurant_name:restaurant.name,messages:20,test_messages:2,tokens_used:1000000,input_tokens:800000,output_tokens:200000,executions:5,measured_executions:5,unmeasured_executions:0,db_bytes:1000,storage_mb:0,finance:reports[body.p_month]||null}]}});
 }
 if(!(table in db))return route.fulfill({status:404,json:{message:'Unknown table '+table}});
 if(req.method()==='POST')expect(req.postDataJSON().restaurant_id).toBe(restaurant.id);
 else if(table==='restaurants')expect(u.searchParams.get('id')).toBe('eq.demo-burger-ai');
 else if(!['restaurant_users'].includes(table))expect(u.searchParams.get('restaurant_id')).toBe('eq.demo-burger-ai');
 if(req.method()==='PATCH'||req.method()==='POST'){
 const body=req.postDataJSON();writes.push({table,body});let row=db[table].find(r=>'eq.'+r.id===u.searchParams.get('id'));if(!row){row={id:body.id||2};db[table].push(row);}Object.assign(row,body);return route.fulfill({json:row});
 }
 const single=req.headers().accept?.includes('object+json');
 return route.fulfill({json:single?(db[table][0]||null):db[table]});
 });
 return {db,writes,uploads};
}
test('six modules render, edit and preserve settings; no JS errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const {writes}=await setup(page);
 await page.goto('/dashboard');await expect(page.getByRole('heading',{name:'Demo Burger AI',level:1})).toBeVisible();
 await page.getByRole('link',{name:'Pedidos',exact:true}).click();await expect(page.getByText('Total productos').first()).toBeVisible();
 await page.getByRole('combobox',{name:'Estado',exact:true}).selectOption('PREPARING');await expect.poll(()=>writes.some(w=>w.table==='orders'&&w.body.status==='PREPARING')).toBeTruthy();
 await page.getByRole('group',{name:'Filtrar pedidos'}).getByRole('button',{name:'Pruebas',exact:true}).click();await expect(page.getByRole('combobox',{name:'Estado',exact:true})).toHaveCount(0);
 await page.getByRole('link',{name:'Conversaciones',exact:true}).click();await expect(page.getByText('Quiero una clásica')).toBeVisible();
 await page.getByRole('link',{name:'Clientes',exact:true}).click();await page.getByRole('button',{name:'Editar nombre'}).click();await page.getByLabel('Nombre',{exact:true}).fill('Ana Actualizada');await page.getByRole('button',{name:'Guardar nombre'}).click();await expect(page.getByRole('heading',{name:'Ana Actualizada'})).toBeVisible();
 await page.getByRole('link',{name:'Menú',exact:true}).click();await page.getByRole('button',{name:'Editar producto'}).click();await page.getByLabel('Precio (COP)').fill('23000');await page.getByRole('button',{name:'Guardar producto'}).click();await expect.poll(()=>writes.some(w=>w.table==='menu_products'&&w.body.price===23000)).toBeTruthy();
 await page.getByRole('link',{name:'Configuración',exact:true}).click();await page.getByLabel('Dirección',{exact:true}).fill('Calle 10');await page.getByRole('button',{name:'Guardar configuración'}).click();await expect(page.getByRole('status')).toHaveText('Configuración guardada.');expect(writes.find(w=>w.table==='restaurant_settings').body.config.untouched).toBe('preserved');
 await page.goto('/training');await page.getByLabel('Mensaje de bienvenida').fill('Bienvenido a tu restaurante');await page.getByRole('button',{name:'Guardar entrenamiento'}).click();await expect(page.getByRole('status')).toHaveText('Entrenamiento guardado.');
 await page.goto('/master/users');await expect(page).toHaveURL(/dashboard/);expect(errors).toEqual([]);
 await expect(page.getByRole('heading',{name:'Demo Burger AI',level:1})).toBeVisible();
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
 await expect(page.getByRole('article').getByText('Último mensaje de Ana')).toBeVisible();
 await page.getByRole('button',{name:/Luis/}).click();
 await expect(page.getByRole('article').getByText('Mensaje de Luis')).toBeVisible();
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
 await expect(page.getByLabel('Nombre del restaurante')).toHaveValue('Demo Burger AI');
 await page.getByLabel('Dirección',{exact:true}).fill('Nueva dirección');
 await page.getByRole('button',{name:'Agregar imagen'}).click();
 await page.getByLabel('Enlace de imagen').fill('http://example.com/menu.png');
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByRole('alert')).toContainText('HTTPS');expect(writes).toHaveLength(0);
 await page.getByLabel('Enlace de imagen').fill('https://example.com/menu.png');
 await page.route(host+'/rest/v1/restaurant_settings?**',route=>route.request().method()==='PATCH'?route.fulfill({status:403,json:{message:'Sin permiso para guardar'}}):route.fallback());
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByRole('alert')).toContainText('Sin permiso');
 await expect(page.getByLabel('Dirección',{exact:true})).toHaveValue('Nueva dirección');
});

test('pending access shows logout error',async({page})=>{
 await setup(page,{denied:true});
 await page.route(host+'/auth/v1/logout**',route=>route.fulfill({status:422,json:{message:'No se pudo cerrar sesión'}}));
 await page.goto('/dashboard');await page.getByRole('button',{name:'Cerrar sesión'}).click();
 await expect(page.getByRole('alert')).toContainText('No se pudo cerrar sesión');
});

test('restaurant settings and training stay separate and preserve each other',async({page})=>{
 const {db}=await setup(page);
 await page.goto('/settings');
 await expect(page.getByLabel('Nombre del restaurante')).toHaveValue('Demo Burger AI');
 await expect(page.getByLabel('Personalidad',{exact:true})).toHaveCount(0);
 await page.getByLabel('Nombre del restaurante').fill('Restaurante actualizado');
 await page.getByLabel('Dirección',{exact:true}).fill('Calle 25');
 await page.getByRole('button',{name:'Guardar configuración'}).click();
 await expect(page.getByRole('status')).toHaveText('Configuración guardada.');
 await page.goto('/training');
 await expect(page.getByLabel('Dirección',{exact:true})).toHaveCount(0);
 await page.getByLabel('Personalidad',{exact:true}).fill('Amable y breve');
 await page.getByLabel('Preguntas frecuentes').fill('¿Domicilios? Sí.');
 await page.getByRole('button',{name:'Guardar entrenamiento'}).click();
 await expect(page.getByRole('status')).toHaveText('Entrenamiento guardado.');
 expect(db.restaurant_settings[0].config.restaurant_profile.address).toBe('Calle 25');
 expect(db.restaurant_settings[0].config.personality).toBe('Amable y breve');
 expect(db.restaurant_settings[0].config.untouched).toBe('preserved');
 await page.goto('/settings');await expect(page.getByLabel('Dirección',{exact:true})).toHaveValue('Calle 25');
});

test('customer purchases and conversation metadata reflect recorded data',async({page})=>{
 const {db}=await setup(page);
 Object.assign(db.orders[0],{customer_id:'c1',status:'DELIVERED'});
 db.conversation_history[1].metadata={intent:'order',response_time_ms:1500};
 await page.goto('/customers');
 await expect(page.getByText(/1 compras entregadas/)).toBeVisible();
 await expect(page.getByText(/Última interacción:/)).toBeVisible();
 await page.getByText('Historial de pedidos (1)').click();
 await expect(page.getByText('order1',{exact:true})).toBeVisible();
 await page.goto('/conversations');
 await expect(page.getByText('Intención: order')).toBeVisible();
 await expect(page.getByText('Tiempo de respuesta IA: 1,5 s')).toBeVisible();
});

test('pending aliases and menu filters show clear results',async({page})=>{
 const {db}=await setup(page);db.orders[0].status='PENDING_CONFIRMATION';
 await page.goto('/orders');await page.getByLabel('Filtrar por estado').selectOption('PENDING');
 await expect(page.getByText('Total productos')).toBeVisible();
 await page.getByLabel('Filtrar por estado').selectOption('READY');
 await expect(page.getByText('No hay pedidos para este filtro.')).toBeVisible();
 await page.goto('/menu');await page.getByLabel('Filtrar disponibilidad').selectOption('unavailable');
 await expect(page.getByText('No hay productos para estos filtros.')).toBeVisible();
});

test('missing dates and legacy schedules do not crash screens',async({page})=>{
 const {db}=await setup(page);
 db.orders[0].created_at=null;db.orders[1].created_at='invalid-date';
 db.conversation_history[0].created_at=null;
 db.restaurant_settings[0].config.restaurant_profile={hours:{monday:'09:00'}};
 for(const route of ['/dashboard','/orders','/conversations','/settings']){
 await page.goto(route);await expect(page.getByText('Cargando información…')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'No se pudo mostrar esta pantalla'})).toHaveCount(0);
 await expect(page.getByRole('alert')).toHaveCount(0);
 }
 await expect(page.getByLabel('Nombre del restaurante')).toHaveValue('Demo Burger AI');
});

test('saved notices clear after further edits',async({page})=>{
 await setup(page);
 for(const [route,label,button] of [['/settings','Dirección','Guardar configuración'],['/training','Personalidad','Guardar entrenamiento']]){
 await page.goto(route);await expect(page.getByText('Cargando información…')).toHaveCount(0);
 await page.getByLabel(label,{exact:true}).fill('Texto guardado');
 await page.getByRole('button',{name:button}).click();await expect(page.getByRole('status')).toBeVisible();
 await page.getByRole('textbox',{name:label,exact:true}).fill('Cambio sin guardar');await expect(page.getByRole('status')).toHaveCount(0);
 }
});

test('long content fits narrow mobile screens',async({page})=>{
 const {db}=await setup(page);await page.setViewportSize({width:360,height:800});
 const long='NombreMuyLargoSinEspacios'.repeat(8);
 db.customers[0].name=long;db.menu_products[0].name=long;db.orders[0].details.customer_name=long;
 for(const route of ['/orders','/customers','/menu','/conversations','/settings','/training']){
 await page.goto(route);await expect(page.getByText('Cargando información…')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 }
 await page.screenshot({path:'test-results/qa-mobile.png',fullPage:true});
});

test('mobile navigation and conversation list work without hiding modules',async({page})=>{
 await setup(page);await page.setViewportSize({width:390,height:844});await page.goto('/dashboard');
 await page.getByRole('button',{name:'Abrir navegación'}).click();
 await expect(page.getByRole('link',{name:'Fidelización',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Conversaciones',exact:true}).click();
 await expect(page.getByRole('button',{name:'Abrir navegación'})).toBeVisible();
 await page.getByRole('button',{name:/Ana chat/}).click();
 await expect(page.getByRole('article').getByText('Quiero una clásica')).toBeVisible();
 await page.getByRole('button',{name:'Volver a conversaciones'}).click();
 await expect(page.getByLabel('Buscar conversación')).toBeVisible();
 await page.screenshot({path:'test-results/crm-mobile.png',fullPage:true});
});

test('ADMIN is hidden and direct navigation is denied for other accounts',async({page})=>{
 await setup(page);await page.goto('/dashboard');await expect(page.getByRole('heading',{name:'Demo Burger AI',level:1})).toBeVisible();
 await expect(page.getByRole('link',{name:'ADMIN',exact:true})).toHaveCount(0);
 await page.goto('/admin');await expect(page).toHaveURL(/dashboard/);
});

test('owner ADMIN recalculates, saves costs and separates months on mobile',async({page})=>{
 const {writes}=await setup(page,{owner:true});await page.setViewportSize({width:390,height:844});await page.goto('/admin');
 await expect(page.getByRole('heading',{name:'ADMIN',exact:true})).toBeVisible();
 await page.getByText('Editar plan y costos',{exact:true}).click();
 await page.getByLabel('Nombre del plan',{exact:true}).fill('Profesional');
 await page.getByLabel('Precio mensual del plan (COP)',{exact:true}).fill('100000');
 await page.getByLabel('Cambio: COP por 1 USD',{exact:true}).fill('4000');
 await page.getByLabel('IA: USD por millón de tokens de entrada',{exact:true}).fill('1');
 await page.getByLabel('IA: USD por millón de tokens de salida',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Agregar servicio',exact:true}).click();
 await page.getByLabel('Servicio 1',{exact:true}).fill('VPS');await page.getByLabel('Importe 1',{exact:true}).fill('10');
 await expect(page.getByText('11,2 USD',{exact:true})).toBeVisible();await expect(page.getByText('55,2%',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Guardar plan y costos',exact:true}).click();await expect(page.getByText('Costos guardados.',{exact:true})).toBeVisible();
 expect(writes.some(w=>w.table==='save_owner_finance'&&w.body.p_values.services[0].name==='VPS')).toBeTruthy();
 await page.getByRole('button',{name:'Actualizar',exact:true}).click();await expect(page.getByText('11,2 USD',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.screenshot({path:'test-results/admin-mobile.png',fullPage:true});
 await page.getByLabel('Mes del informe',{exact:true}).fill('2025-01');await expect(page.getByText('Sin configurar',{exact:true})).toBeVisible();
});
