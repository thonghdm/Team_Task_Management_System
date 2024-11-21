const Note = require('~/models/NoteSchema')

const createNote = async (reqBody) => {
    try {
        const newNoteData = {
            ...reqBody
        }
        const newNote = new Note(newNoteData)
        const createdNote = await newNote.save()

        return createdNote
    } catch (error) {
        throw new Error(error)
    }
}

const updateNote = async (memberId, updateData) => {
    try {
        const existingNote = await Note.findById(memberId)
        if (!existingNote) {
            throw new Error('Note not found')
        }

        Object.assign(existingNote, updateData)
        const updatedNote = await existingNote.save()
        return updatedNote
    } catch (error) {
        throw new Error(`Failed to update note: ${error.message}`)
    }
}

const getNoteById = async (memberId) => {
    try {
        if (!memberId) {
            throw new Error('Note ID not provided')
        }
        const note = await Note.findById(memberId)
        if (!note) {
            throw new Error('Note not found')
        }
        return note
    } catch (error) {
        throw new Error(`Failed to get note: ${error.message}`)
    }
}

module.exports = { createNote, updateNote, getNoteById }
