// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** MUI import
import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

const TrendsChart = ({ options, series }: any) => {
  const theme = useTheme()

  const trendsSeries = [
    {
      name: 'Month Trends',
      data: series
    }
  ]

  const trendsOptions: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: false,
      curve: 'straight'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 0.2),
      hexToRGBA(theme.palette.primary.light, 0.4),
      hexToRGBA(theme.palette.primary.light, 0.8)
    ],
    xaxis: {
      title: {
        text: 'Months',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif'
        }
      },
      categories: options
    },
    yaxis: {
      title: {
        text: 'Leave Liability in $',
        style: {
          fontFamily: 'Helvetica, Arial, sans-serif'
        }
      }
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    tooltip: {
      shared: true
    }
  }

  return <ReactApexcharts type='area' options={trendsOptions} series={trendsSeries} height={294} />
}

export default TrendsChart
