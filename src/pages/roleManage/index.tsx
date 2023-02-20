// ** React Imports
import { useEffect, useState } from 'react'

// ** Icons Imports
import Divider from '@mui/material/Divider'

// ** MUI Style Import
import { useTheme } from '@mui/material/styles'
import { SelectChangeEvent } from '@mui/material/Select'

// ** MUI ICon Import
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'

// ** MUI Import
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  CardContent,
  CardHeader,
  Card,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { roleManagement, roleUpdate } from 'src/store/roleManage'

// ** Types Import
import { roles } from 'src/types/roleManage'

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingButton from '@mui/lab/LoadingButton'
import * as gtag from '../../lib/gtag'
import { loadEmployee } from 'src/store/employee'
import { employeeType } from 'src/types/dashboard'

interface Data {
  fullname: string
  role: string
  action: any
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: true,
    label: 'Full Name'
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role'
  },
  {
    id: 'action',
    disablePadding: false,
    numeric: true,
    label: 'Action'
  }
]

function EnhancedTableHead() {
  const theme = useTheme()
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ background: theme.palette.primary.main }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
const RoleManagement = () => {
  const [rows, setRows] = useState<roles | any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [roleData, setData] = useState<any>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [open, setOpen] = useState(false)
  const [selectedData, setSelectedData] = useState('')
  const [empData, setEmpData] = useState<employeeType | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  
  const arrayUniqueByKey = [
    {
        roleId: 1,
        roleName:"admin"
    },
    {
        roleId: 2,
        roleName:"user"
    },
    {
      roleId: 3,
      roleName:"viewer"
  }
]

const result = arrayUniqueByKey.filter((role: any) => {
    return role.roleName !== roleData?.roleName
  })

  const handleRoleUpdate = (data: any) => {
    setOpen(true)
    setData(data)
    gtag.event({
      action: 'role_edit',
      category: 'role_management',
      label: "role_edit",
      value:'role_modal_open'
    })

  }

  const fetchEmpData = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setEmpData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSaveRole = async () => {
    const payload = {
      id: roleData.id,
      roleId: parseInt(selectedData)
    }
    gtag.event({
      action: 'role_close',
      category: 'role_management',
      label: "role_close",
      value:'role_modal_close'
    })
    setLoading(true)
    gtag.event({
      action: 'role_update',
      category: 'role_management',
      label: "role_update",
      value:'role_modal_update'
    })
    await dispatch(roleUpdate([payload]))
      .then(res => {
        if (res.payload !== undefined) {
          toast.success('Role updated')
          setOpen(false)
          setLoading(false)
          fetchData()
          fetchEmpData()
          
        }
        else{
          toast.error('Sorry, the action cannot be completed at this time. Please contact us for any issues')
          setLoading(false)
        }
      })
      .catch((err) => {
        setLoading(false)
        toast.error('Sorry, the action cannot be completed at this time. Please contact us for any issues')
      })

  }

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedData(event.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  useEffect(() => {
    setIsLoading(true)
    fetchData()
    fetchEmpData();
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    await dispatch(roleManagement())
      .then(res => {
        setRows(res.payload.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) return <CircularProgress color='success' />

  if (!isLoading && rows) {
    return (
      <Card sx={{ mt: 15 }}>
        <ToastContainer />
        <CardHeader title='Role Management' subheader={<Divider></Divider>}></CardHeader>

        <CardContent>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer sx={{ borderRadius: '15px' }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                  <EnhancedTableHead />
                  <TableBody>
                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                      const labelId = `enhanced-table-checkbox-${row.id}`

                      return (
                        <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                          <TableCell component='th' id={labelId} scope='row' padding='none'>
                            {row.fullname}
                          </TableCell>
                          <TableCell align='left'>{row.roleName}</TableCell>
                          <TableCell align='right' >
                            {empData?.role === 3 ?<i>
                              <ModeEditOutlineOutlinedIcon />
                            </i>:<i onClick={() => handleRoleUpdate(row)}>
                              <ModeEditOutlineOutlinedIcon />
                            </i>}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
          {/* Role Update Modal */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Change Role</DialogTitle>
            <DialogContent>
              <Box
                noValidate
                component='form'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  m: 'auto',
                  width: 'fit-content'
                }}
              >
                <FormControl sx={{ mt: 5, minWidth: 420 }}>
                  <InputLabel htmlFor='Roles'>Roles</InputLabel>
                  <Select value={selectedData} onChange={handleRoleChange} label='Roles' margin='dense'>
                    {result.map((item: any) => {
                      return (
                        <MenuItem key={item.roleId} value={item.roleId}>
                          {item.roleName}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              {!loading ? <Button onClick={handleSaveRole}>Update</Button> : 
              <LoadingButton loading={loading} disabled>
								Update
						</LoadingButton>}
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    )
  }
}

RoleManagement.acl = {
  action: 'manage',
  subject: 'roleManagement'
}

export default RoleManagement
