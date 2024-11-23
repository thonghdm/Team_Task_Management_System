// const noteService = require('~/services/note/noteService')
// const { StatusCodes } = require('http-status-codes')

// const noteController = {
//     createNote: async (req, res, next) => {
//         try {
//             const createNote = await noteService.createNote(req.body)
//             res.status(StatusCodes.CREATED).json({
//                 message: 'Note created successfully!',
//                 note: createNote
//             })
//         } catch (error) {
//             next(error)
//         }
//     },
//     updateNote: async (req, res, next) => {
//         const { memberId } = req.body
//         if (!memberId) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: `Note ${ memberId} is required` })
//         }
//         try {
//             const updatedNote = await noteService.updateNote(memberId, req.body)
//             res.status(StatusCodes.OK).json({
//                 message: 'Note updated successfully!',
//                 note: updatedNote
//             })
//         } catch (error) {
//             next(error)
//         }
//     },
//     getNoteById: async (req, res, next) => {
//         const { memberId } = req.params
//         if (!memberId) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: `Note ${ memberId} is required` })
//         }
//         try {
//             const note = await noteService.getNoteById(memberId)
//             res.status(StatusCodes.OK).json({
//                 message: 'Note fetched successfully!',
//                 note
//             })
//         } catch (error) {
//             next(error)
//         }
//     }
// }

// module.exports = noteController