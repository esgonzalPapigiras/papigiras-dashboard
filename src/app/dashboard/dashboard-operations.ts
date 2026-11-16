export interface OperationalTour {
  id: number; code: string; school: string; course: string; startsOn: string; endsOn: string;
  status: string; expectedStudents: number | null; students: number; medicalRecords: number;
  missingGuardianContact: number; coordinatorCount: number; coordinatorNames: string | null;
  milestones: number; photos: number; lastMilestoneAt: string | null; undatedMilestones: number;
  programMarked: boolean | null; insuranceMarked: boolean | null;
}
export interface OperationsResponse { generatedAt: string; tours: OperationalTour[]; }
export type TourPhase = 'active' | 'upcoming' | 'recent' | 'invalid' | 'outside' | 'cancelled';
export type Action = 'students' | 'coordinators' | 'tour' | 'followup';
export interface Attention {
  key: string; title: string; detail: string; owner: string; action: Action; priority: number;
}
export interface TourView {
  source: OperationalTour; phase: TourPhase; daysToGo: number | null;
  missingMedical: number; missingStudents: number; medicalPercent: number | null;
  hoursSinceHito: number | null; alerts: Attention[];
}
const DAY = 86400000;
export function calendarDay(value: string): number | null {
  if (!value) return null;
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) {
    const d = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/.exec(value.trim());
    if (d) m = [d[0], d[3], d[2], d[1]] as RegExpExecArray;
  }
  if (!m) return null;
  const stamp = Date.UTC(+m[1], +m[2]-1, +m[3]);
  const date = new Date(stamp);
  return date.getUTCFullYear()===+m[1] && date.getUTCMonth()===+m[2]-1 && date.getUTCDate()===+m[3]
    ? stamp / DAY : null;
}
export function chileDay(now: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part = (type: string) => parts.find(p=>p.type===type).value;
  return calendarDay(`${part('year')}-${part('month')}-${part('day')}`);
}
export function tourView(t: OperationalTour, now: Date, horizon: number, quietHours: number): TourView {
  const today = chileDay(now), start=calendarDay(t.startsOn), end=calendarDay(t.endsOn);
  let phase: TourPhase;
  if (/^(cancelad[ao]|anulad[ao]|canceled|cancelled)$/i.test((t.status||'').trim())) phase='cancelled';
  else if (start===null || end===null || end<start) phase='invalid';
  else if (start<=today && end>=today) phase='active';
  else if (start>today && start<=today+horizon) phase='upcoming';
  else if (end<today && end>=today-30) phase='recent';
  else phase='outside';
  const missingMedical=t.students-t.medicalRecords;
  const missingStudents=t.expectedStudents>0 ? Math.max(0,t.expectedStudents-t.students) : 0;
  const hito=t.lastMilestoneAt ? Date.parse(t.lastMilestoneAt) : NaN;
  const hours=Number.isFinite(hito) && hito<=now.getTime() ? (now.getTime()-hito)/3600000 : null;
  const alerts: Attention[]=[];
  const add=(key:string,title:string,detail:string,owner:string,action:Action,priority:number)=>alerts.push({key,title,detail,owner,action,priority});
  const urgent=phase==='active' || (start!==null && start-today<=2);
  if (phase==='invalid') add('dates','Revisar fechas','Falta una fecha válida o el regreso es anterior a la salida.','Operaciones','tour',0);
  if (phase==='active' || phase==='upcoming') {
    if (missingMedical>0) add('medical',`${missingMedical} ficha${missingMedical===1?'':'s'} médica${missingMedical===1?'':'s'} pendiente${missingMedical===1?'':'s'}`,
      'Solicitar al apoderado el registro de la ficha.','Coordinación / apoderados','students',urgent?0:1);
    if (missingStudents>0) add('roster',`${missingStudents} alumno${missingStudents===1?'':'s'} por cargar`,
      `${t.students} registrados de ${t.expectedStudents} previstos. Revisar la nómina.`, 'Administración','students',urgent?0:1);
    if (!t.expectedStudents || t.expectedStudents<0) add('capacity','Confirmar alumnos previstos','La cantidad prevista no está definida.','Administración','tour',1);
    else if (t.students>t.expectedStudents) add('capacity','Revisar cantidad de alumnos',`${t.students} cargados; ${t.expectedStudents} previstos.`, 'Administración','students',1);
    if (t.missingGuardianContact>0) add('contact',`${t.missingGuardianContact} alumno${t.missingGuardianContact===1?'':'s'} sin contacto de apoderado`,
      'Falta al menos un teléfono o correo de contacto registrado.','Administración','students',urgent?0:1);
    if (t.coordinatorCount===0) add('coordinator','Asignar coordinación','No hay coordinadores con una asignación activa.','Operaciones','coordinators',0);
    if (t.programMarked!==true) add('program','Revisar programa de viaje','El programa no figura marcado como cargado.','Operaciones','tour',1);
    if (t.insuranceMarked!==true) add('insurance','Revisar póliza','La póliza no figura marcada como cargada.','Operaciones','tour',1);
  }
  if (phase==='active') {
    // Without a departure hour, do not claim 12 elapsed hours on the first calendar day.
    const firstDay=start===today;
    if (t.milestones===0 && !firstDay) add('hitos','Sin hitos registrados','Pedir al equipo una actualización del recorrido.','Coordinación','followup',1);
    else if (t.milestones>0 && hours!==null && hours>=quietHours) add('hitos',`Más de ${quietHours} h sin nuevos hitos`,
      'Confirmar con el equipo si hay novedades por publicar.','Coordinación','followup',1);
    if (t.photos===0 && !firstDay) add('photos','Sin fotos en la gira','Solicitar fotos de las actividades realizadas.','Coordinación','followup',1);
    if (t.milestones>0 && (hours===null || t.undatedMilestones>0)) add('activity-date','Verificar fecha de actividad',
      'Hay hitos sin fecha de registro verificable o con fecha futura.','Operaciones','followup',2);
  }
  alerts.sort((a,b)=>a.priority-b.priority);
  return {source:t,phase,daysToGo:start===null?null:start-today,missingMedical,missingStudents,
    medicalPercent:t.students>0?Math.round(t.medicalRecords/t.students*100):null,hoursSinceHito:hours,alerts};
}
export function validateOverview(data: OperationsResponse): OperationsResponse {
  if (!data || !Array.isArray(data.tours) || !Number.isFinite(Date.parse(data.generatedAt))) throw new Error('Invalid overview');
  const ids=new Set<number>();
  for (const t of data.tours) {
    if (!t || !Number.isSafeInteger(t.id) || ids.has(t.id)) throw new Error('Invalid tour');
    ids.add(t.id);
    for (const key of ['students','medicalRecords','missingGuardianContact','coordinatorCount','milestones','photos','undatedMilestones']) {
      if (!Number.isSafeInteger(t[key]) || t[key]<0) throw new Error('Invalid aggregate');
    }
    if (t.medicalRecords>t.students || t.missingGuardianContact>t.students || t.undatedMilestones>t.milestones) throw new Error('Inconsistent aggregate');
  }
  return data;
}
