// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useState } from 'react'

const UpdateOrganisation = () => {

 const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  console.log(array);
  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    const Rows = string.slice(string.indexOf("\n") + 1).split(",");

    if (csvHeader.length > 0) {

      // ** Check StaffId **
      if (csvHeader.includes("StaffId")) {
        const index = csvHeader.indexOf("StaffId")
        const result = StaffIdValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check FirstName **
      if (csvHeader.includes("FirstName")) {
        const index = csvHeader.indexOf("FirstName")
        const result = FirstNameValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check LastName **
      if (csvHeader.includes("LastName")) {
        const index = csvHeader.indexOf("LastName")
        const result = LastNameValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check ManagerId**
      if (csvHeader.includes("ManagerId") || !(csvHeader.includes("ManagerId"))) {
        const index = csvHeader.indexOf("ManagerId")
        const result = ManagerIdValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check Email **
      if (csvHeader.includes("Email")) {
        const index = csvHeader.indexOf("Email")
        const result = EmailValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check AwardType **
      if (csvHeader.includes("AwardType") || !(csvHeader.includes("AwardType"))) {
        const index = csvHeader.indexOf("AwardType")
        const result = AwardTypeValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check StartDate **
      if (csvHeader.includes("StartDate")) {
        const index = csvHeader.indexOf("StartDate")
        const result = StartDateValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check AnnualLeaveBalance **
      if (csvHeader.includes("AnnualLeaveBalance")) {
        const index = csvHeader.indexOf("AnnualLeaveBalance")
        const result = AnnualLeaveBalanceValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check Department **
      if (csvHeader.includes("Department") || !(csvHeader.includes("Department"))) {
        const index = csvHeader.indexOf("Department")
        const result = DepartmentValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check AnnualSalary **
      if (csvHeader.includes("AnnualSalary")) {
        const index = csvHeader.indexOf("AnnualSalary")
        const result = AnnualSalaryValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check OrdinaryHoursPerWeek **
      if (csvHeader.includes("OrdinaryHoursPerWeek")) {
        const index = csvHeader.indexOf("OrdinaryHoursPerWeek")
        const result = OrdinaryHoursPerWeekValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check OrdinaryHoursPerMonth **
      if (csvHeader.includes("OrdinaryHoursPerMonth")) {
        const index = csvHeader.indexOf("OrdinaryHoursPerMonth")
        const result = OrdinaryHoursPerMonthValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check HourlyRate **
      if (csvHeader.includes("HourlyRate") || !(csvHeader.includes("HourlyRate"))) {
        const index = csvHeader.indexOf("HourlyRate")
        const result = HourlyRatesValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check EmploymentType **
      if (csvHeader.includes("EmploymentType")) {
        const index = csvHeader.indexOf("EmploymentType")
        const result = EmploymentTypeValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

       // ** Check TILBalance **
      if (csvHeader.includes("TILBalance") || !(csvHeader.includes("TILBalance"))) {
        const index = csvHeader.indexOf("TILBalance")
        const result = TILBalanceValid(Rows.at(index))
        if(result === true) {
          console.log("Valid CSV")
        }
        else {
          console.log("Invalid CSV")
        }
      }

      // ** Required Field Missing **
      else {
        console.log("One or more Field is missing")
      }
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
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event: any) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  //const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{mt: 15}}>
          <CardHeader title='Upload CSV'></CardHeader>
          
            <div>

      <form style={{marginRight: 5, marginLeft: 10}}>
      <input style={{marginLeft: 60}}
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button style={{marginLeft: 650}}
          onClick={(e) => {
            handleOnSubmit(e);
          }}>
          Import CSV
        </button>
      </form>
      <CardContent style={{overflowX: 'scroll', marginRight: 20}}>
      <br/>
      <table style={{"borderWidth":"4px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>

       {/* <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th key={key} style={{"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {array.map((item: any) => (
            <tr key={item.id}>
              {Object.values(item).map((val: any) => (
                <td style={{"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>  */}
      </table>
          </CardContent>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}


// ** StaffIdValidation **
function StaffIdValid(value:any){
    let result: boolean
    if (value.match(/^[0-9A-Za-z]+$/) !== null) { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** FirstNameValidation **
  function FirstNameValid(value:any){
    let result: boolean
    if (typeof value === 'string') { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** LastNameValidation **
  function LastNameValid(value:any){
    let result: boolean
    if (typeof value === 'string') { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** ManagerIdValidation **
  function ManagerIdValid(value:any){
    let result: boolean
    if (value.match(/^[0-9A-Za-z]+$/) !== null) { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** EmailValidation **
  function EmailValid(value:any){
    let result: boolean
    if (typeof value === 'string') { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** AwardTypeValidation **
  function AwardTypeValid(value:any){
    let result: boolean
    if (typeof value === 'string') { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** StartDateValidation **
  function StartDateValid(value:any){
    let result: boolean
    if (isNaN(value) && !isNaN(Date.parse(value))) { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** AnnualLeaveBalanceValidation **
  function AnnualLeaveBalanceValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }
  
  // ** DepartmentValidation **
  function DepartmentValid(value:any){
    let result: boolean
    if (typeof value === 'string') { 
    result = true
    }
    else {
      result = false
    }

    return result
  }
  
  // ** AnnualSalaryValidation **
  function AnnualSalaryValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }
  
  // ** OrdinaryHoursPerWeekValidation **
  function OrdinaryHoursPerWeekValid(value:any){
    let result: boolean
    if (value.isInteger) { 
    result = false
    }
    else {
      result = true
    }

    return result
  }
  
  // ** OrdinaryHoursPerMonthValidation **
  function OrdinaryHoursPerMonthValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }
  
  // ** HourlyRatesValidation **
  function HourlyRatesValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }
  
  // ** EmploymentTypeValidation **
  function EmploymentTypeValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }
  
  // ** TILBalanceValidation **
  function TILBalanceValid(value:any){
    let result: boolean
    if (value.isInteger) { 
      result = false
      }
      else {
        result = true
      }

    return result
  }

  UpdateOrganisation.acl = {
    action: 'manage',
    subject: 'UpdateOrganisation'
  }
  
export default UpdateOrganisation
