export type nextAction ={
    type:  string | null,
    identifier:  string | null,
  }

export type notificationTypes = {
        title:  string | null,
        description:  string | null,
        order: number | null,
        nextAction:  nextAction | null  
    }
    