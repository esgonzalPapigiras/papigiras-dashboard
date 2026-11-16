const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const code=fs.readFileSync(path.join(__dirname,'../src/app/dashboard/dashboard-operations.ts'),'utf8');
const context={exports:{},Intl,Date,Set};
vm.runInNewContext(ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const {calendarDay,chileDay,tourView,validateOverview}=context.exports;
const now=new Date('2026-11-03T16:00:00Z');
const base={id:1,code:'TEST',school:'Test',course:'3B',startsOn:'2026-11-02',endsOn:'2026-11-07',status:'Activa',
 expectedStudents:3,students:3,medicalRecords:2,missingGuardianContact:1,coordinatorCount:1,coordinatorNames:'Demo',
 milestones:3,photos:0,lastMilestoneAt:'2026-11-02T20:00:00Z',undatedMilestones:0,programMarked:true,insuranceMarked:true};
let count=0;function check(name,fn){fn();count++;console.log('PASS',name);}
const view=(patch={},hours=12)=>tourView({...base,...patch},now,7,hours);
check('Chile date uses Santiago rather than UTC',()=>assert.equal(chileDay(new Date('2026-11-04T01:00:00Z')),calendarDay('2026-11-03')));
check('rejects impossible calendar dates',()=>assert.equal(calendarDay('2026-02-30'),null));
check('accepts legacy day/month/year',()=>assert.equal(calendarDay('03/11/2026'),calendarDay('2026-11-03')));
check('active through return date inclusive',()=>assert.equal(view({endsOn:'2026-11-03'}).phase,'active'));
check('day seven included, day eight excluded',()=>{assert.equal(view({startsOn:'2026-11-10',endsOn:'2026-11-12'}).phase,'upcoming');assert.equal(view({startsOn:'2026-11-11',endsOn:'2026-11-12'}).phase,'outside');});
check('cross-year upcoming dates',()=>assert.equal(tourView({...base,startsOn:'2027-01-02',endsOn:'2027-01-05'},new Date('2026-12-29T15:00Z'),7,12).phase,'upcoming'));
check('cancelled trips never generate alerts',()=>{const r=view({status:' Cancelada '});assert.equal(r.phase,'cancelled');assert.equal(r.alerts.length,0);});
check('bad dates require review',()=>assert.ok(view({endsOn:'2026-01-01'}).alerts.some(a=>a.key==='dates')));
check('closed trips never generate current activity alerts',()=>assert.equal(view({endsOn:'2026-11-02'}).alerts.length,0));
check('medical missing and roster are separate',()=>{const r=view({expectedStudents:5});assert.equal(r.missingStudents,2);assert.equal(r.missingMedical,1);});
check('zero students is not 100% complete',()=>assert.equal(view({students:0,medicalRecords:0,missingGuardianContact:0}).medicalPercent,null));
check('missing contact and assignment trigger actions',()=>{const r=view({coordinatorCount:0});assert.ok(r.alerts.some(a=>a.key==='contact'));assert.ok(r.alerts.some(a=>a.key==='coordinator'));});
check('12-hour threshold differs from 24-hour threshold',()=>{assert.ok(view().alerts.some(a=>a.key==='hitos'));assert.ok(!view({},24).alerts.some(a=>a.key==='hitos'));});
check('future milestone time is unknown, not recent',()=>{const r=view({lastMilestoneAt:'2026-11-04T16:00:00Z'});assert.equal(r.hoursSinceHito,null);assert.ok(r.alerts.some(a=>a.key==='activity-date'));});
check('undated milestones remain explicitly uncertain',()=>assert.ok(view({undatedMilestones:1}).alerts.some(a=>a.key==='activity-date')));
check('no milestones does not penalize a departure without time on day one',()=>assert.ok(!view({startsOn:'2026-11-03',milestones:0,photos:0,lastMilestoneAt:null}).alerts.some(a=>['hitos','photos'].includes(a.key))));
check('zero activity after first day is visible',()=>{const r=view({milestones:0,lastMilestoneAt:null});assert.ok(r.alerts.some(a=>a.key==='hitos'));assert.ok(r.alerts.some(a=>a.key==='photos'));});
check('upcoming trips not penalized for zero activity',()=>assert.ok(!view({startsOn:'2026-11-05',milestones:0,lastMilestoneAt:null}).alerts.some(a=>['hitos','photos'].includes(a.key))));
check('invalid aggregates fail instead of showing misleading zero',()=>assert.throws(()=>validateOverview({generatedAt:now.toISOString(),tours:[{...base,photos:null}]})));
check('medical count cannot exceed students',()=>assert.throws(()=>validateOverview({generatedAt:now.toISOString(),tours:[{...base,medicalRecords:4}]})));
check('duplicate tours rejected',()=>assert.throws(()=>validateOverview({generatedAt:now.toISOString(),tours:[base,base]})));
check('empty overview is valid',()=>assert.equal(validateOverview({generatedAt:now.toISOString(),tours:[]}).tours.length,0));
console.log(`Dashboard operational rules: ${count} checks passed.`);

// State transitions: simulated data must never survive a failed return to the live LAB.
const rx=require('rxjs');
const compile=file=>ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/app/dashboard/',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,experimentalDecorators:true}}).outputText;
const exampleContext={exports:{},Date,require:()=>context.exports};
vm.runInNewContext(compile('dashboard-examples.ts'),exampleContext);
const componentContext={exports:{},Date,Intl,document:{getElementById:()=>null},window:{matchMedia:()=>({matches:true})},require:name=>{
 if(name==='@angular/core')return {Component:()=>value=>value};
 if(name==='rxjs')return rx;
 if(name==='./dashboard-operations')return context.exports;
 if(name==='./dashboard-examples')return exampleContext.exports;
 return {};
}};
vm.runInNewContext(compile('dashboard.component.ts'),componentContext);
const Component=componentContext.exports.DashboardComponent;
let request;const service={load:()=>request=new rx.Subject()};
check('failed initial request shows an error rather than a zero dashboard',()=>{const c=new Component(service,{});c.refresh();request.error(new Error('offline'));assert.ok(c.error);assert.equal(c.updatedAt,null);assert.equal(c.loading,false);c.ngOnDestroy();});
check('failed refresh preserves dated data and marks it stale',()=>{const c=new Component(service,{});c.refresh();request.next({generatedAt:now.toISOString(),tours:[base]});c.refresh();request.error(new Error('offline'));assert.equal(c.tours[0].id,1);assert.equal(c.stale,true);assert.ok(c.error);c.ngOnDestroy();});
check('leaving examples never displays synthetic rows as saved data, even offline',()=>{const c=new Component(service,{});c.refresh();request.next({generatedAt:now.toISOString(),tours:[base]});c.toggleExamples();assert.ok(c.rows.every(r=>r.source.id<0));c.toggleExamples();request.error(new Error('offline'));assert.equal(c.examples,false);assert.ok(c.rows.every(r=>r.source.id>0));assert.equal(c.stale,true);c.ngOnDestroy();});
check('examples entered during an outstanding request cannot be overwritten by its response',()=>{const c=new Component(service,{});c.refresh();const pending=request;c.toggleExamples();pending.next({generatedAt:now.toISOString(),tours:[base]});assert.equal(c.examples,true);assert.ok(c.rows.every(r=>r.source.id<0));c.ngOnDestroy();});
console.log(`Dashboard total: ${count} checks passed.`);
