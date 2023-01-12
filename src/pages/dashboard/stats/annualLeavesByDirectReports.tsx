// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const AnnualDirectReports = ({series,options}:any) => {
    return (
    <ReactApexcharts  type={"scatter"} height={294} series={series} options={options} /> );
}
 
export default AnnualDirectReports;