declare const window:any;

export const pageview = (url:string) => {
    if (typeof window !== 'undefined') {
        window.gtag('config',`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`,{
            page_path : url,
        })
      }
}

export const event = ({action,category,label,value}:any) =>{
    if (typeof window !== 'undefined') {
        window.gtag('event',action,{
            event_category:category,
            event_label:label,
            value:value,
        })
   
      }
}