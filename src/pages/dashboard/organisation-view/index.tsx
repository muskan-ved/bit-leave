import React, { Fragment, useEffect, useState } from "react";
import randomcolor from "randomcolor";
import { OrgView } from "src/store/organisation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { Box, Button, CircularProgress, Divider, Grid } from "@mui/material";

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh';

const Card = (props:any) => {

//   const levelColor = randomcolor({
//     luminosity: 'light',
//     hue: 'random'
//  });

  return (
    <ul>
      {props.data.map((item:any) => (
        <Fragment key={item.id}>
          <li>
            <div className="card">
              <div className="image">
                <img
                  src={item.avatar !== null? '/images/avatars/'+item.avatar : '/images/avatars/questionMark.png'}
                  alt="Profile"
                  style={{ borderColor: '#2DCCA7' }}
                />
              </div>
              <div className="card-body" style={{background:'#f7f7f9'}}>
                <h4>{item.firstname} {item.lastname}</h4>
              </div>
              <div className="card-footer" style={{ background: '#2DCCA7',padding:'10px' }}>
                <p >Title: {item.jobtitle}</p>
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

  const [orgviewdata, setOrgViewData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    fetchOrganisationData()
  }, [])

  const refreshbtn = async () => {
    fetchOrganisationData()
  }

  const fetchOrganisationData = async () => {
    setIsLoading(true)
    const orgViewData = await dispatch(OrgView())
    if (orgViewData.payload != null) {
      setOrgViewData(orgViewData.payload.data.employees)
      setIsLoading(false)
    }
    setIsLoading(false)
  }
  if (isLoading && !orgviewdata) return <CircularProgress color='success' />

  return (
    <>
    <Grid container spacing={9}>
    <Grid item xs={12} mb={5} sx={{ textAlign: 'right' }}>
      <Box
        component='img'
        sx={{
          width: '40px',
          marginRight: '12px',
          marginBottom: '-15px'
        }}
        alt='The Xero Connect logo.'
        src='/images/cards/xero_icon.png'
      />
      <Button variant='contained' onClick={refreshbtn} disabled={isLoading}>
        <RefreshIcon sx={{ fontSize: '1.1rem', mr: '4px' }} />
        Refresh
      </Button>
      <Divider></Divider>
    </Grid>
  </Grid>
    <div className="org-tree" style={{display:'flex',justifyContent:'center'}}>
      <Card data={orgviewdata} />
    </div>
    </>
  );
};

Chart.acl = {
	action: 'read',
	subject: 'dashboardOrgChartView'
  }

export default Chart;