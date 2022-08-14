export type organisationssettings ={
    thrleavenotification:number,
    thrleavewarning:number,
    thrpayoutfrequency:number
  }
  
export type organisation = 
  {
    id: number,
    organisationssettings : Array<organisationssettings>
  }