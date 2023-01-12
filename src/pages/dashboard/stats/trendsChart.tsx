// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts';

// ** Third Party Imports
import { ApexOptions } from 'apexcharts';

const TrendsChart = () => {

   const  series= [{
    name: 'Trending',
    data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 25, 38,20]
  }]
    
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false }
    },
    forecastDataPoints: {
      count: 7,
      dashArray:5
    },
    stroke: {
      width: 5,
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
      tickAmount: 10 ,
      labels: {
        formatter: function(value, timestamp:any, opts) {
          return opts.dateFormatter(new Date(timestamp-1), 'dd MMM')
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: "16px",
        color: '#666'
      }
    },
    grid: {
        strokeDashArray: 1,
        xaxis: {
          lines: { show: false },
  
        },
        yaxis: {
          lines: { show: true }
        },
        padding: {
          top: -18,
          left: 26,
          right: 50,
          bottom: 6
        }
      },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [ '#FDD835'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100]
      },
    },
    yaxis: {
      min: 0,
      max: 40
    }
  }

    return (  <ReactApexcharts options={options} series={series} type="line" height={350} /> );
}
 
export default TrendsChart;