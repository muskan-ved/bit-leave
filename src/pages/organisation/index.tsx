// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AWS from 'aws-sdk';
import CSVFileValidator from 'csv-file-validator';
import authConfig from '../../configs/auth';
import axios from 'axios'

const UpdateOrganisation = () => {

	const [array, setArray] = useState([]);
	const S3_BUCKET = authConfig.bucket_name;
	const REGION = authConfig.region;

	AWS.config.update({
		accessKeyId: authConfig.accessKeyId,
		secretAccessKey: authConfig.secretAccessKey,
	})

	const myBucket = new AWS.S3({
		params: { Bucket: S3_BUCKET },
		region: REGION,
	})

	const isIdValid = function (id: any) {
		const reqExp = /^[0-9A-Z]+$/;

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
		const reGoodDate = /^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/;
		
		return reGoodDate.test(date);
	}


	const columns = {
		headers: [
			{
				name: 'id',
				inputName: 'id',
				required: true,
				validate: isIdValid,
			},
			{
				name: 'firstname',
				inputName: 'firstname',
				required: true,
				validate: isNameValid,
			},
			{
				name: 'lastname',
				inputName: 'lastname',
				required: true,
				validate: isNameValid,
			},
			{
				name: 'fullname',
				inputName: 'fullname',
				required: true,
				validate: isFullNameValid
			},
			{
				name: 'manager_id',
				inputName: 'manager_id',
				required: false
			},
			{
				name: 'emailaddress',
				inputName: 'emailaddress',
				required: true,
				unique: true,
				validate: isEmailValid,
			},
			{
				name: 'awardtype',
				inputName: 'awardtype',
				required: true,
				validate: isNameValid,
			},
			{
				name: 'datejoined',
				inputName: 'datejoined',
				required: true,
				validate: isDateValid,
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
				validate: isNameValid,
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
			},
		]
	}


	const headd: GridColDef[] = [
		{
			field: 'id',
			headerName: 'Employee Id',
			minWidth: 120,
			sortable: false,
			disableColumnMenu: true,
		},
		{
			field: 'firstname',
			headerName: 'First name',
			minWidth: 120,
			sortable: false,
			disableColumnMenu: true,
		},
		{
			field: 'lastname',
			headerName: 'Last name',
			minWidth: 120,
			sortable: false,
			disableColumnMenu: true,
		},
		{
			field: 'fullname',
			headerName: 'Full name',
			sortable: false,
			minWidth: 160,
			disableColumnMenu: true,
		},
		{
			field: 'manager_id',
			headerName: 'Manager Id',
			type: 'number',
			minWidth: 110,
			sortable: false,
			disableColumnMenu: true,
		},
		{
			field: 'emailaddress',
			headerName: 'Email Address',
			sortable: false,
			minWidth: 200,
			disableColumnMenu: true,
		},
		{
			field: 'awardtype',
			headerName: 'Award Type',
			minWidth: 120,
			sortable: false,
			disableColumnMenu: true,
		},
		{
			field: 'datejoined',
			headerName: 'Date Joined',
			sortable: false,
			minWidth: 120,
			disableColumnMenu: true,
		},
		{
			field: 'annualleavebalance',
			headerName: 'Annual Leave Balance',
			sortable: false,
			minWidth: 190,
			disableColumnMenu: true,
		},
		{
			field: 'department',
			headerName: 'Department',
			sortable: false,
			minWidth: 160,
			disableColumnMenu: true,
		},
		{
			field: 'annualsalary',
			headerName: 'Annual Salary',
			sortable: false,
			minWidth: 160,
			disableColumnMenu: true,
		},
		{
			field: 'ordinaryhoursperweek',
			headerName: 'Ordinary Hours Per Week',
			sortable: false,
			minWidth: 220,
			disableColumnMenu: true,
		},
		{
			field: 'hourlyrate',
			headerName: 'Hourly Rate',
			sortable: false,
			disableColumnMenu: true,
			minWidth: 140,
		},
		{
			field: 'employmenttype',
			headerName: 'Employment Type',
			sortable: false,
			disableColumnMenu: true,
			minWidth: 170,
		},
	];

	const fileReader = new FileReader();

	const handleOnChange = (e: any) => {
		setArray([])
		if (e.target.files[0]) {
			fileReader.onload = function (event: any) {
				const text = event.target.result;
				const fileName = (e.target.files[0].name.replace(e.target.files[0].name), `demo${Math.floor((Math.random() * 1000) + 1)}.csv`)

				//csv validation
				CSVFileValidator(e.target.files[0], columns)
					.then((csvData) => {

						csvData.inValidMessages.forEach(message => {
							toast.error(message)
						})

						if (csvData.inValidMessages.length === 0) {
							csvFileToArray(text);
							const params = {
								Body: e.target.files[0],
								Bucket: S3_BUCKET,
								Key: fileName,
							};

							myBucket.putObject(params)
								.on('httpUploadProgress', (evt) => {
									if (evt) {
										toast.success("Successfully file uploaded to s3", {
											autoClose: 5000,
											hideProgressBar: false,
										})

										const article = { processIdentifier: fileName };
										const token = localStorage.getItem("accessToken");
										console.log(token);
										axios.post('https://api.bitleave.co/employees/syncOrg', article,
											{
												headers: {
													Authorization: `Bearer ${token}`
												}

											})
											.then(response => {
												if (response) { }
												toast.success("Successfully processed the update", {
													autoClose: 5000,
													hideProgressBar: false,
												})
											})
											.catch(err => {
												if (err) { }
												toast.error("Failed processing the update", {
													autoClose: 5000,
													hideProgressBar: false,
												})
											})
									}
								})
								.send((err) => {
									if (err !== null) {
										toast.error("Sync organisation failed", {
											autoClose: 5000,
											hideProgressBar: false,
										})
									}
								})
						}
					})
					.catch(err => { if (err) { } })
			};

			fileReader.readAsText(e.target.files[0]);
		}
	};

	const csvFileToArray = (string: string) => {
		const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
		const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
		const Rows = string.slice(string.indexOf("\n") + 1).split(",");
		if (Rows) { }
		csvRows.splice(-1);
		if (csvHeader.length > 0) {

			// ** Check EmpId **
			if (csvHeader.includes("id")) {
				const index = csvHeader.indexOf("id")
				if (index) { }
			}

			// ** Check FirstName **
			if (csvHeader.includes("firstname")) {
				const index = csvHeader.indexOf("firstname")
				if (index) { }
			}

			// ** Check LastName **
			if (csvHeader.includes("lastname")) {
				const index = csvHeader.indexOf("lastname")
				if (index) { }
			}

			// ** Check FullName **
			if (csvHeader.includes("fullname")) {
				const index = csvHeader.indexOf("fullname")
				if (index) { }
			}

			// ** Check ManagerId**
			if (csvHeader.includes("manager_id") || !(csvHeader.includes("manager_id"))) {
				const index = csvHeader.indexOf("manager_id")
				if (index) { }
			}

			// ** Check Email **
			if (csvHeader.includes("emailaddress")) {
				const index = csvHeader.indexOf("emailaddress")
				if (index) { }
			}

			// ** Check AwardType **
			if (csvHeader.includes("awardtype") || !(csvHeader.includes("awardtype"))) {
				const index = csvHeader.indexOf("awardtype")
				if (index) { }
			}

			// ** Check StartDate **
			if (csvHeader.includes("datejoined")) {
				const index = csvHeader.indexOf("datejoined")
				if (index) { }
			}

			// ** Check AnnualLeaveBalance **
			if (csvHeader.includes("annualleavebalance")) {
				const index = csvHeader.indexOf("annualleavebalance")
				if (index) { }
			}

			// ** Check Department **
			if (csvHeader.includes("department") || !(csvHeader.includes("department"))) {
				const index = csvHeader.indexOf("department")
				if (index) { }
			}

			// ** Check AnnualSalary **
			if (csvHeader.includes("annualsalary")) {
				const index = csvHeader.indexOf("annualsalary")
				if (index) { }
			}

			// ** Check OrdinaryHoursPerWeek **
			if (csvHeader.includes("ordinaryhoursperweek")) {
				const index = csvHeader.indexOf("ordinaryhoursperweek")
				if (index) { }
			}

			// ** Check HourlyRate **
			if (csvHeader.includes("hourlyrate") || !(csvHeader.includes("hourlyrate"))) {
				const index = csvHeader.indexOf("hourlyrate")
				if (index) { }
			}

			// ** Check EmploymentType **
			if (csvHeader.includes("employmenttype")) {
				const index = csvHeader.indexOf("employmenttype")
				if (index) { }
			}

			const array = csvRows.map(i => {
				const values = i.split(",");
				const obj = csvHeader.reduce((object: any, header: any, index) => {
					object[header] = values[index];

					return object;
				}, {});

				return obj;
			});

			setArray(array as any);
		}
	};

	return (
		<Grid container spacing={6}>
			<ToastContainer position="top-right"
				autoClose={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable />
			<Grid item xs={12}>
				<Card sx={{ mt: 15 }}>
					<CardHeader title='Upload a CSV file with employee details' style={{ "borderBottom": "2px solid #aaaaaa" }}></CardHeader>

					<Box sx={{ m: 3, p: 3 }} className="btndivider">
						<Button variant="contained" component="label">
							Upload File
							<input style={{ marginLeft: 60 }} type={"file"} id={"csvFileInput"} accept={".csv"} onChange={handleOnChange} hidden />
						</Button>
					</Box>
					<CardContent >
						<Box sx={{ height: 400, width: '100%' }}>
							<DataGrid
								rows={array}
								columns={headd}
								pageSize={5}
								rowsPerPageOptions={[5]}
								disableSelectionOnClick
							/>
						</Box>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	)
}

UpdateOrganisation.acl = {
	action: 'manage',
	subject: 'UpdateOrganisation'
}
export default UpdateOrganisation