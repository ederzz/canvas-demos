/**
 * TODO:
 * 1.网格线格式
 * 2.网格线开关
 * 3.重绘调研：目前太过粗暴
 */

function drawBarChart({
    data,
    xAxisData,
    showLabel = true
}) {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const canvasW = canvas.width // 画布宽高
    const canvasH = canvas.height
    const chartMargin = 40 // 图表margin
    const chartW = canvasW - 2 * chartMargin // 柱状图宽高
    const chartH = canvasH - 2 * chartMargin

    const barMargin = 10 // 柱条间距
    const origin = {
        x: chartMargin,
        y: canvasH - chartMargin
    } // 坐标轴原点
    const xAxisEnd = {
        x: origin.x + chartW,
        y: origin.y
    } // x 轴结束点
    const yAxisEnd = {
        x: origin.x,
        y: origin.y - chartH
    } // y轴结束点

    const splitNumber = 10 // y轴分割段数
    const maxVal = Math.max(...data) + 50 // 最大数据(+50增加距离顶部间隙)
    const yGridInterval = chartH / splitNumber >> 0 // y轴单元的间隔，这个是距离上的间隔
    const valInterval = maxVal / splitNumber >> 0
    const axisLabelMargin = 5 // 坐标轴标签到轴线距离

    // 柱条相关属性
    const barColors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'] // 柱条颜色
    const labelFontProp = { // 标签字体属性
        fontSize: 20,
        color: '#bbb'
    }
    const lightBarColors = barColors.map(cor => LightenDarkenColor(cor, 30))
    const barW = (chartW / data.length - barMargin) >> 0 // 柱条宽度

    // 设置hover效果
    const mousePos = {} // 鼠标位置
    let hoverTimer = null // 更新hover效果的定时器

    ctx.translate(0.5, 0.5) // 1px问题
    canvas.addEventListener('mousemove', function (e) {
        mousePos.x = e.clientX - canvas.getBoundingClientRect().left
        mousePos.y = e.clientY - canvas.getBoundingClientRect().top
        clearTimeout(hoverTimer)
        hoverTimer = setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawAxis({ origin, xAxisEnd, yAxisEnd, xAxisData })
            drawGrid()
            drawSeries()
        }, 10)
    })

    const animationDuration = 500 // 默认动画时间为0.5s
    drawAxis({ origin, xAxisEnd, yAxisEnd, xAxisData })
    drawGrid()
    drawSeries(true) // true or false 控制是否拥有动画效果

    /**
     * 绘制坐标轴及标签
     * @param {object} origin 坐标轴原点
     * @param {object} xAxisEnd x轴结束点
     * @param {object} yAxisEnd y轴结束点
     * @param {array} xAxisData x轴标签
     */
    function drawAxis() {
        drawLine(origin, xAxisEnd)
        drawLine(origin, yAxisEnd)
        drawAxisLabel(xAxisData)
    }

    // 直线
    function drawLine(start, end, color = '#000') {
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
    }

    // 坐标轴标签
    function drawAxisLabel(xAxisData) {
        ctx.font = '12px Arial'
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        for (let i = 0; i < xAxisData.length; i++) {
            ctx.fillText(
                xAxisData[i],
                origin.x + barMargin / 2 + barW / 2 + i * (barW + barMargin),
                origin.y + axisLabelMargin
            )
        }

        ctx.textBaseline = 'middle'
        ctx.textAlign = 'end'
        for (let i = 0; i < splitNumber; i++) {
            ctx.fillText(
                valInterval * (i + 1),
                origin.x - axisLabelMargin,
                origin.y - yGridInterval * (i + 1)
            )
        }
    }

    // 网格线
    function drawGrid(color = '#eee') {
        ctx.beginPath()
        ctx.strokeStyle = color
        
        for (let i = 0; i < splitNumber; i++) {
            const y = origin.y - yGridInterval * (i + 1)
            ctx.moveTo(origin.x, y)
            ctx.lineTo(origin.x + chartW, y)
        }
        ctx.stroke()
    }

    // 渲染数据
    function drawSeries(hasAnimation = false) {
        const step = 100 // 将高度分成100份绘制
        let stepIndex = 100
        if (hasAnimation) {
            stepIndex = 1
        }

        drawSeriesStep({ stepIndex, step, data, barW })

        while (stepIndex < step) {
            // 动画
            stepIndex++
            (function (stepIndex) {
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    drawAxis({ origin, xAxisEnd, yAxisEnd, xAxisData })
                    drawGrid()
                    drawSeriesStep({ stepIndex, step, data, barW })
                }, animationDuration * stepIndex / step)
            })(stepIndex)
        }
    }

    /**
     * 绘制柱状图
     * @param {array} data 绘制数据
     * @param {array} data 绘制数据
     * @param {array} data 绘制数据
     */
    function drawSeriesStep({ stepIndex, step, data, barW }) {
        for (let i = 0; i < data.length; i++) {
            const value = data[i]
            const color = barColors[i % barColors.length]
            const lightColor = lightBarColors[i % barColors.length]

            const height = barH(value, maxVal, chartH * stepIndex / step)
            const valLabel = value * stepIndex / step >> 0
            drawBar(
                origin.x + barMargin / 2 + i * (barW + barMargin),
                origin.y - height,
                barW,
                height,
                color,
                lightColor,
                valLabel
            )
        }
    }

    /**
     * 绘制柱状体
     * @param {number} x 柱状体左上角x
     * @param {number} y 柱状体左上角y
     * @param {number} width 状状体宽度
     * @param {number} height 
     * @param {string} color 柱状体颜色
     * @param {string} emphsisColor 柱状体hover颜色
     */
    function drawBar(x, y, width, height, color, emphsisColor, valLabel) {
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        if (showLabel) {
            drawBarLabel({
                x: x + width / 2,
                y,
                label: valLabel,
                ...labelFontProp
            })
        }
        if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
            ctx.fillStyle = emphsisColor
        } else {
            ctx.fillStyle = color
        }
        ctx.fill()
    }

    /**
     * 绘制柱状体标签
     * @param {string} label 标签 
     * @param {number} x 标签x坐标
     * @param {number} y 标签y坐标
     * @param {number} fontSize 标签字体大小
     * @param {string} color 标签颜色
     */
    function drawBarLabel({
        label,
        x,
        y,
        fontSize = 18,
        color = '#ff0'
    }) {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = color
        ctx.font = `${fontSize}px Arial`
        ctx.fillText(label, x, y)
    }

    /**
     * 计算柱状体高度
     * @param {number} value 数据值
     * @param {number} maxVal 最大数据值
     * @param {number} chartHeight 图表高度
     */
    function barH(value, maxVal, chartHeight) {
        return value / maxVal * chartHeight
    }
}


const options = {
    xAxisData: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    data: [
        200, 144, 400, 390, 700, 600, 833
    ]
}

drawBarChart(options)

/**
 * 加亮或加深一个颜色（https://codeday.me/bug/20170311/4990.html）
 * @param {string} col hex颜色
 * @param {number} amt 
 */
function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}