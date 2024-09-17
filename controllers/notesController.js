const Note = require('../models/Note')
const User = require('../models/User')
const Service = require('../models/Service')

// @desc Get all notes 
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUserAndService = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        const service = await Service.findById(note.service).lean().exec()
        return { ...note, username: user.username, servicename: service.servicename }
    }))

    res.json(notesWithUserAndService)
}

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
    const { user, service, vehicleNo, clientname, mobileNo,requirment } = req.body

    // Confirm data
    if (!user || !service || !vehicleNo || !clientname || !mobileNo ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    
    // Create and store the new user 
    const note = await Note.create({ user, service, vehicleNo, clientname, mobileNo, requirment })

    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

}

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
    const { id, user, service, vehicleNo, clientname, mobileNo, requirment, completed } = req.body
//console.log(req.body)
    // Confirm data
    if (!id || !user || !service || !vehicleNo || !clientname || !mobileNo || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    note.user = user
    note.service = service
    note.vehicleNo = vehicleNo
    note.clientname = clientname
    note.mobileNo = mobileNo
    note.requirment = requirment
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.vehicleNo}' updated`)
}

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.vehicleNo}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}