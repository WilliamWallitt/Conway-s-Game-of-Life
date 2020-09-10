function grid(x, y, step, alive) {

    let coordinates = []
    for (let i = 0; i < x; i+=step) {
        for(let j = 0; j < y; j+=step) {
            coordinates.push([i, j, 0])
        }
    }

    let visited = []
    for (let i = 0; i < alive; i++) {
        let index = Math.floor(Math.random() * coordinates.length), flag = false
        for (let j = 0; j < visited.length; j++) {
            if (index === visited[j]) {
                flag = true
            }
        }
        if (flag) {
            alive ++
        } else {
            coordinates[Math.floor(Math.random() * coordinates.length)][2] = 1
            flag = false
        }
    }

    return coordinates
}

class Node {

    constructor(coordinate) {
        this.coordinate = coordinate
        this.state = coordinate[2]
        this.prevState = null
    }

    currentState (coords, step, index) {

        this.prevState = this.state

        let state = this.coordinate[2]
        let x = this.coordinate[0], y = this.coordinate[1]
        let xup = x + step, xdown = x - step
        let yup = y + step, ydown = y - step
        let alive = 0


        for (let i = 0; i < coords.length; i++) {

            let current_x = coords[i].getCoordinates()[0]
            let current_y = coords[i].getCoordinates()[1]
            let curr_state = coords[i].getCoordinates()[2]

            // basically prev nodes have been already updated
            // we need to use the prev state's value

            if (i < index) {
                if (coords[i].getPrevState() === null) {
                    curr_state = coords[i].getCoordinates()[2]
                } else {
                    curr_state = coords[i].getPrevState()

                }
            }

            // coords[i].getPrevState()
            if (curr_state === 1) {

                if (current_x === xup && current_y === y) {
                    alive += 1
                }
                else if (current_x === xdown && current_y === y) {
                    alive += 1
                }
                else if (current_x === x && current_y === yup) {
                    alive += 1
                }
                else if (current_x === x && current_y === ydown) {
                    alive += 1
                }
                else if (current_x === xup && current_y === yup) {
                    alive += 1
                }
                else if (current_x === xdown && current_y === ydown) {
                    alive += 1
                }
                else if (current_x === xup && current_y === ydown) {
                    alive += 1
                }
                else if (current_x=== xdown && current_y === yup) {
                    alive += 1
                }
            }
        }

        if (state === 0 && alive === 3) {
            this.state = 1
        } else if (state === 1 && (alive < 2 || alive > 3)) {
            this.state = 0
        } else if (state === 1 && (alive === 2 || alive === 3)) {
            this.state = 1
        }
    }

    getCoordinates () {
        this.coordinate[2] = this.state
        return this.coordinate
    }

    getPrevState () {
        return this.prevState
    }
}

let step = 10
let coordinates = grid(500, 500, step, 200)

for (let i = 0; i < coordinates.length; i++) {
    coordinates[i] = new Node(coordinates[i])
}

function setup() {
    createCanvas(500, 500);
    frameRate(60)
}

function draw() {

    for (let j = 0;  j < coordinates.length; j++){

        let curr = coordinates[j]
        let curr_coordinates = curr.getCoordinates()

        if (curr.getCoordinates()[2] === 1) {
            fill("white")
            rect(curr_coordinates[0], curr_coordinates[1], curr_coordinates[0] + step, curr_coordinates[1] + step)
        } else {
            fill("black")
            rect(curr_coordinates[0], curr_coordinates[1], curr_coordinates[0] + step, curr_coordinates[1] + step)
        }
        curr.currentState(coordinates, step, j)
    }
}
