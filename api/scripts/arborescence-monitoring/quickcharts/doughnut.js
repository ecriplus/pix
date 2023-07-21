import { generateChartUrl } from './quickcharts.js';

function _generateDoughnutChartConfiguration(doughnutData) {
  const totalFilesCount = doughnutData.reduce((acc, curr) => curr.count + acc, 0);
  const data = doughnutData.map(({ count }) => Math.round((count / totalFilesCount) * 100));
  return {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data,
          backgroundColor: ['green', '#eee'],
          label: 'Dataset 1',
          borderWidth: 0,
        },
      ],
      labels: ['src', 'lib'],
    },
    options: {
      circumference: Math.PI,
      rotation: Math.PI,
      cutoutPercentage: 90,
      layout: {
        padding: 60,
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      plugins: {
        datalabels: {
          color: '#404040',
          anchor: 'end',
          align: 'end',
          formatter: '$FORMATTER',
          font: {
            size: 25,
            weight: 'bold',
          },
        },
        doughnutlabel: {
          labels: [
            {
              text: `Files count: ${totalFilesCount}`,
              font: {
                size: 14,
                weight: 'bold',
              },
            },
            {
              text: '\nMigration progress',
              color: '#000',
              font: {
                size: 18,
                weight: 'bold',
              },
            },
            {
              text: `\n\nbranch`,
              font: {
                size: 18,
              },
            },
            {
              text: `\n\n\n${process.env.BRANCH_NAME}` || '\n\n\nunknown',
              font: {
                size: 12,
              },
            },
          ],
        },
      },
    },
  };
}

function getDoughnutChartUrl(data) {
  const doughnutChartConfiguration = _generateDoughnutChartConfiguration(data);
  return generateChartUrl(doughnutChartConfiguration, 2, {
    FORMATTER: '(value) => `${value}%`',
  });
}

export { getDoughnutChartUrl };
