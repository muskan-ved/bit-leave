import React, { Fragment, useEffect, useState } from 'react'
import randomcolor from 'randomcolor'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh'
import { loadDashboardAnalytics, loadEmployee } from 'src/store/employee'
import { useSelector } from 'react-redux'

const Card = (props: any) => {
  //   const levelColor = randomcolor({
  //     luminosity: 'light',
  //     hue: 'random'
  //  });

  return (
    <ul>
      {props.data.map((item: any) => (
        <Fragment key={item.id}>
          <li>
            <div className='card'>
              <div className='image'>
                <img
                  src={item.avatar !== null ? '/images/avatars/' + item.avatar : '/images/avatars/questionMark.png'}
                  alt='Profile'
                  style={{ borderColor: '#2DCCA7' }}
                />
              </div>
              <div className='card-body' style={{ background: '#f7f7f9' }}>
                <h4>
                  {item.firstname} {item.lastname}
                </h4>
              </div>
              <div className='card-footer' style={{ background: '#2DCCA7', padding: '10px' }}>
                <p>Title: {item.jobtitle}</p>
              </div>
              <div></div>
            </div>
            {item.items?.length > 0 && <Card data={item.items} />}
          </li>
        </Fragment>
      ))}
    </ul>
  )
}

const Chart = () => {
  const [orgviewdata, setOrgViewData] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [employeeData, setemployeeData] = useState<any>('')
  const [orgName, setOrgName] = useState<any>('')
  const dispatch = useDispatch<AppDispatch>()

  const employeeDetails: any = useSelector((state: RootState) => state.employee)

  useEffect(() => {
    if (employeeDetails?.pages.length === 0) {
      fetchOrganisationData()
    } else {
      const filterOrgViewData = employeeDetails.pages.filter((p: any) => p.category === 'OrgView')
      setOrgViewData(filterOrgViewData[0].data.employees)
    }
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setemployeeData(empData.payload.data)
      setOrgName(empData?.payload?.data?.orgs[0]?.name)
    }
    setIsLoading(false)
  }

  const refreshbtn = async () => {
    fetchOrganisationData()
  }

  const fetchOrganisationData = async () => {
    setIsLoading(true)
    const orgViewData = await dispatch(loadDashboardAnalytics())
    if (orgViewData.payload != null) {
      const filterOrgViewData = orgViewData.payload.data.pages.filter((p: any) => p.category === 'OrgView')
      setOrgViewData(filterOrgViewData[0].data.employees)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setOrgName(event.target.value)
  }

  if (isLoading && !orgviewdata) return <CircularProgress color='success' />

  return (
    <>
      <Grid container spacing={9}>
        <Grid item xs={12} mb={5}>
          <FormControl sx={{ minWidth: 120 }} size='small'>
            <InputLabel id='demo-simple-select-readonly-label'>Organisation</InputLabel>
            <Select
              labelId='demo-simple-select-readonly-label'
              id='demo-simple-select-readonly'
              value={orgName}
              label='Organisationte'
              onChange={handleChange}
              sx={{ fontSize: '13px' }}
            >
              {employeeData?.orgs?.map((itemorg: any) => {
                return <MenuItem key={itemorg.id} value={itemorg.name}>{itemorg.name}</MenuItem>
              })}
            </Select>
          </FormControl>
          <Button variant='contained' onClick={refreshbtn} disabled={isLoading} sx={{ float: 'right', mr: '4px' }}>
            <RefreshIcon sx={{ fontSize: '1.1rem', mr: '4px' }} />
            Refresh
          </Button>
          <Box
            component='img'
            sx={{
              width: '40px',
              marginRight: '12px',
              marginBottom: '-15px',
              float: 'right'
            }}
            alt='The Xero Connect logo.'
            src='/images/cards/xero_icon.png'
          />
          <Divider></Divider>
        </Grid>
      </Grid>
      <div className='org-tree' style={{ display: 'flex', justifyContent: 'center' }}>
        <Card data={orgviewdata} />
      </div>
    </>
  )
}

Chart.acl = {
  action: 'read',
  subject: 'dashboardOrgChartView'
}

export default Chart