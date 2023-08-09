const spliceRandomItem = (array) => {
    return array.splice(
        Math.floor(Math.random() * array.length),
        1
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