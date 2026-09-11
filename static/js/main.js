import {fetchData} from './dataService.js'; 
const chartDom0 = document.getElementById('dailyChart'); 
const chartDom1 = document.getElementById('hourlyChart'); 
const chartDom2 = document.getElementById('clickChart'); 
const chartDom3 = document.getElementById('purchaseChart'); 
let charts = {
    dailyChart: echarts.init(chartDom0), 
    hourlyChart: echarts.init(chartDom1), 
    clickChart: echarts.init(chartDom2), 
    purchaseChart: echarts.init(chartDom3) 
};
function renderCharts(data) {
    console.log("Rendering charts with data:", data); 
    
    const dailyChartData = data.dailyChartData; 
    const hourlyChartData = data.hourlyChartData; 
    const clickChartData = data.clickChartData; 
    const purchaseChartData = data.purchaseChartData; 
    
    const startDate = '2017-11-24'; 
    const endDate = '2017-12-03'; 
    
    const startIndex = dailyChartData.xAxisData.indexOf(startDate); 
    const endIndex = dailyChartData.xAxisData.indexOf(endDate) + 1; 
    
    const filteredData = {
        xAxisData: dailyChartData.xAxisData.slice(startIndex, endIndex), 
        clickData: dailyChartData.clickData.slice(startIndex, endIndex), 
        purchaseData: dailyChartData.purchaseData.slice(startIndex, endIndex), 
        cartData: dailyChartData.cartData.slice(startIndex, endIndex), 
        favData: dailyChartData.favData.slice(startIndex, endIndex) 
    };
    
    const option1 = {
        title: {text: 'Daily User Behavior'}, 
        tooltip: {}, 
        legend: {data: ['Click', 'Purchase', 'Cart', 'Favorite']}, 
        xAxis: {
            type: 'category',
            data: filteredData.xAxisData,
            axisLabel: {
                interval: 1 
            }
        },
        yAxis: {type: 'value'}, 
        series: [
            {
                name: 'Click',
                data: filteredData.clickData,
                type: 'line',
                animationDuration: 2000, 
                animationEasing: 'cubicOut', 
                animationDelay: (idx) => idx * 100 
            },
            {
                name: 'Purchase',
                data: filteredData.purchaseData,
                type: 'line',
                animationDuration: 2000,
                animationEasing: 'cubicOut',
                animationDelay: (idx) => idx * 100
            },
            {
                name: 'Cart',
                data: filteredData.cartData,
                type: 'line',
                animationDuration: 2000,
                animationEasing: 'cubicOut',
                animationDelay: (idx) => idx * 100
            },
            {
                name: 'Favorite',
                data: filteredData.favData,
                type: 'line',
                animationDuration: 2000,
                animationEasing: 'cubicOut',
                animationDelay: (idx) => idx * 100
            }
        ]
    };
    const option2 = {
        title: {text: 'Hourly User Behavior'}, 
        tooltip: {}, 
        legend: {data: ['Click', 'Purchase']}, 
        xAxis: {
            type: 'category',
            data: hourlyChartData.xAxisData,
            axisLabel: {
                interval: 1 
            }
        },
        yAxis: {type: 'value'}, 
        series: [
            {
                name: 'Click',
                data: hourlyChartData.clickData,
                type: 'line',
                animationDuration: 2000, 
                animationEasing: 'cubicOut', 
                animationDelay: (idx) => idx * 100 
            },
            {
                name: 'Purchase',
                data: hourlyChartData.purchaseData,
                type: 'line',
                animationDuration: 2000,
                animationEasing: 'cubicOut',
                animationDelay: (idx) => idx * 100
            }
        ]
    };
    const option3 = {
        title: {text: 'ClickTop10'}, 
        tooltip: {}, 
        xAxis: {
            type: 'category',
            data: clickChartData.xAxisData,
            axisLabel: {
                interval: 0 
            }
        },
        yAxis: {type: 'value'}, 
        series: [{
            name: 'Click Count',
            data: clickChartData.seriesData,
            type: 'bar',
            itemStyle: {
                color: function (params) {
                    const colors = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#3E92CC', '#F4A460'];
                    return colors[params.dataIndex % colors.length]; 
                }
            },
            barWidth: '20%', 
            animationDuration: 2000, 
            animationEasing: 'elasticOut', 
            animationDelay: (idx) => idx * 100 
        }]
    };
    const option4 = {
        title: {text: 'PurchaseTop10'}, 
        tooltip: {}, 
        xAxis: {
            type: 'category',
            data: purchaseChartData.xAxisData,
            axisLabel: {
                interval: 0 
            }
        },
        yAxis: {type: 'value'}, 
        series: [{
            name: 'Purchase Count',
            data: purchaseChartData.seriesData,
            type: 'bar',
            itemStyle: {
                color: function (params) {
                    const colors = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#3E92CC', '#F4A460'];
                    return colors[params.dataIndex % colors.length]; 
                }
            },
            barWidth: '20%', 
            animationDuration: 2000, 
            animationEasing: 'elasticOut', 
            animationDelay: (idx) => idx * 100 
        }]
    };
    
    charts.dailyChart.setOption(option1); 
    charts.hourlyChart.setOption(option2); 
    charts.clickChart.setOption(option3); 
    charts.purchaseChart.setOption(option4); 
    
    setTimeout(() => {
        charts.dailyChart.hideLoading(); 
        charts.hourlyChart.hideLoading(); 
        charts.clickChart.hideLoading(); 
        charts.purchaseChart.hideLoading(); 
    }, 300); 
}
function reinitializeCharts() {
    Object.keys(charts).forEach(key => {
        charts[key].dispose(); 
        charts[key] = echarts.init(document.getElementById(key)); 
    });
}
function updateCharts() {
    fetchData('/api/chartData') 
        .then(data => {
            reinitializeCharts(); 
            renderCharts(data); 
        })
        .catch(error => {
            console.error('Error fetching chart data:', error); 
        });
}
function animateChart(chartDom, show = true) {
    chartDom.style.transition = 'opacity 0.5s'; 
    chartDom.style.opacity = show ? 1 : 0; 
}
function debounce(func, wait) {
    let timeout; 
    return function (...args) {
        clearTimeout(timeout); 
        timeout = setTimeout(() => func.apply(this, args), wait); 
    };
}
document.getElementById("overviewBtn").addEventListener("click", debounce(function () {
    showAllCharts(); 
}, 300));
document.getElementById("timeBtn").addEventListener("click", debounce(function () {
    hideAllCharts(); 
    setTimeout(() => {
        [chartDom0, chartDom1].forEach(dom => {
            dom.style.display = 'block'; 
            animateChart(dom, true); 
        });
        updateCharts(); 
    }, 500); 
}, 300));
document.getElementById("top10Btn").addEventListener("click", debounce(function () {
    hideAllCharts(); 
    setTimeout(() => {
        [chartDom2, chartDom3].forEach(dom => {
            dom.style.display = 'block'; 
            animateChart(dom, true); 
        });
        updateCharts(); 
    }, 500); 
}, 300));
function hideAllCharts() {
    Object.values(charts).forEach(chart => chart.showLoading()); 
    setTimeout(() => {
        [chartDom0, chartDom1, chartDom2, chartDom3].forEach(dom => animateChart(dom, false)); 
    }, 300); 
}
function showAllCharts() {
    Object.values(charts).forEach(chart => chart.showLoading()); 
    setTimeout(() => {
        [chartDom0, chartDom1, chartDom2, chartDom3].forEach(dom => {
            dom.style.display = 'block'; 
            animateChart(dom, true); 
        });
        updateCharts(); 
    }, 500); 
}
