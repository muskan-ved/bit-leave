// ** React Imports
import { useContext } from 'react'

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
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { GridProps } from '@mui/material/Grid'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'

  // Styled Grid component
  const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  }))

// Styled component for the image
// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const Home = () => {

  // ** Hooks
  const ability = useContext(AbilityContext)
  const { settings } = useSettings()

  const userData = localStorage.getItem("userData")
  let fullName;
  if (userData != null) {
    const data = JSON.parse(userData)
    fullName = data.fullName;
  }



  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ position: 'relative' }}>
          <CardContent sx={{ p: theme => `${theme.spacing(7, 7.5)} !important` }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Typography variant='h5' sx={{ mb: 4.5 }}>
                  Welcome{' '}
                  <Box component='span' sx={{ fontWeight: 'bold' }}>
                    {fullName}
                  </Box>
                  ! 🎉
                </Typography>
                <Typography variant='body2'>How are you today? 🤟🏻</Typography>
                <Typography sx={{ mb: 4.5 }} variant='body2'>
                  Refer to FAQs and Resources to get started !
                </Typography>
                <Button variant='contained'>View Profile</Button>
              </Grid>
              <StyledGrid item xs={12} sm={6}>
            <TrophyImg alt='Congratulations Daisy' src={`/images/cards/trophy.png`} />
          </StyledGrid>
            </Grid>
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
    </Grid>
  )
}
Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
