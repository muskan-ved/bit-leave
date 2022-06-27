// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ChevronDown } from 'mdi-material-ui'
import Box from '@mui/material/Box';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const Home = () => {

  // ** Hooks
  const ability = useContext(AbilityContext)

  const userData = localStorage.getItem("userData")
  let fullName;
  if (userData != null) {
    const data = JSON.parse(userData)
    fullName = data.fullName;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Welcome ${fullName} !`}></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}><strong>Optimise Leave, Well-being and Balance Sheet for your Organisation.</strong></Typography>
            <Typography>
              For any help or support, feel free to contact us.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader title='Frequently Asked Questions'></CardHeader>
          <CardContent>
            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>What is Bit.Leave ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We are an employee benefits management platform.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader title='Resources'></CardHeader>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                  m: 1,
                  width: 128,
                  height: 128,
                },
              }}
            >
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {ability?.can('read', 'analytics') ? (
        <Grid item md={6} xs={12}>
          <Card>
            <CardHeader title='Admin Center' />
            <CardContent>
              {/* <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography> */}
              <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null}
    </Grid>
  )
}
Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
