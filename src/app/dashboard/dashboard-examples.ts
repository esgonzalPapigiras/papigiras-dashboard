import { chileDay, OperationalTour } from './dashboard-operations';
// Explicit opt-in UI examples. Never written to the database; management actions are disabled.
export function dashboardExamples(now: Date): OperationalTour[] {
  const date=(offset:number)=>new Date((chileDay(now)+offset)*86400000).toISOString().slice(0,10);
  const base:OperationalTour={id:-1,code:'EJEMPLO-01',school:'Colegio Horizonte · Ejemplo',course:'3° B',
    startsOn:date(-2),endsOn:date(3),status:'Activa',expectedStudents:32,students:32,medicalRecords:30,
    missingGuardianContact:1,coordinatorCount:1,coordinatorNames:'Alex · Ejemplo',milestones:8,photos:24,
    lastMilestoneAt:new Date(now.getTime()-15*3600000).toISOString(),undatedMilestones:0,programMarked:true,insuranceMarked:true};
  return [base,{...base,id:-2,code:'EJEMPLO-02',school:'Colegio Los Alerces · Ejemplo',course:'4° A',
    startsOn:date(2),endsOn:date(7),expectedStudents:28,students:25,medicalRecords:19,missingGuardianContact:0,
    coordinatorCount:0,coordinatorNames:null,milestones:0,photos:0,lastMilestoneAt:null,insuranceMarked:false},
    {...base,id:-3,code:'EJEMPLO-03',school:'Colegio del Valle · Ejemplo',course:'3° A',startsOn:date(-1),endsOn:date(4),
    expectedStudents:24,students:24,medicalRecords:24,missingGuardianContact:0,coordinatorNames:'Antonia · Ejemplo',
    milestones:4,photos:12,lastMilestoneAt:new Date(now.getTime()-2*3600000).toISOString()},
    {...base,id:-4,code:'EJEMPLO-04',school:'Colegio Austral · Ejemplo',course:'4° B',startsOn:date(5),endsOn:date(10),
    expectedStudents:30,students:30,medicalRecords:30,missingGuardianContact:0,coordinatorNames:'Diego · Ejemplo',
    milestones:0,photos:0,lastMilestoneAt:null}];
}
