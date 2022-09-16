// ** React Imports
import {  useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Divider from '@mui/material/Divider'
import { CurrencyUsd } from 'mdi-material-ui'

//  ** Types Imports
import { setup } from 'src/types/setup'

const Setup = () => {

  const [fieldOne, setFieldOne] = useState<setup | number>();
  const [fieldTwo, setFieldTwo] = useState<setup | number>();
  const [fieldThree, setFieldThree] = useState<setup | number>();

  const handleOnChange = (element:any) =>{
    if(element.target.name === "Field-One"){
      setFieldOne(element.target.value)
    }
    else if(element.target.name === "Field-Two"){
      setFieldTwo(element.target.value)
    }
    else if(element.target.name === "Field-Three"){
      setFieldThree(element.target.value)
    }
  }

  const handleSubmit = async(e:any) =>{
    e.preventDefault();
  }

    return (
      <Card>
        <CardHeader title='Setup' subheader={<Divider></Divider>} />
        <CardContent>
          <Typography sx={{ mb: 4.5 }}>
            Organisation Setup
          </Typography>
          <form onSubmit={handleSubmit} >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Field-One'
                  name='Field-One'
                  defaultValue={
                    "7"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CurrencyUsd />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Field-Two'
                  name='Field-Two'
                  defaultValue={"2"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CurrencyUsd />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Field-Three'
                  name='Field-Three'
                  defaultValue={"3"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CurrencyUsd />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' size='large'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    )
  }

Setup.acl = {
  action: 'manage',
  subject: 'Setup'
}

export default Setup


