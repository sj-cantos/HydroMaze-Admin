import mongoose, { mongo } from 'mongoose'

export const databaseInit = () => {
    mongoose.connect(process.env.VITE_DATABASE_URI)
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', ()=>console.log('CONNECTED TO THE DATABASE'))
}