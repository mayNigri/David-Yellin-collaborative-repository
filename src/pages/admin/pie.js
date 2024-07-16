import { Pie } from "react-chartjs-2"
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { useMemo } from "react";

const options = {
    plugins: {
        datalabels: {
            formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex];
            },
            color: '#000',
            font: {
                weight: 'bold',
                size: 14,
            },
            display: true,
            align: 'right',
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.raw !== null) {
                        label += context.raw;
                    }
                    return label;
                },
            },
        },
    },
    maintainAspectRatio: false,
};


const materialColors = [
    "#F44336", // Red
    "#2196F3", // Blue
    "#FFEB3B", // Yellow
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#3F51B5", // Indigo
    "#03A9F4", // Light Blue
    "#00BCD4", // Cyan
    "#009688", // Teal
    "#4CAF50", // Green
    "#673AB7", // Deep Purple
    "#8BC34A", // Light Green
    "#CDDC39", // Lime
    "#FFC107", // Amber
    "#FF9800", // Orange
    "#FF5722", // Deep Orange
    "#795548", // Brown
    "#9E9E9E", // Grey
    "#607D8B", // Blue Grey
    "#B71C1C", // Red Darken-4
    "#880E4F", // Pink Darken-4
    "#4A148C", // Purple Darken-4
    "#311B92", // Deep Purple Darken-4
    "#1A237E", // Indigo Darken-4
    "#0D47A1", // Blue Darken-4
    "#01579B", // Light Blue Darken-4
    "#006064", // Cyan Darken-4
    "#1B5E20", // Green Darken-4
    "#33691E",  // Light Green Darken-4
    "#004D40", // Teal Darken-4

  ];
  

const PieChart = ({labels, values, title}) => {

    
    return <>
    <h3 className="text-center">{title}</h3>
    <Pie
    width={'384px'}
    height={'384px'}
    data={{
        labels: labels.map((l, i) => `${l} (${values[i]})`),
        xLabels: labels,
        datasets: [{
            label: title,
            data: values,
            backgroundColor: materialColors
        }],
    }} options={options} plugins={[ChartDataLabels]}
    
    
    />
    </>
}

export default PieChart;