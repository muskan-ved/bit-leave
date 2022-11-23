export type organisationssettings ={
    thrleavenotification:number,
    thrleavewarning:number,
    thrpayoutfrequency:number
  }
  
export type thresholds = 
  {
    id: number|null,
    organisationssettings : Array<organisationssettings>|[]
  }