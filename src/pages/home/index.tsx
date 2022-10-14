import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { ChevronDown, Translate } from 'mdi-material-ui'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { GridProps } from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ReactPlay from './reactPlayer'

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

const PlayIcon = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%,0px)'
}))

const Home = () => {
  // ** Hooks
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [url, setURL] = useState('')

  let fullName, OrgId: any

  const link_1 = 'https://www.youtube.com/watch?v=SccSCuHhOw0'
  const link_2 = 'https://www.youtube.com/watch?v=K4TOrB7at0Y'
  const link_3 = 'https://www.youtube.com/watch?v=GoQ85cs5fk0'
  const link_4 = 'https://www.youtube.com/watch?v=i0jZJtE1KhU'

  const userData = localStorage.getItem('userData')
  if (userData != null) {
    const data = JSON.parse(userData)
    fullName = data.fullName
    OrgId = data.orgId
  }

  useEffect(() => {
    const orgLogo_Url = `https://bl-org-assets.s3.ap-southeast-2.amazonaws.com/${OrgId}/logo`
    const http = new XMLHttpRequest()
    http.open('HEAD', orgLogo_Url, false)
    http.send()
    window.localStorage.setItem('orgLogo', JSON.stringify(http.status))
  }, [])

  const onGoToDashboard = (url?: string) => {
    if (url) {
      router.push(url)
    } else router.push('/dashboard')
  }
  const theme = useTheme()

  const youtubeURL = (url: any) => {
    if (url) {
      setShow(true)
      setURL(url)
    }
  }

  return (
    <>
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
                  <Divider></Divider>
                  <Typography variant='body2'>How are you today? 🤟🏻</Typography>
                  <Typography variant='body2' sx={{ mb: 4.5 }}>
                    Refer to FAQs and Resources to get started !
                  </Typography>
                  <Button variant='contained' onClick={() => onGoToDashboard()}>
                    Go To Dashboard
                  </Button>
                </Grid>
                <StyledGrid item xs={12} sm={6}>
                  <TrophyImg alt='Congratulations Daisy' src={`/images/cards/trophy.png`} />
                </StyledGrid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Get up to speed with bit.leave' subheader={<Divider></Divider>}></CardHeader>
            <CardContent sx={{ p: theme => `${theme.spacing(0, 7.5, 7, 7.5)} !important` }}>
              <Typography variant='body2'>Quick video FAQs</Typography>
              <Grid container sx={{ textAlign: 'center', columnGap: '20px' }}>
                <Grid
                  item
                  xs={2.8}
                  sx={{
                    border: `1px solid ${theme.palette.grey[500]}`,
                    borderRadius: '5px',
                    padding: '10px 0px',
                    marginTop: '10px'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.2),
                      margin: '0px 10px',
                      paddingTop: '5px',
                      position: 'relative'
                    }}
                  >
                    <img
                      src='/images/misc/paypal.png'
                      width='100px'
                      height='100px'
                      alt='youtube-image'
                      onClick={() => youtubeURL(link_1)}
                    />
                    <PlayIcon
                      src='/images/cards/play-icon.png'
                      className='play-icon'
                      onClick={() => youtubeURL(link_1)}
                    />
                  </Box>
                  <Typography noWrap variant='subtitle2' sx={{ fontWeight: 600 }} onClick={() => youtubeURL(link_1)}>
                    Play the video
                  </Typography>
                </Grid>{' '}
                <Grid
                  item
                  xs={2.8}
                  sx={{
                    border: `1px solid ${theme.palette.grey[500]}`,
                    borderRadius: '5px',
                    padding: '10px 0px',
                    marginTop: '10px',
                    maxWidth: '50%'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.2),
                      margin: '0px 10px',
                      paddingTop: '5px',
                      position: 'relative'
                    }}
                  >
                    <img
                      src='/images/misc/paypal.png'
                      width='100px'
                      height='100px'
                      alt='youtube-image'
                      onClick={() => youtubeURL(link_2)}
                    />
                    <PlayIcon
                      src='/images/cards/play-icon.png'
                      className='play-icon'
                      onClick={() => youtubeURL(link_2)}
                    />
                  </Box>
                  <Typography noWrap variant='subtitle2' sx={{ fontWeight: 600 }} onClick={() => youtubeURL(link_2)}>
                    Play the video
                  </Typography>
                </Grid>{' '}
                <Grid
                  item
                  xs={2.8}
                  sx={{
                    border: `1px solid ${theme.palette.grey[500]}`,
                    borderRadius: '5px',
                    padding: '10px 0px',
                    marginTop: '10px'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.2),
                      margin: '0px 10px',
                      paddingTop: '5px',
                      position: 'relative'
                    }}
                  >
                    <img
                      src='/images/misc/paypal.png'
                      width='100px'
                      height='100px'
                      alt='youtube-image'
                      onClick={() => youtubeURL(link_3)}
                    />
                    <PlayIcon
                      src='/images/cards/play-icon.png'
                      className='play-icon'
                      onClick={() => youtubeURL(link_3)}
                    />
                  </Box>
                  <Typography noWrap variant='subtitle2' sx={{ fontWeight: 600 }} onClick={() => youtubeURL(link_3)}>
                    Play the video
                  </Typography>
                </Grid>{' '}
                <Grid
                  item
                  xs={2.8}
                  sx={{
                    border: `1px solid ${theme.palette.grey[500]}`,
                    borderRadius: '5px',
                    padding: '10px 0px',
                    marginTop: '10px'
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.2),
                      margin: '0px 10px',
                      paddingTop: '5px',
                      position: 'relative'
                    }}
                  >
                    <img
                      src='/images/misc/paypal.png'
                      width='100px'
                      height='100px'
                      alt='youtube-image'
                      onClick={() => youtubeURL(link_4)}
                    />
                    <PlayIcon
                      src='/images/cards/play-icon.png'
                      className='play-icon'
                      onClick={() => youtubeURL(link_4)}
                    />
                  </Box>
                  <Typography noWrap variant='subtitle2' sx={{ fontWeight: 600 }} onClick={() => youtubeURL(link_4)}>
                    Play the video
                  </Typography>
                </Grid>{' '}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Frequently Asked Questions ☎️' subheader={<Divider></Divider>}></CardHeader>
            <CardContent>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>What is bit.Leave ?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Bit.leave is an internal company currency. It allows you to reward staff with more money or more
                    time off.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>How do I use bit.leave? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    When you set up a bit.leave account you can assign a preset amount of bit.leave to each employee.
                    They can then use it or cash it out in accordance with company policy and rules.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>What can I spend bit.leave on? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Bit.leave is designed to give employees autonomy. They can choose to take time off or spend it in a
                    way that is intrinsically rewarding to them or in alignment with their financial needs or goals. You
                    can manually approve each cash out if you would like to put structure around its use.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>How does my company benefit? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    With rules based spending you can control how and when employees can access or use bit.leave. For
                    e?e, if they have excess annual leave you can set rules that encourage employees to use their excess
                    leave first. This helps you manage leave and other balance sheet liabilities.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>What is the ROI of bit.leave?? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component='div'>
                    Depending on your company, the ROI will vary but here’s some of the areas bit.leave will help in
                    your business:
                    <ul>
                      <li>Reduction in excess leave liabilities</li>
                      <li>Time in Lieu and RDO management</li>
                      <li>Reduction of ineffective wellness spend/programs</li>
                      <li>Reduction of recruitment costs as retention increases</li>
                      <li>Reduction in insurance risk due to a reduced risk of burnout</li>
                      <li>
                        Process improvements in HR & payroll which could result in reduction in required headcount/FTE
                      </li>
                      <li>Improved brand and talent attraction </li>
                      <li>Simplification of complex benefits packages that barely anyone uses</li>
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Why use leave as a currency? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    60% or more of employees simply want more money or more time off when it comes to helping with cost
                    of living pressures. Leave as a currency guarantees a 100% adoption rate across your organisation as
                    it can be used by everyone.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Is it compliant for my industry and employee type? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    bit.leave is compliant across all awards (even award-free), enterprise agreements, locations and
                    industries.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Can I change the value of bit.leave? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    You can change the value of bit.leave at any time. If you need to amend the currency value due to
                    cashflow or other issues, it’s as simple as logging in and changing the bit.leave settings.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Why is bit.leave better than other benefits? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    The industry average for other benefits platforms or perks is less than 10%. They usually cater for
                    only a small segment of your employee demographic. bit.leave applies to everyone regardless of
                    salary and life stage.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Can it be used it multiple countries and currencies? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Yes it can. As we build more integrations you will have the ability to use this across any country
                    and any currency.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Does it work with my current HRIS? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Yes. bit.leave works with any HRIS system on the market.</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Does it work with my current payroll? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    We are releasing new payroll integrations regularly. Whether you have an off-the-shelf or custom
                    payroll solution, we can integrate with it. Get in touch to talk about your individual requirements.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Can I use it alongside other benefits?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Yes! Ideally bit.leave works best as a standalone benefits platform but we can work alongside other
                    company benefits. You can even add these benefits to bit.leave for everyone to be able to find
                    easily!
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>How does it work alongside other leave types? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Bit.leave works alongside all other leave types. A unique benefit of bit.leave is that it is easily
                    installed and implemented which means minimal disruptions and ease of use.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Do you help with onboarding, implementation and adoption?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Yes! Whether you’re large or small we can work with you to adopt bit.leave. From change management,
                    communications to ongoing management.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ChevronDown />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Is this just another platform for me to manage? </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Thankfully no! Once you onboard your organisation it can run passively in the background with
                    minimal human interaction. If you want more control over bit.leave you can set that during
                    onboarding. We send you monthly updates and you can use bit.leave only when you need to.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        <Dialog open={show} maxWidth='md' scroll='body' onClose={() => setShow(false)}>
          <DialogContent sx={{ pb: 6, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => setShow(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Close />
            </IconButton>
            <ReactPlay url={url} />
          </DialogContent>
        </Dialog>
      </Grid>
    </>
  )
}
Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
