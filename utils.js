const spliceRandomItem = (array) => {
    return array.splice(
        Math.floor(Math.random() * array.length),
        1
    )
}

checkCollission = (x, x1, x2, y, y1, y2) => {
    const xmin = Math.min(x1, x2)
    const xmax = Math.max(x1, x2)
    const ymin = Math.min(y1, y2)
    const ymax = Math.max(y1, y2)
    return (x > xmin &&
        x < xmax &&
        y > ymin &&
        y < ymax
    )
}

const getCenter = (matrix, i1, i2) => {
    const [p1x, p1y] = matrix[i1]
    const [p2x, p2y] = matrix[i2]
    const x = (p1x + p2x) / 2
    const y = (p1y + p2y) / 2
    return [x, y]
}

const assignImage = (src) => {
    const image = new Image();
    image.src = src
    return image
}