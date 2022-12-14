import React, { Fragment } from "react";
import randomcolor from "randomcolor";
import data from "./data.json";

function randomIntFromInterval(min:any, max:any) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const Card = (props:any) => {
  const levelColor = randomcolor();
  return (
    <ul>
      {props.data.map((item:any,index:any) => (
        <Fragment key={item.name}>
          <li>
            <div className="card">
              <div className="image">
                <img
                  src={"https://randomuser.me/api/portraits/men/"+randomIntFromInterval(1,100)+".jpg"}
                  alt="Profile"
                  style={{ borderColor: levelColor }}
                />
              </div>
              <div className="card-body">
                <h4>{item.name}</h4>
                <p>demo content</p>
              </div>
              <div className="card-footer" style={{ background: levelColor }}>
                
                <img
                  src={'/images/avatars/one.png'}
                  alt="Chat"
                />
                <img
                  src={'/images/avatars/two.png'}
                  alt="Call"
                />
                <img
                  src={'/images/avatars/three.png'}
                  alt="Video"
                />
              </div>
              <div></div>
            </div>
            {item.children?.length && <Card data={item.children} />}
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

const Chart = () => {
  return (
    <div className="org-tree" style={{width:'max-content'}}>
      <Card data={data} />
    </div>
  );
};

export default Chart;