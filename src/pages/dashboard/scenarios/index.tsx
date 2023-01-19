import { Box, Button, Divider, Grid } from "@mui/material";

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh';

import { useState } from "react";

const Scenarios = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const refreshbtn = async () => {
        // fetchEmpData()
      }

    return ( <Grid container spacing={9}>
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
      </Grid>  );
}

Scenarios.acl = {
	action: 'read',
	subject: 'dashboardScenarios'
  }
 
export default Scenarios;