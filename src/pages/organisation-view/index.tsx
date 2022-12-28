import React, { Fragment, useEffect, useState } from "react";
import randomcolor from "randomcolor";
import { OrgView } from "src/store/organisation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { CircularProgress } from "@mui/material";

function randomIntFromInterval(min:any, max:any) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const Card = (props:any) => {
  const levelColor = randomcolor({
    luminosity: 'light',
    hue: 'random'
 });
  return (
    <ul>
      {props.data.map((item:any) => (
        <Fragment key={item.id}>
          <li>
            <div className="card">
              <div className="image">
                <img
                  src={"https://randomuser.me/api/portraits/men/"+randomIntFromInterval(1,100)+".jpg"}
                  alt="Profile"
                  style={{ borderColor: levelColor }}
                />
              </div>
              <div className="card-body" style={{background:'#f7f7f9'}}>
                <h4>{item.fullname}</h4>
              </div>
              <div className="card-footer" style={{ background: levelColor,padding:'10px' }}>
                <p >Title: {item.title}</p>
              </div>
              <div></div>
            </div>
            {item.items?.length > 0 && <Card data={item.items} />}
          </li>
        </Fragment>
      ))}
    </ul>
  );
};

const Chart = () => {

  const [orgviewdata, setOrgViewData] = useState<any>([
    {
      "id": "MO1",
      "fullname": "ROOT",
      "title": "owner",
      "items": [
        {
          "id": "MO2",
          "fullname": "Child One",
          "title": "Employee",
          "items": [
          ]
        },
        
        {
          "id": "MO4",
          "fullname": "Child Two",
          "title": "Employee",
          "items": [
            {
              "id": "MO41",
              "fullname": "Child Three",
              "title": "Junior",
              "items": [
                {
                  "id": "MO411",
                  "fullname": "Child Three",
                  "title": "Junior",
                  "items": [
                  ]
                },
                {
                  "id": "MO412",
                  "fullname": "Child Three",
                  "title": "Junior",
                  "items": [
                    {
                      "id": "MO4121",
                      "fullname": "Child Three",
                      "title": "Junior",
                      "items": [
                      ]
                    },
                    {
                      "id": "MO4122",
                      "fullname": "Child Three",
                      "title": "Junior",
                      "items": [
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "MO3",
          "fullname": "Child Two",
          "title": "Employee",
          "items": [
            {
              "id": "MO31",
              "fullname": "Child Three",
              "title": "Junior",
              "items": [
              ]
            },
            {
              "id": "MO32",
              "fullname": "Child Three",
              "title": "Junior",
              "items": [
              ]
            },
            {
              "id": "MO33",
              "fullname": "Child Three",
              "title": "Junior",
              "items": [
              ]
            }					
          ]
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // const dispatch = useDispatch<AppDispatch>()

  // useEffect(() => {
  //   fetchOrganisationData()
  // }, [])

  // const fetchOrganisationData = async () => {
  //   setIsLoading(true)
  //   const orgViewData = await dispatch(OrgView())
  //   if (orgViewData.payload != null) {
  //     setOrgViewData(orgViewData.payload.data)
  //     setIsLoading(false)
  //   }
  //   setIsLoading(false)
  // }

  if (isLoading && !orgviewdata) return <CircularProgress color='success' />

  return (
    <div className="org-tree" style={{width:'max-content',textAlign:'center'}}>
      <Card data={orgviewdata} />
    </div>
  );
};

export default Chart;