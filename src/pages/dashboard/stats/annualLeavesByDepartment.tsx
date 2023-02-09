// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** MUI import
import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

const AnnualLeaveByDepartment = ({ type, series, options }: any) => {

  const theme = useTheme()

  const seriesData = [
    {
      name: 'Average Excess Days',
      data: series
    }
  ]

  const optionData : ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded'
      }
    },
    grid: {
      strokeDashArray: 8,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -18,
        left: 26,
        right: 50,
        bottom: 6
      }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1)
    ],
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: options
    },
    yaxis: {
      labels: { align: theme.direction === 'rtl' ? 'right' : 'left' }
    }
  }

  return <ReactApexcharts type={type} height={294} series={seriesData} options={optionData} />
}

export default AnnualLeaveByDepartment
