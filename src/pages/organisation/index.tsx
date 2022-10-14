// ** React Import
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Close from 'mdi-material-ui/Close'
import { useTheme } from '@mui/material/styles'

//  ** Toast Import
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** AWS Import
import AWS from 'aws-sdk'

// ** CSV validation
import CSVFileValidator from 'csv-file-validator'

// ** Config Import
import auth from '../../configs/auth'

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { uploadCSVToS3 } from 'src/store/organisation'

const UpdateOrganisation = () => {
  const [array, setArray] = useState([])
  const [show, setShow] = useState<boolean>(false)
  const S3_BUCKET = auth.bucket_name
  const REGION = auth.region
  const dispatch = useDispatch<AppDispatch>()

  AWS.config.update({
    accessKeyId: auth.accessKeyId,
    secretAccessKey: auth.secretAccessKey
  })

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
  })

  const isIdValid = function (id: any) {
    const reqExp = /^[0-9A-Z]+$/

    return reqExp.test(id)
  }

  const isEmailValid = function (email: any) {
    const reqExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/

    return reqExp.test(email)
  }

  const isNameValid = function (name: any) {
    const reqExp = /^[A-Za-z]+$/

    return reqExp.test(name)
  }

  const isEmpTypeValid = function (empType: any) {
    const reqExp = /^[A-Za-z-]+$/

    return reqExp.test(empType)
  }

  const isFullNameValid = function (fullname: any) {
    const reqExp = /^[A-Za-z]+ [A-Za-z]+$/

    return reqExp.test(fullname)
  }

  const isNumValid = function (num: any) {
    const reqExp = /^[0-9]+$/

    return reqExp.test(num)
  }

  const isFloatNumValid = function (num: any) {
    const reqExp = /^[0-9.0-9]+$/

    return reqExp.test(num)
  }

  const isDateValid = function (date: any) {
    const reGoodDate = /^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/

    return reGoodDate.test(date)
  }

  const columns = {
    headers: [
      {
        name: 'id',
        inputName: 'id',
        required: true,
        validate: isIdValid
      },
      {
        name: 'firstname',
        inputName: 'firstname',
        required: true,
        validate: isNameValid
      },
      {
        name: 'lastname',
        inputName: 'lastname',
        required: true,
        validate: isNameValid
      },
      {
        name: 'fullname',
        inputName: 'fullname',
        required: true,
        validate: isFullNameValid
      },
      {
        name: 'managerId',
        inputName: 'managerId',
        required: false
      },
      {
        name: 'emailaddress',
        inputName: 'emailaddress',
        required: true,
        unique: true,
        validate: isEmailValid
      },
      {
        name: 'awardtype',
        inputName: 'awardtype',
        required: true,
        validate: isNameValid
      },
      {
        name: 'datejoined',
        inputName: 'datejoined',
        required: true,
        validate: isDateValid
      },
      {
        name: 'annualleavebalance',
        inputName: 'annualleavebalance',
        required: true,
        validate: isNumValid
      },
      {
        name: 'department',
        inputName: 'department',
        required: true,
        validate: isNameValid
      },
      {
        name: 'annualsalary',
        inputName: 'annualsalary',
        required: true,
        validate: isNumValid
      },
      {
        name: 'ordinaryhoursperweek',
        inputName: 'ordinaryhoursperweek',
        required: true,
        validate: isFloatNumValid
      },
      {
        name: 'hourlyrate',
        inputName: 'hourlyrate',
        required: true,
        validate: isFloatNumValid
      },
      {
        name: 'employmenttype',
        inputName: 'employmenttype',
        required: true,
        validate: isEmpTypeValid
      }
    ]
  }

  const headd: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Employee Id',
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'firstname',
      headerName: 'First name',
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'fullname',
      headerName: 'Full name',
      sortable: false,
      minWidth: 160,
      disableColumnMenu: true
    },
    {
      field: 'managerId',
      headerName: 'Manager Id',
      type: 'number',
      minWidth: 110,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'emailaddress',
      headerName: 'Email Address',
      sortable: false,
      minWidth: 200,
      disableColumnMenu: true
    },
    {
      field: 'awardtype',
      headerName: 'Award Type',
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true
    },
    {
      field: 'datejoined',
      headerName: 'Date Joined',
      sortable: false,
      minWidth: 120,
      disableColumnMenu: true
    },
    {
      field: 'annualleavebalance',
      headerName: 'Annual Leave Balance',
      sortable: false,
      minWidth: 190,
      disableColumnMenu: true
    },
    {
      field: 'department',
      headerName: 'Department',
      sortable: false,
      minWidth: 160,
      disableColumnMenu: true
    },
    {
      field: 'annualsalary',
      headerName: 'Annual Salary',
      sortable: false,
      minWidth: 160,
      disableColumnMenu: true
    },
    {
      field: 'ordinaryhoursperweek',
      headerName: 'Ordinary Hours Per Week',
      sortable: false,
      minWidth: 220,
      disableColumnMenu: true
    },
    {
      field: 'hourlyrate',
      headerName: 'Hourly Rate',
      sortable: false,
      disableColumnMenu: true,
      minWidth: 140
    },
    {
      field: 'employmenttype',
      headerName: 'Employment Type',
      sortable: false,
      disableColumnMenu: true,
      minWidth: 170
    }
  ]

  const fileReader = new FileReader()

  const handleOnChange = (e: any) => {
    setArray([])
    if (e.target.files[0]) {
      fileReader.onload = function (event: any) {
        const text = event.target.result
        const userData = window.localStorage.getItem('userData')
        let user
        if (userData != null) {
          user = JSON.parse(userData)
        }
        const fileName =
          (e.target.files[0].name.replace(e.target.files[0].name),
          `${user.orgId}${Math.floor(Math.random() * 1000 + 1)}.csv`)

        //csv validation
        CSVFileValidator(e.target.files[0], columns)
          .then(csvData => {
            csvData.inValidMessages.forEach(message => {
              toast.error(message)
            })

            if (csvData.inValidMessages.length === 0) {
              csvFileToArray(text)
              const params = {
                Body: e.target.files[0],
                Bucket: S3_BUCKET,
                Key: fileName
              }

              myBucket
                .putObject(params)
                .on('httpUploadProgress', async evt => {
                  if (evt) {
                    toast.success('Successfully file uploaded to s3', {
                      autoClose: 5000,
                      hideProgressBar: false
                    })

                    const article = { processIdentifier: fileName }
                    await dispatch(uploadCSVToS3(article))
                      .then(response => {
                        if (response.payload !== undefined) {
                          toast.success('Successfully processed the update', {
                            autoClose: 5000,
                            hideProgressBar: false
                          })
                        }
                      })
                      .catch(err => {
                        if (err) {
                        }
                        toast.error('Failed processing the update', {
                          autoClose: 5000,
                          hideProgressBar: false
                        })
                      })
                  }
                })
                .send(err => {
                  if (err !== null) {
                    toast.error('Sync organisation failed', {
                      autoClose: 5000,
                      hideProgressBar: false
                    })
                  }
                })
            }
          })
          .catch(err => {
            if (err) {
            }
          })
      }

      fileReader.readAsText(e.target.files[0])
    }
  }

  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',')
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n')
    const Rows = string.slice(string.indexOf('\n') + 1).split(',')
    if (Rows) {
    }
    csvRows.splice(-1)
    if (csvHeader.length > 0) {
      // ** Check EmpId **
      if (csvHeader.includes('id')) {
        const index = csvHeader.indexOf('id')
        if (index) {
        }
      }

      // ** Check FirstName **
      if (csvHeader.includes('firstname')) {
        const index = csvHeader.indexOf('firstname')
        if (index) {
        }
      }

      // ** Check LastName **
      if (csvHeader.includes('lastname')) {
        const index = csvHeader.indexOf('lastname')
        if (index) {
        }
      }

      // ** Check FullName **
      if (csvHeader.includes('fullname')) {
        const index = csvHeader.indexOf('fullname')
        if (index) {
        }
      }

      // ** Check ManagerId**
      if (csvHeader.includes('managerId') || !csvHeader.includes('managerId')) {
        const index = csvHeader.indexOf('managerId')
        if (index) {
        }
      }

      // ** Check Email **
      if (csvHeader.includes('emailaddress')) {
        const index = csvHeader.indexOf('emailaddress')
        if (index) {
        }
      }

      // ** Check AwardType **
      if (csvHeader.includes('awardtype') || !csvHeader.includes('awardtype')) {
        const index = csvHeader.indexOf('awardtype')
        if (index) {
        }
      }

      // ** Check StartDate **
      if (csvHeader.includes('datejoined')) {
        const index = csvHeader.indexOf('datejoined')
        if (index) {
        }
      }

      // ** Check AnnualLeaveBalance **
      if (csvHeader.includes('annualleavebalance')) {
        const index = csvHeader.indexOf('annualleavebalance')
        if (index) {
        }
      }

      // ** Check Department **
      if (csvHeader.includes('department') || !csvHeader.includes('department')) {
        const index = csvHeader.indexOf('department')
        if (index) {
        }
      }

      // ** Check AnnualSalary **
      if (csvHeader.includes('annualsalary')) {
        const index = csvHeader.indexOf('annualsalary')
        if (index) {
        }
      }

      // ** Check OrdinaryHoursPerWeek **
      if (csvHeader.includes('ordinaryhoursperweek')) {
        const index = csvHeader.indexOf('ordinaryhoursperweek')
        if (index) {
        }
      }

      // ** Check HourlyRate **
      if (csvHeader.includes('hourlyrate') || !csvHeader.includes('hourlyrate')) {
        const index = csvHeader.indexOf('hourlyrate')
        if (index) {
        }
      }

      // ** Check EmploymentType **
      if (csvHeader.includes('employmenttype')) {
        const index = csvHeader.indexOf('employmenttype')
        if (index) {
        }
      }

      const array = csvRows.map(i => {
        const values = i.split(',')
        const obj = csvHeader.reduce((object: any, header: any, index) => {
          object[header] = values[index]

          return object
        }, {})

        return obj
      })

      setArray(array as any)
    }
  }

  const theme = useTheme()
  return (
    <>
      <Grid item xs={12} mb={5} sx={{ textAlign: 'right' }}>
        <Button variant='contained' onClick={() => setShow(true)} sx={{backgroundColor : theme.palette.warning.main}}>
          Instructions for importing{' '}
        </Button>
      </Grid>
      <Grid container spacing={6}>
        <ToastContainer
          position='top-right'
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Import Organisation Data' style={{ borderBottom: '2px solid #aaaaaa' }}></CardHeader>
            <Box sx={{ m: 3, p: 3 }} className='btndivider'>
              <Button variant='contained' component='label' sx={{ marginRight: '10px' }}>
                Upload File
                <input
                  type={'file'}
                  id={'csvFileInput'}
                  accept={'.csv'}
                  onChange={handleOnChange}
                  onClick={(event: any) => {
                    event.target.value = null
                  }}
                  hidden
                  style={{ marginLeft: 60 }}
                />
              </Button>
            </Box>
            <CardContent>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={array} columns={headd} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog fullWidth open={show} maxWidth='md' scroll='body' onClose={() => setShow(false)}>
        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Close />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Organisation Data Upload Instructions
            </Typography>
            <Typography variant='body2'>
              This functionality can be used to manually upload employee information into bit.leave. Please download the sample template csv 
              file. The file contains header column names for importing.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <a href='/templateCSV/Template.csv' download style={{ textDecoration: 'none', color: '061A16' }}>
            <Button variant='contained' component='label' sx={{ mr: 2 }} onClick={() => setShow(false)}>
              Download Sample Template File
            </Button>
          </a>
        </DialogActions>
      </Dialog>
    </>
  )
}

UpdateOrganisation.acl = {
  action: 'manage',
  subject: 'UpdateOrganisation'
}
export default UpdateOrganisation
