import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ToursViewModalComponent } from '../tours/tours-view-modal/tours-view-modal.component';
import { TourViewAlumnsModalComponent } from '../tours/tour-view-alumns-modal/tour-view-alumns-modal.component';
import { TourAddCoordinatorModalComponent } from '../tours/tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { Action, calendarDay, OperationalTour, TourView, tourView } from './dashboard-operations';
import { DashboardOperationsService } from './dashboard-operations.service';
import { dashboardExamples } from './dashboard-examples';

@Component({selector:'app-dashboard',templateUrl:'./dashboard.component.html',styleUrls:['./dashboard.component.css']})
export class DashboardComponent implements OnInit, OnDestroy {
  loading=true; error=''; stale=false; examples=false; horizon=7; quietHours=12;
  search=''; tab='all'; selectedId:number|null=null; rows:TourView[]=[]; tours:OperationalTour[]=[];
  now=new Date(); updatedAt:string|null=null; selected:TourView|null=null; message=''; copyStatus='';
  private request?:Subscription;
  private dialogs=new Subscription();
  constructor(private service:DashboardOperationsService, private dialog:MatDialog) {}
  ngOnInit(){this.refresh();}
  ngOnDestroy(){this.request?.unsubscribe();this.dialogs.unsubscribe();}
  refresh(){
    if(this.examples){this.now=new Date();this.recompute();return;}
    this.request?.unsubscribe();this.loading=true;this.error='';
    this.request=this.service.load().subscribe({next:data=>{
      this.tours=data.tours;this.updatedAt=data.generatedAt;this.now=new Date(data.generatedAt);
      this.loading=false;this.stale=false;this.recompute();
    },error:()=>{this.loading=false;this.stale=this.tours.length>0;
      this.error=this.stale?'No se pudo actualizar. Se conserva la última consulta; sus indicadores pueden estar desactualizados.':'No se pudo consultar el resumen operativo. Reintenta para comprobar los pendientes.';}});
  }
  toggleExamples(){this.examples=!this.examples;this.request?.unsubscribe();this.message='';this.selectedId=null;this.search='';this.tab='all';
    if(this.examples){this.now=new Date();this.loading=false;this.error='';this.recompute();}
    else {this.now=new Date(this.updatedAt || Date.now());this.recompute();this.refresh();}}
  recompute(){
    this.message='';this.copyStatus='';
    const source=this.examples?dashboardExamples(this.now):this.tours;
    this.rows=source.map(t=>tourView(t,this.now,this.horizon,this.quietHours));
    this.syncSelection();
  }
  get scope(){return this.rows.filter(r=>['active','upcoming','invalid'].includes(r.phase));}
  get active(){return this.scope.filter(r=>r.phase==='active');}
  get upcoming(){return this.scope.filter(r=>r.phase==='upcoming');}
  get recent(){return this.rows.filter(r=>r.phase==='recent');}
  get attention(){return this.scope.filter(r=>r.alerts.length>0);}
  get missingMedical(){return this.scope.reduce((n,r)=>n+r.missingMedical,0);}
  get pendingPeople(){return this.scope.reduce((n,r)=>n+r.missingStudents,0);}
  get priorities(){return this.scope.flatMap(row=>row.alerts.map(alert=>({row,alert})))
    .sort((a,b)=>a.alert.priority-b.alert.priority || (a.row.daysToGo??-999)-(b.row.daysToGo??-999));}
  get visibleRows(){
    const base=this.tab==='recent'?this.recent:this.tab==='active'?this.active:this.tab==='upcoming'?this.upcoming:this.tab==='attention'?this.attention:this.scope;
    const query=this.search.toLocaleLowerCase('es').trim();
    return base.filter(r=>`${r.source.school} ${r.source.course} ${r.source.code} ${r.source.coordinatorNames||''}`.toLocaleLowerCase('es').includes(query))
      .sort((a,b)=>(a.alerts[0]?.priority??9)-(b.alerts[0]?.priority??9) || (a.daysToGo??-999)-(b.daysToGo??-999) || a.source.id-b.source.id);
  }
  setTab(tab:string){this.tab=tab;this.search='';this.syncSelection();}
  syncSelection(){this.selected=this.visibleRows.find(r=>r.source.id===this.selectedId)||this.visibleRows[0]||null;this.selectedId=this.selected?.source.id??null;this.message='';}
  select(row:TourView){this.selected=row;this.selectedId=row.source.id;this.message='';this.copyStatus='';}
  focus(row:TourView){this.tab=row.phase==='recent'?'recent':'all';this.search='';this.select(row);document.getElementById('gira-detail')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});}
  phaseLabel(row:TourView){return {active:'En curso',upcoming:'Próxima salida',recent:'Finalizada por fecha',invalid:'Revisar fechas',outside:'Fuera del período',cancelled:'Cancelada'}[row.phase];}
  departure(row:TourView){return row.daysToGo===null?'Fechas por revisar':row.daysToGo===0?'Sale hoy':row.daysToGo===1?'Sale mañana':row.daysToGo>0?`Sale en ${row.daysToGo} días`:this.phaseLabel(row);}
  date(value:string){const day=calendarDay(value);return day===null?'Sin fecha válida':new Intl.DateTimeFormat('es-CL',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(day*86400000));}
  get todayLabel(){return new Intl.DateTimeFormat('es-CL',{weekday:'long',day:'numeric',month:'long',timeZone:'America/Santiago'}).format(this.now);}
  get updatedLabel(){return this.updatedAt?new Intl.DateTimeFormat('es-CL',{hour:'2-digit',minute:'2-digit',timeZone:'America/Santiago'}).format(new Date(this.updatedAt)):'—';}
  activity(row:TourView){if(!row.source.milestones)return 'Sin hitos registrados';if(row.hoursSinceHito===null)return 'Fecha por verificar';
    return row.hoursSinceHito<1?'Hace menos de 1 h':`Hace ${Math.floor(row.hoursSinceHito)} h`;}
  open(action:Action,row:TourView){
    if(action==='followup'){this.prepare(row);return;}
    if(this.examples)return;
    const component:any=action==='students'?TourViewAlumnsModalComponent:action==='coordinators'?TourAddCoordinatorModalComponent:ToursViewModalComponent;
    const ref=this.dialog.open(component,{width:'1200px',maxWidth:'94vw',maxHeight:'90vh',autoFocus:false,
      data:action==='students'?{id:row.source.id}:row.source.id});
    this.dialogs.add(ref.afterClosed().subscribe(()=>this.refresh()));
  }
  prepare(row:TourView){this.focus(row);const t=row.source;
    this.message=`Hola, equipo. Revisemos la gira ${t.code} · ${t.school} ${t.course||''} (${this.date(t.startsOn)} al ${this.date(t.endsOn)}).\n\n`+
      (row.alerts.length?row.alerts.map(a=>`• ${a.title}: ${a.detail}`).join('\n'):'No hay pendientes detectados en los controles disponibles.')+
      '\n\nPor favor, confirmar responsables y actualizar la información en Papigiras. Gracias.';
    this.copyStatus='';}
  async copy(){try{await navigator.clipboard.writeText(this.message);this.copyStatus='Texto copiado. No se ha enviado.';}catch{this.copyStatus='Selecciona el texto para copiarlo manualmente.';}}
  trackTour(index:number,row:TourView){return row.source.id;}
}
