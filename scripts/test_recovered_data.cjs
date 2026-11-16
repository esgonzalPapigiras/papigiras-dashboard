const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const rx=require('rxjs');
const root=path.resolve(__dirname,'..');
let count=0;
const check=(label,fn)=>{fn();count++;console.log('PASS',label);};
function load(relative,dependencies={},globals={}){
 const source=fs.readFileSync(path.join(root,relative),'utf8');
 const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,experimentalDecorators:true,target:ts.ScriptTarget.ES2020}}).outputText;
 const context={exports:{},Date,URL,Number,String,console,...globals,require:name=>{
  if(name in dependencies)return dependencies[name];
  if(name==='rxjs'||name==='rxjs/operators')return require(name);
  if(name==='@angular/core')return {Injectable:()=>v=>v,Component:()=>v=>v,ViewChild:()=>()=>{},Inject:()=>()=>{},Optional:()=>()=>{}};
  return {};
 }};
 vm.runInNewContext(output,context);return context.exports;
}
const values=load('src/app/shared/record-values.ts');
const {positiveRecordId,recordList,calendarDate,calendarTimestamp,searchText,tourMatches,tourCommune,escapeHtml,validCoordinates}=values;
check('null API list is empty; valid records are retained',()=>{assert.equal(recordList(null).length,0);assert.equal(recordList([null,{id:1}]).length,1);});
check('legacy and ISO calendar dates match without a timezone shift',()=>assert.equal(calendarTimestamp('03-11-2026'),calendarTimestamp('2026-11-03')));
check('ISO timestamp preserves its written calendar date',()=>assert.equal(calendarDate('2026-11-03T00:00:00Z'),'2026-11-03'));
check('slash-separated legacy dates remain supported',()=>assert.equal(calendarDate('03/11/2026'),'2026-11-03'));
check('invalid and rollover dates are rejected',()=>{for(const v of ['31-02-2026','2026-13-01','29-02-2025',null,'unknown'])assert.equal(calendarDate(v),'');});
check('leap day and Date picker values are accepted',()=>{assert.equal(calendarDate('29-02-2024'),'2024-02-29');assert.equal(calendarDate(new Date(2026,10,3)),'2026-11-03');});
check('null or numeric catalog fields can be searched safely',()=>{assert.equal(searchText(null),'');assert.equal(searchText(2025),'2025');});
const tour={tourSalesUuid:'DEMO-2025',collegeName:'Colegio ficticio',addCourse:null,communesName:'Comuna ficticia',tourSalesInit:'2025-12-30',tourSalesFinal:'03-01-2026'};
check('commune filter uses the full-tour API property',()=>assert.equal(tourMatches(tour,{communesName:'COMUNA'}),true));
check('legacy nested commune remains supported',()=>assert.equal(tourCommune({detalle:{communesName:'Demo'}}),'Demo'));
check('inclusive date range crosses years',()=>assert.equal(tourMatches(tour,{tourSalesInit:'30-12-2025',tourSalesFinal:'2026-01-03'}),true));
check('date range excludes missing or earlier dates',()=>{assert.equal(tourMatches(tour,{tourSalesInit:'31-12-2025'}),false);assert.equal(tourMatches({...tour,tourSalesInit:null},{tourSalesInit:'2025-01-01'}),false);});
check('partial date typing and empty fields do not crash filtering',()=>{assert.equal(tourMatches(tour,{tourSalesInit:'30-'}),true);assert.equal(tourMatches(tour,{addCourse:'A'}),false);});
check('numeric legacy tour reference rejects UUID and invalid identifiers',()=>{assert.equal(positiveRecordId('21'),21);for(const v of [null,'DEMO',0,-1,'1e3','1.2','9007199254740992'])assert.equal(positiveRecordId(v),null);});
check('restored field values cannot break HTML attributes',()=>assert.equal(escapeHtml('\"><img src=x onerror=alert(1)>'), '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'));
check('local location fallback rejects empty and out-of-range coordinates',()=>{assert.equal(validCoordinates(0,0),true);for(const pair of [[null,0],['',0],[91,0],[0,181],['bad',0]])assert.equal(validCoordinates(...pair),false);});
const auth=load('src/app/lab/lab-auth.ts');
const token='header.payload.signature';
check('raw and duplicated Bearer values normalize once',()=>{for(const value of [token,`Bearer ${token}`,`Bearer Bearer ${token}`])assert.equal(auth.normalizeAuthorization(value),`Bearer ${token}`);});
check('empty malformed and injected credentials are rejected',()=>{for(const value of [null,'','Bearer null','Bearer undefined','abc',`Bearer ${token}\r\nX: y`])assert.equal(auth.normalizeAuthorization(value),null);});
class Headers{constructor(value={}){this.value=value;}get(k){return this.value[k]??null;}set(k,v){return new Headers({...this.value,[k]:v});}delete(k){const v={...this.value};delete v[k];return new Headers(v);}}
class HttpErrorResponse extends Error{constructor(v){super('HTTP operation failed');Object.assign(this,v);}}
const policy=load('src/app/lab/lab-network-policy.ts');
const api='http://127.0.0.1:8084';
const interceptorModule=load('src/app/lab/lab-network.interceptor.ts',{'@angular/common/http':{HttpErrorResponse},'../../environments/environment':{environment:{lab:true,apiUrl:api}},'./lab-network-policy':policy,'./lab-auth':auth},{window:{location:{origin:'http://127.0.0.1:4200'}}});
const interceptor=new interceptorModule.LabNetworkInterceptor();
const req=(url,authorization)=>({url,headers:new Headers({Authorization:authorization}),clone(patch){return {...this,...patch};}});
check('API write receives exactly one Bearer header',()=>{let sent;interceptor.intercept(req(api+'/api/example',`Bearer Bearer ${token}`),{handle:r=>{sent=r;return rx.of({});}}).subscribe();assert.equal(sent.headers.get('Authorization'),`Bearer ${token}`);});
check('asset request never receives API credentials',()=>{let sent;interceptor.intercept(req('/assets/demo.png',`Bearer ${token}`),{handle:r=>{sent=r;return rx.of({});}}).subscribe();assert.equal(sent.headers.get('Authorization'),null);});
check('external media request fails before transport',()=>{let called=false,error;interceptor.intercept(req('https://example.test/private',token),{handle:()=>{called=true;return rx.of({});}}).subscribe({error:e=>error=e});assert.equal(called,false);assert.ok(error);assert.ok(!error.message.includes('example.test'));});
check('unhandled HTTP errors omit URL response body and identifiers',()=>{let error;interceptor.intercept(req(api+'/api/example',token),{handle:()=>rx.throwError(()=>new HttpErrorResponse({status:400,url:api+'/private?name=PERSONAL',error:{name:'PERSONAL',medical:'PERSONAL'}}))}).subscribe({error:e=>error=e});assert.equal(error.status,400);assert.ok(!JSON.stringify(error).includes('PERSONAL'));assert.equal(error.url,undefined);});
class Table{constructor(data=[]){this.data=data;this.paginator={firstPage(){}};}}
const swal={fire:options=>{options?.didOpen?.();return Promise.resolve({});},showLoading(){},close(){}};
const Passenger=load('src/app/passengers/passengers.component.ts',{'app/shared/record-values':values,'@angular/material/table':{MatTableDataSource:Table},sweetalert2:{default:swal}}).PassengerComponent;
check('passenger catalog retains earlier years and missing tour codes',()=>{const records=[{codigoGira:'DEMO-2025'},{codigoGira:'DEMO-2026'},{codigoGira:null}];const c=new Passenger({}, {obtenerPasajeros:()=>rx.of(records)}, {},null);c.obtenerTodosPasajeros();assert.equal(c.dataSourceAlumnos.data.length,3);});
check('empty passenger response remains a usable empty catalog',()=>{const c=new Passenger({}, {obtenerPasajeros:()=>rx.of(null)}, {},null);c.obtenerTodosPasajeros();assert.equal(c.dataSourceAlumnos.data.length,0);});
const Coordinator=load('src/app/services/coordinator.service.ts',{'../../environments/environment':{environment:{apiUrl:api}},'@angular/common/http':{HttpHeaders:Headers}},{localStorage:{getItem:()=>token}}).CoordinatorService;
check('image identifiers stay encoded inside the local endpoint',()=>{let target;const c=new Coordinator({get:url=>{target=url;return rx.of({});}});c.fetchImage('demo/a?x=1');assert.equal(target,api+'/api/coordinator/web/images/demo%2Fa%3Fx%3D1');});
const Documents=load('src/app/models/document.ts');
const DocumentModal=load('src/app/tours/tour-download-document-modal/tour-download-document-modal.component.ts',{'app/shared/record-values':values,'app/models/document':Documents,'@angular/material/table':{MatTableDataSource:Table},sweetalert2:{default:swal}}).TourDownloadDocumentModalComponent;
check('missing documents render four empty official slots without crashing',()=>{const c=new DocumentModal({}, {}, {getDocument:()=>rx.of(null)}, {tourSalesId:1});c.obtenerDocumentos();assert.equal(c.dataSource.data.length,4);assert.ok(c.dataSource.data.every(d=>d.documentId===null));});
check('empty document slot cannot request a download or deletion',()=>{let called=false;const c=new DocumentModal({}, {}, {downloadDocument:()=>called=true,deleteDocument:()=>called=true}, {tourSalesId:1});c.applyDownload({documentName:null,documentId:null});c.applyDelete({documentId:null});assert.equal(called,false);});
const MapComponent=load('src/app/maps-coordinator/maps-coordinator.component.ts',{'app/shared/record-values':values,rxjs:{...rx,timer:()=>rx.of(0)}},{setTimeout:fn=>fn()}).MapsCoordinatorComponent;
check('saved positions remain usable with no Google SDK and invalid coordinates',()=>{const c=new MapComponent({getcoordinatorPosition:()=>rx.of([{coordinatorName:'Demo',positionCoordinatorLatitud:-33,positionCoordinatorLongitud:-70,createdAt:null},{coordinatorName:'Demo',positionCoordinatorLatitud:null,positionCoordinatorLongitud:null}])});c.ngOnInit();assert.equal(c.mapAvailable,false);assert.equal(c.markers.length,1);assert.equal(c.markers[0].options.icon,undefined);assert.equal(c.isStale(c.markers[0].coord),true);c.ngOnDestroy();});
// A regression guard against printing recovered records through legacy debug calls.
const violations=[];
function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,item.name);if(item.isDirectory()){scan(file);continue;}
 if(!file.endsWith('.ts')||file.endsWith('.spec.ts'))continue;
 const source=fs.readFileSync(file,'utf8');const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
 function visit(node){if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&node.expression.expression.getText(tree)==='console'){
   if(!['warn','error'].includes(node.expression.name.text)||node.arguments.length!==1||!ts.isStringLiteral(node.arguments[0]))violations.push(path.relative(root,file));
 }ts.forEachChild(node,visit);}visit(tree);
}}
scan(path.join(root,'src/app'));
check('application logs never print runtime payloads',()=>assert.deepEqual(violations,[]));
console.log(`Recovered-data compatibility: ${count} synthetic checks passed; no API or real records used.`);
