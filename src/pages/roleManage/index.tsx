// ** React Imports
import {  useEffect, useState } from 'react'

// ** Icons Imports
import Divider from '@mui/material/Divider'

// ** Types Import
import {roles} from 'src/types/roleManage'

// ** MUI Import
import { useTheme } from '@mui/material/styles'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import {Table,Box, TableBody, TableCell,TableContainer,TablePagination, TableHead, TableRow ,Paper ,CircularProgress , CardContent, CardHeader, Card } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { roleManagement } from 'src/store/roleManage';

interface Data {
  fullname: string;
  role: string;
  action: any;
}


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "fullname",
    numeric: false,
    disablePadding: true,
    label: "Full Name"
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role"
  },
  {
    id: "action",
    disablePadding: false,
    numeric: true,
    label: "Action"
  },
];


function EnhancedTableHead() {
  const theme = useTheme();
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? "none" : "normal"}
            sx={{background:theme.palette.primary.main}}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
const RoleManagement = () =>{
  
  const [rows,setRows] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const [datas,setData]=useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  var roles = ['admin','user'];
  const handleRoleUpdate = (data:any) => {
    setOpen(true);
    setData(data)
  };

  const handleClose = () => {   
    setOpen(false);
  };

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    
    
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    
    useEffect(() => {
      
      setIsLoading(true);
      fetchData();
      
    },[]);
    
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(roleManagement())
      .then(res => {
              setRows(res.payload.data)
              setIsLoading(false);
            })
        };
        
        var result = roles.filter((o1:any) => { if(o1.roleName === "admin"){
          return o1;
        }})
        console.log("ffff",result)
       
        if (isLoading)
        return (<CircularProgress color="success" />)
        if (!isLoading && rows) { 
        return (
          <Card sx={{ mt: 15 }}>
					<CardHeader title='Role Management' subheader={<Divider></Divider>}></CardHeader>

					<CardContent >
          <Box sx={{ width: "100%"}}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer sx={{borderRadius:'15px'}}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={"medium"}
                >
                  <EnhancedTableHead/>
                  <TableBody >
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row:any) => {
                        const labelId = `enhanced-table-checkbox-${row.id}`;
      
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
        
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.fullname}
                            </TableCell>
                            <TableCell align="left">{row.roleName}</TableCell>
                            <TableCell align="right"><i onClick={() => handleRoleUpdate(row)}><ModeEditOutlineOutlinedIcon/></i></TableCell>
                          </TableRow>
                        );
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
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
          {/* Role Update Modal */}
          <Dialog
      
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Select the Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            There is some role text here.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 5, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
               {/* {data.roleName === } */}
                <MenuItem value={false as any}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
          </CardContent>
          </Card>
        );
    }
  }
    

  RoleManagement.acl = {
  action: 'manage',
  subject: 'roleManagement'
}

export default RoleManagement