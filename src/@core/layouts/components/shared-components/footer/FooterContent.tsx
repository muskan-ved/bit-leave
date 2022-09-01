// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Divider from "@mui/material/Divider"
import { BASE_URL_1 } from 'src/configs/apiEndpoints'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <div>      <Divider></Divider>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ mr: 2 }}>
          {`© ${new Date().getFullYear()}, Bit Leave Pty. Ltd.`}
        </Typography>
        {hidden ? null : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
            <Link target='_blank' href={BASE_URL_1}>
              About Bit.Leave
            </Link>
          </Box>
        )}
      </Box>
    </div>

  )
}

export default FooterContent
