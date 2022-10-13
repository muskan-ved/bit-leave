import ReactPlayer from 'react-player'


const ReactPlay = (url:any) => {
    
    return ( 
        <ReactPlayer
        url={url.url}
        playing={true}
        muted={false}
        controls={true}
      />
     );
}
 
export default ReactPlay;