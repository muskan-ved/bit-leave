export type organisationssetup ={
    fieldone:number,
    fieldtwo:number,
    fieldthree:number
  }
  
export type setup = 
  {
    id: number|null,
    organisationssetup : Array<organisationssetup>|[]
  }