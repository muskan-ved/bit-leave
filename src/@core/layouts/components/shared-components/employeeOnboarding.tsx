import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { listEmployee, postEmployeeOnboarding } from "src/store/employee";
import LoadingButton from "@mui/lab/LoadingButton";

const defaultEmployeeOnboardingValue = {
  id: null
}


const employeeOnboardingSchema = yup.object().shape({
  id: yup.string().required(),
})

interface autoCompleteEmployee {
  id: string
  name: string
}
const EmployeeOnboardingDialog = (props: any) => {
  const [open, setOpen] = useState<boolean>(false)

  const [options, setOptions] = useState<autoCompleteEmployee[]>([])
  const [selectedoptions, setselectedoptions] = useState<autoCompleteEmployee>()
  const [inputValue, setInputValue] = useState('')
  const [progress, setprogress] = useState(false)


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>()
  const loading = open && options.length === 0

  const {
    control: employeeOnboardingControl,
    handleSubmit: handleEmployeeOnboardingSubmit,
    formState: { errors: employeeOnboardingErrors }
  } = useForm({
    defaultValues: defaultEmployeeOnboardingValue,
    resolver: yupResolver(employeeOnboardingSchema)
  })
  const onEmployeeOnboardingSubmit = async (data: any) => {
    console.log('onEmployeeOnboardingSubmit', data)
    setprogress(true)
    const result = await dispatch(postEmployeeOnboarding(data.id))
    if (result.payload?.data?.success == true) {
      props.handleClose()
    }
    setprogress(false)
  }

  const fectchEmployee = async () => {
    const data = await dispatch(listEmployee())
    if (data.payload?.data) {

      const result: autoCompleteEmployee[] = data.payload?.data.employees.map((x: { id: any; fullname: any; }) => {
        return {
          id: x.id,
          name: x.fullname
        }
      })

      setOptions(result)


    }
  }

  const setSelectedOptions = (value: any) => {
    console.log(value)
    if (value && value.id) {
      setselectedoptions(value.id)
    }
    else {
      setselectedoptions(undefined)
    }
  }
  const onError = (e: any) => console.log('errors', e);
  useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    const fetchEmployee = async () => {
      const data = await dispatch(listEmployee())
      if (data.payload?.data) {

        const result: autoCompleteEmployee[] = data.payload?.data.employees.map((x: { id: any; fullname: any; }) => {
          return {
            id: x.id,
            name: x.fullname
          }
        })
        if (active) {
          setOptions(result)
        }


      }
    }
    fetchEmployee()

    return () => {
      active = false
    }

  }, [loading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])


  const maxWidth = 'sm'

  return (

    <Dialog fullWidth={true} scroll={'paper'} fullScreen={fullScreen} maxWidth={maxWidth} open={props.open} onClose={props.close}>
      <DialogTitle>Information Needed</DialogTitle>
      <form style={{ overflowY: "auto", display: "flex", flexDirection: "column" }} key='cashoutform' onSubmit={handleEmployeeOnboardingSubmit(onEmployeeOnboardingSubmit, onError)}>
        <DialogContent>
          <Controller
            rules={{ required: true }}
            control={employeeOnboardingControl}
            name='id'
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                open={open}

                options={options}
                loading={loading}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={selectedoptions}
                inputValue={inputValue}
                onInputChange={(_, value) => {
                  setInputValue(value)
                }}
                onChange={(_, data: autoCompleteEmployee | null) => {
                  if (data) {
                    setselectedoptions(data)
                  }
                  field.onChange(data?.id)
                }}
                getOptionLabel={option => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter your Manager"
                    variant="outlined"
                    error={!!fieldState.error}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loading ? <CircularProgress color='inherit' size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      )
                    }}

                  />
                )}

              />

            )}
          />




          {employeeOnboardingErrors.id && (
            <FormHelperText sx={{ color: 'error.main' }} id='id'>
              Required
            </FormHelperText>
          )}

        </DialogContent>

        <DialogActions disableSpacing={true} className='dialog-actions-dense'>
          {progress == false &&
            <Button style={{ marginTop: '0.75em' }} type='submit' variant="contained"> Submit</Button>
          }
          {progress == true &&
            <LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant="contained" disabled>
              Submit
            </LoadingButton>
          }
        </DialogActions>
      </form>
    </Dialog>
  )

}


export default EmployeeOnboardingDialog
