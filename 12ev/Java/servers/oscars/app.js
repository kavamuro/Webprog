import express from 'express'

const PORT = 3000
const app = express()

app.use(express.json())

const awards = [
    {id: 1, movie: 'Lord of the Rings', director: 'Peter Jackson'},
    {id: 2, movie: 'Titanic', director: 'James Camerot'},
    {id: 3, movie: 'God Father', director: 'F. F. Coppola'}
]

app.get('/awards', (req, res) =>{
    res.status(200).json(awards)
})

app.get('/awards/:id', (req,res) =>{
    const id = +rep.param.id
    const award = awards.find((film) => film.id === id);
    if(!award)
    {
        return res.status(404).json({message: "Award not found!"})

    }
    res.status(200).json(award)
})

app.post('/awards', (req,res) =>{
    const{movie,director} = req.body
    if (!movie || !director){
         return res.status(404).json({message: "Movie title and director are required!"})
    }
    const id = awards[awards.length - 1]?.id + 1 
    const award = {id, movie, director}
    awards.push(award);
    res.status(201).json(award);
})

app.put('/awards/:id', (req,res) =>{
    const id = +rep.param.id
    const award = awards.find((film) => film.id === id);
      if(!award)
    {
        return res.status(404).json({message: "Award not found!"})
    }
     const{movie,director} = req.body
    if (!movie || !director){
         return res.status(404).json({message: "Movie title and director are required!"})
    }
    award.movie = movie;
    award.director = director;
    res.status(201).json(award)
})

app.delete('/awards/:id', (req,res) =>{
    const id = +req.params.id
    award = awards.find(x => x.id !== id)
    if(!award)
    {
        return res.status(404).json({message: "Award not found!"})
    }
    const index = awards.indexOf(award);
    awards.splice(index,1)
    res.status(201).json({message: 'Delete success'})
})

app.listen(PORT, () =>{
    console.log(`Server runs on http://localhost:${PORT}`);
})