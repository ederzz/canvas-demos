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

    calcDeg(data)
    ctx.save()
    ctx.translate(origin.x, origin.y)
    for (let i = 0, d; i < data.length; i++) {
        d = data[i]
        drawSector({
            ctx,
            color: colors[i],
            r: outRadius,
            deg: d.scale
        })
        ctx.rotate(d.scale)
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
    animate({
        origin,
        radius: 200,
        ctx
    })
}

/**
 * 计算数据项所占的角度
 * @param {array} data 数据集
 */
function calcDeg(data) {
    const totalVal = data.reduce((t, item) => t + item.value, 0)
    data.forEach(item => {
        item.scale = item.value / totalVal * 2 * Math.PI
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
    color
}) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, r, 0, deg)
    ctx.closePath()
    ctx.fill()
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

function animate({
    ctx,
    origin,
    radius
}) {
}