let heatLoss_chart = new function () {

    // generate range of integers
    this.range = function (start, end) {
        let ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    };

    let ctx;
    let chartInstance;

    let ta, i, heatLosses, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, xLabelF;

    ta = this.range(10, 40);

    // function that calculate the heat losses
    this.getData = function () {

        h1 = [];
        h2 = [];
        h3 = [];
        h4 = [];
        h5 = [];
        h6 = [];
        h7 = [];
        h8 = [];
        h9 = [];
        h10 = [];


        for (i = 0; i < ta.length; i++) {
            heatLosses = comf.pmv(ta[i], d.tr, d.vel, d.rh, d.met, d.clo, d.wme);
            h1.push(heatLosses.hl1.toFixed(1));
            h2.push(heatLosses.hl2.toFixed(1));
            h3.push(heatLosses.hl3.toFixed(1));
            h4.push(heatLosses.hl4.toFixed(1));
            h5.push(heatLosses.hl5.toFixed(1));
            h6.push(heatLosses.hl6.toFixed(1));
            h7.push((heatLosses.hl1 + heatLosses.hl2 + heatLosses.hl3).toFixed(1));
            h8.push((heatLosses.hl4 + heatLosses.hl5 + heatLosses.hl6).toFixed(1));
            h9.push((heatLosses.hl1 + heatLosses.hl2 + heatLosses.hl3 + heatLosses.hl4 + heatLosses.hl5 + heatLosses.hl6).toFixed(1));
            h10.push((d.met * 58.15).toFixed(1));
        }

    };

    // function that updates the chart whenever user selects a different input
    this.update = function () {

        this.getData();

        chartInstance.data.datasets[0].data = h1;
        chartInstance.data.datasets[1].data = h2;
        chartInstance.data.datasets[2].data = h3;
        chartInstance.data.datasets[3].data = h4;
        chartInstance.data.datasets[4].data = h5;
        chartInstance.data.datasets[5].data = h6;
        chartInstance.data.datasets[6].data = h7;
        chartInstance.data.datasets[7].data = h8;
        chartInstance.data.datasets[8].data = h9;
        chartInstance.data.datasets[9].data = h10;

        if (isCelsius) {
            chartInstance.data.labels = ta;
            chartInstance.options.scales.xAxes[0].scaleLabel.labelString = "干球温度 [°C]"
        } else {
            xLabelF = [];
            for (i = 0; i < ta.length; i++) {
                xLabelF.push(util.CtoF(ta[i]));
            }
            chartInstance.data.labels = xLabelF;
            chartInstance.options.scales.xAxes[0].scaleLabel.labelString = "干球温度 [°F]"
        }

        chartInstance.update();
    };

    // function that draws the chart
    this.draw = function () {
        Chart.defaults.global.defaultFontFamily = "sans-serif";

        this.getData();

        ctx = document.getElementById('chart_heatLoss_div').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ta,
                datasets: [
                    {
                        label: '潜热——水蒸气散发（不显汗）',
                        data: h1,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#556B2F",
                        hidden: true,
                    }, {
                        label: '潜热——汗液蒸发（显汗）',
                        data: h2,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#9ACD32",
                        hidden: true,
                    }, {
                        label: '潜热——呼吸（水蒸气）',
                        data: h3,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#008000",
                        hidden: true,
                    }, {
                        label: '显热——呼吸（热量）',
                        data: h4,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#8B4513",
                        hidden: true,
                    }, {
                        label: '显热——辐射散热',
                        data: h5,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#D2691E",
                        hidden: true,
                    }, {
                        label: '显热——对流散热',
                        data: h6,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#F4A460",
                        hidden: true,
                    }, {
                        label: '总潜热散热量',
                        data: h7,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "blue",
                    }, {
                        label: '总显热散热量',
                        data: h8,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "pink",
                    }, {
                        label: '总散热量',
                        data: h9,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "red",
                    }, {
                        label: '新陈代谢率',
                        data: h10,
                        backgroundColor: 'rgba(255, 159, 64, 0)',
                        borderColor: "#800080",
                    }],
            },
            options: {
                title: {
                    display: true,
                    text: '散热量组成',
                    fontColor : "#fff"
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        fontColor: "#fff",
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "散热量 [W/m²]",
                            fontColor:'#fff',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor:'#fff',
                        },
                        gridLines: {
                            zeroLineColor: '#fff'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "干球温度 [°C]",
                            fontColor:'#fff',
                        },
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                            minRotation: 0,
                            maxTicksLimit: 20,
                            fontColor:'#fff',
                        },
                        gridLines: {
                            zeroLineColor: '#fff'
                        }
                    }]
                },
                layout: {
                    padding: 5
                },
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0 // disables bezier curves
                    },
                    point: {radius: 0}
                },
            }
        });

    };
};


