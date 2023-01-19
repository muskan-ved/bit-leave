// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts';

const TrendsChart = ({options,series}:any) => {

    return (  <ReactApexcharts options={options} series={series} type='area' height={350} /> );
}
 
export default TrendsChart;