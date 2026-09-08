import express from 'express'

const PORT = 3000;
const app = express();

app.use(express.json())

let cars = [
    { id: 1, brand: 'Toyota', year: 2018 },
    { id: 2, brand: 'BMW', year: 2020 },
    { id: 3, brand: 'Audi', year: 2016 }
]

app.get('/cars', (req, res) => {
    res.json(cars)
})

app.get('/cars/:id', (req,res) => {
    const id = +req.params.id
    const car = cars.find(x => x.id == id)
    if(!car)
    {
       return res.status(404).json({message: 'Car not found!'})
    }
    res.status(200).json(car)
})

app.post('/cars', (req,res) => {
    const {brand, year} = req.body
    if(!brand || !year)
    {
       return res.status(404).json({message: 'Brand and year are required!'})
    }
    res.status(200).json(car)
    const nextId = cars[cars.length - 1]?.id + 1 || 0 + 1
    const car = {id, brand, year}
    cars.push(car)
    res.status(200).json(car)
})

app.put('/cars/:id', (req,res) =>{
    const id = +req.params.id;
    const car = cars.find(x => x.id === id)
    if(!car)
    {
       return res.status(404).json({message: 'Car not found!'})
    }
    const {brand, year} = req.body
    if(!brand || !year)
    {
       return res.status(404).json({message: 'Brand and year are required!'})
    }
    car.brand = brand;
    car.year = year;
    res.status(200).json(car)
})

app.delete("/cars/:id", (req,res) => {
    const id = +req.params.id;
    const car = cars.find(x => x.id === id)
    if(!car)
    {
       return res.status(404).json({message: 'Car not found!'})
    }
    const index = cars.indexOf(car)
    cars.splice(index,1)
    res.status(200).json({message: "Delete was successful!"}) 
})