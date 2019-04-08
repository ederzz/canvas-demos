const data = [
    {
        name: '高',
        value: 300
    },
    {
        name: '中',
        value: 288
    },
    {
        name: '低',
        value: 533
    },
    {
        name: 's',
        value: 288
    },
    {
        name: '2',
        value: 533
    }
]
drawPieChart(data, {
    radius: [100, 200]
    // radius: 200
})

function drawPieChart(data, opts) {
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    const canvasW = canvas.width
    const canvasH = canvas.height
    const origin = {
        x: canvasW / 2,
        y: canvasH / 2
    }
    let inRadius
    let outRadius

    const {
        radius
    } = opts

    if (Array.isArray(radius)) {
        inRadius = radius[0]
        outRadius = radius[1]
    }
    if (typeof radius === 'number') {
        outRadius = radius
    }

    const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
    let step = 100
    let stepIndex = 1
    const mousePos = {
        x: null,
        y: null
    }

    calcDeg(data)
    drawPie()

    const timer = setInterval(() => {
        drawPie()
        stepIndex++
        if (stepIndex > step) {
            clearInterval(timer)
        }
    }, 5)

    canvas.addEventListener('mousemove', function ({
        clientX, clientY
    }) {
        mousePos.x = clientX
        mousePos.y = clientY
        ctx.clearRect(0, 0, canvasW, canvasH)
        drawPie()
    })

    function drawPie() {
        let startAngle = 0
        let endAngle = 0
        ctx.save()
        ctx.translate(origin.x, origin.y)
        for (let i = 0, d; i < data.length; i++) {
            d = data[i]
            const currentAngle = d.angle * stepIndex / step
            endAngle += currentAngle
            drawSector({
                ctx,
                color: colors[i],
                r: outRadius,
                startAngle,
                endAngle,
                deg: d.angle
            })
            startAngle += currentAngle
        }
        ctx.restore()
        if (inRadius) {
            drawCircle({
                origin,
                color: '#fff',
                ctx,
                radius: inRadius
            })
        }
    }

    /**
     * 计算数据项所占的角度
     * @param {array} data 数据集
     */
    function calcDeg(data) {
        const totalVal = data.reduce((t, item) => t + item.value, 0)
        data.forEach(item => {
            item.angle = item.value / totalVal * 2 * Math.PI
        })
    }

    /**
     * 绘制扇形
     * @param {number} deg 角度 
     * @param {number} r 半径 
     * @param {string} color 颜色 
     */
    function drawSector({
        ctx,
        deg,
        r,
        color,
        startAngle,
        endAngle
    }) {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, r, startAngle, endAngle)
        ctx.closePath()
        if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
            ctx.fillStyle = LightenDarkenColor(color, 30)
        } else {
            ctx.fillStyle = color
        }
        ctx.fill()
        ctx.fillStyle = 'red'
        ctx.fillRect(mousePos.x, mousePos.y, 2, 2)
    }

    function drawCircle({
        ctx,
        origin,
        radius,
        color
    }) {
        ctx.beginPath()
        ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }
}

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