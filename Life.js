function grid(x, y, step, alive) {

    let coordinates = []
    for (let i = 0; i < x; i += step) {
        for (let j = 0; j < y; j += step) {
            coordinates.push([i, j, 0])
        }
    }

    let visited = []
    for (let i = 0; i < alive; i++) {
        let index = Math.floor(Math.random() * coordinates.length),
            flag = false
        for (let j = 0; j < visited.length; j++) {
            if (index === visited[j]) {
                flag = true
            }
        }
        if (flag) {
            alive++
        } else {
            coordinates[Math.floor(Math.random() * coordinates.length)][2] = 1
            flag = false
        }
    }

    return coordinates
}

class Node {

    constructor(coordinate, index) {
        this.coordinate = coordinate
        this.state = coordinate[2]
        this.prevState = null
        this.index = index
    }

    getNeighbours (coords, step) {

        this.prevState = this.state
        let x = this.coordinate[0],
            y = this.coordinate[1]
        let xup = x + step,
            xdown = x - step
        let yup = y + step,
            ydown = y - step

        let neighbours = []

        for (let i = 0; i < coords.length; i++) {

            let current_x = coords[i].getCoordinates()[0]
            let current_y = coords[i].getCoordinates()[1]
            let curr_state = coords[i].getCoordinates()[2]

            if (current_x === xup && current_y === y) {
                neighbours.push(coords[i])
            } else if (current_x === xdown && current_y === y) {
                neighbours.push(coords[i])
            } else if (current_x === x && current_y === yup) {
                neighbours.push(coords[i])

            } else if (current_x === x && current_y === ydown) {
                neighbours.push(coords[i])

            } else if (current_x === xup && current_y === yup) {
                neighbours.push(coords[i])

            } else if (current_x === xdown && current_y === ydown) {
                neighbours.push(coords[i])

            } else if (current_x === xup && current_y === ydown) {
                neighbours.push(coords[i])

            } else if (current_x === xdown && current_y === yup) {
                neighbours.push(coords[i])
            }

        }

        this.neighbours = neighbours


    }


    getIndex () {
        return this.index
    }

    currentState(index) {

        let alive = 0, state = this.state

        for (let i = 0; i < this.neighbours.length; i++) {
            let current_neighbour = this.neighbours[i]
            let current_index = current_neighbour.getIndex()
            if (current_index < index) {
                alive += current_neighbour.getPrevState() === null ? current_neighbour.getCoordinates()[2] : current_neighbour.getPrevState()
            } else {
                alive += current_neighbour.getCoordinates()[2]
            }
        }

        this.prevState = this.state

        if (state === 0 && alive === 3) {
            this.state = 1
        } else if (state === 1 && (alive < 2 || alive > 3)) {
            this.state = 0
        } else if (state === 1 && (alive === 2 || alive === 3)) {
            this.state = 1
        }

    }

    getCoordinates() {
        this.coordinate[2] = this.state
        return this.coordinate
    }

    getPrevState() {
        return this.prevState
    }
}


let step = 20
let coordinates = grid(500, 500, step, 0)

for (let i = 0; i < coordinates.length; i++) {
    coordinates[i] = new Node(coordinates[i], i)
}


for (let i = 0; i < coordinates.length; i++) {
    coordinates[i].getNeighbours(coordinates, step)
}


let start = false

function mousePressed() {

    if (start) {

        return
    }

    for (let i = 0; i < coordinates.length; i++) {

        if (mouseX > coordinates[i].getCoordinates()[0] &&
            mouseX < coordinates[i].getCoordinates()[0] + step &&
            mouseY > coordinates[i].getCoordinates()[1] &&
            mouseY < coordinates[i].getCoordinates()[1] + step) {

            if (coordinates[i].getCoordinates()[2] === 1) {
                coordinates[i].state = 0
            } else {
                coordinates[i].state = 1
            }

        }

    }

}


function setup() {

    createCanvas(500, 500);

    button = createButton("start");
    button.position(0, 510)
    button.mousePressed(() => {
        start = true
    });

    button = createButton("random start");
    button.position(50, 510)
    button.mousePressed(() => {
        coordinates = grid(500, 500, step, Math.floor(Math.random() * coordinates.length))
        for (let i = 0; i < coordinates.length; i++) {
            coordinates[i] = new Node(coordinates[i], i)
        }

        for (let i = 0; i < coordinates.length; i++) {
            coordinates[i].getNeighbours(coordinates, step)
        }

        start = true
    });

    button = createButton("reset");
    button.position(150, 510)
    button.mousePressed(() => {

        coordinates = grid(500, 500, step, 0)

        for (let i = 0; i < coordinates.length; i++) {
            coordinates[i] = new Node(coordinates[i], i)
        }

        for (let i = 0; i < coordinates.length; i++) {
            coordinates[i].getNeighbours(coordinates, step)
        }

        start = false
    });



}


function draw() {

    for (let j = 0; j < coordinates.length; j++) {

        let curr = coordinates[j]
        let curr_coordinates = curr.getCoordinates()

        if (curr.getCoordinates()[2] === 1) {

            fill("white")
            stroke("black")
            rect(curr_coordinates[0], curr_coordinates[1], curr_coordinates[0] + step, curr_coordinates[1] + step)

        } else {

            fill("black")
            if (!start) {
                stroke("white")
                strokeWeight(1)
            }
            rect(curr_coordinates[0], curr_coordinates[1], curr_coordinates[0] + step, curr_coordinates[1] + step)
        }

        if (start) {

            curr.currentState(j)

        }

    }
}
