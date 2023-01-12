// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const AnnualLeaveByDepartment = ({ series, options }: any) => {
  return <ReactApexcharts type='bar' height={294} series={series} options={options} />
}

export default AnnualLeaveByDepartment
