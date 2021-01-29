var chartData;
var myinterval;

function initChart() {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  if (coinsInStorage !== undefined) {
    const symbolArr = coinsInStorage.map(function (b) {
      return b.symbol;
    });
    try {
      const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolArr.join(
        ','
      )}&tsyms=USD`;
      $('#loaderfirstApi').show();
      axios.get(apiUrl).then((response) => {
        const chartData = response.data;
        loadChart(chartData);
        $('#loaderfirstApi').css('display', 'none');
      });
    } catch (error) {
      console.log(error);
    }
  }
}

function loadChart(chartData) {
  const coinsInStorage = getFromStorage('selectedCoinsArr');
  var dataCoin1 = [];
  var dataCoin2 = [];
  var dataCoin3 = [];
  var dataCoin4 = [];
  var dataCoin5 = [];

  var chart = new CanvasJS.Chart('myChart', {
    zoomEnabled: true,
    theme: 'light1',
    title: {
      text: 'Coins prices in Dollars',
    },
    axisX: {
      title: 'chart updates every 2 secs',
    },
    axisY: {
      prefix: '$',
      includeZero: false,
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'top',
      fontSize: 18,
      fontColor: 'dimGrey',
      itemclick: toggleDataSeries,
    },
    data: [
      {
        type: 'line',
        xValueType: 'dateTime',
        yValueFormatString: '$####.000',
        xValueFormatString: 'hh:mm:ss TT',
        showInLegend: true,
        name: '',
        dataPoints: dataCoin1,
      },
      {
        type: 'line',
        xValueType: 'dateTime',
        yValueFormatString: '$####.000',
        showInLegend: true,
        name: '',
        dataPoints: dataCoin2,
      },
      {
        type: 'line',
        xValueType: 'dateTime',
        yValueFormatString: '$####.000',
        showInLegend: true,
        name: '',
        dataPoints: dataCoin3,
      },
      {
        type: 'line',
        xValueType: 'dateTime',
        yValueFormatString: '$####.000',
        showInLegend: true,
        name: '',
        dataPoints: dataCoin4,
      },
      {
        type: 'line',
        xValueType: 'dateTime',
        yValueFormatString: '$####.000',
        showInLegend: true,
        name: '',
        dataPoints: dataCoin5,
      },
    ],
  });

  coinsInStorage.forEach((coin, index) => {
    chart.options.data[index].name = `${coin.symbol.toUpperCase()}`;
  });
  chart.render();

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  var updateInterval = 2000;
  var time = new Date();

  coinsInStorage.forEach((coin, index) => {
    let symbol = coin.symbol.toUpperCase();
    if (chartData[`${symbol}`] != null) {
      let datapoints = chart.options.data[index].dataPoints;
      datapoints.push({ x: time.getTime(), y: chartData[`${symbol}`].USD });
    }
  });
  chart.render();

  function updateChart() {
    const coinsInStorage = getFromStorage('selectedCoinsArr');
    time.setTime(time.getTime() + updateInterval);
    coinsInStorage.forEach((coin, index) => {
      let symbol = coin.symbol.toUpperCase();
      if (chartData[`${symbol}`] != null) {
        let datapoints = chart.options.data[index].dataPoints;
        datapoints.push({ x: time.getTime(), y: chartData[`${symbol}`].USD });
        chart.options.data[index].legendText =
          chart.options.data[index].name +
          ' = ' +
          '$' +
          chartData[`${symbol}`].USD;
      }
    });
    chart.render();
  }

  myinterval = setInterval(function () {
    updateChart();
  }, updateInterval);
}
