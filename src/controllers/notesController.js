
import { Note } from '../models/note.js';
import createHttpError from 'http-errors'


export const getAllNotes = async (req, res) => {
   const { page = 1, perPage = 10, gender, minAvgMark, search } = req.query;
  const skip = (page - 1) * perPage;
  const notesQuery = Note.find({ userId: req.user._id });
  const countQuery = Note.countDocuments();
  if (tag) {
      notesQuery.where({ tag });
      countQuery.where({ tag });
    }

    if (search) {
      const searchFilter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      };
      notesQuery.where(searchFilter);
      countQuery.where(searchFilter);
    }
 // Будуємо фільтр
  if (gender) {
    notesQuery.where("gender").equals(gender);
  }
  if (minAvgMark) {
    notesQuery.where("avgMark").gte(minAvgMark);
  }

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });
  if (!note) {
	 throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
//post
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};
//delete
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};
//patch
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { returnDocument: "after" },
  );
  if (!note) {
	throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
