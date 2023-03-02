// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** MUI import
import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

const AnnualDirectReports = ({ type, series, options, seriesThresholds, optionsThresholds }: any) => {
  const theme = useTheme()

  const series1 = [
    {
      name: 'Average Excess Days By Employee',
      data: series
    },
    {
      name: 'Thresholds Limit',
      data: seriesThresholds
    }
  ]

  const options1: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    markers: {
      size: [6, 0],
      colors: [hexToRGBA(theme.palette.primary.light, 1), '#fff']
    },
    annotations: {
      yaxis: [
        {
          y: parseInt(`${optionsThresholds}`, 10),
          strokeDashArray: 0,
          borderWidth: 3,
          borderColor: hexToRGBA(theme.palette.error.light, 1)
        }
      ]
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true
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
      hexToRGBA(theme.palette.error.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.success.light, 1)
    ],
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
      categories: options,
      title: {
        text: 'Leave By Employee',
        style: {
          color:
            theme.palette.mode === 'light'
              ? `rgba(${theme.palette.customColors.light}, 0.87)`
              : `rgba(${theme.palette.customColors.dark}, 0.87)`,
          fontFamily: 'Helvetica, Arial, sans-serif'
        }
      }
    },
    yaxis: {
      labels: { align: theme.direction === 'rtl' ? 'right' : 'left' },
      title: {
        text: 'Leave By Department',
        style: {
          color:
            theme.palette.mode === 'light'
              ? `rgba(${theme.palette.customColors.light}, 0.87)`
              : `rgba(${theme.palette.customColors.dark}, 0.87)`,
          fontFamily: 'Helvetica, Arial, sans-serif'
        }
      }
    }
  }

  return <ReactApexcharts type={type} height={294} series={series1} options={options1} />
}

export default AnnualDirectReports
