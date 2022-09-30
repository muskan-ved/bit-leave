export type organisationssetup ={
  name:string,
  typeOfUnits:string,
  normalEntitlement:number,
  isPaidLeave:boolean,
  showOnPayslip:boolean
  }
  
export type setup = 
  {
    id: number|null,
    organisationssetup : Array<organisationssetup>|[]
  }