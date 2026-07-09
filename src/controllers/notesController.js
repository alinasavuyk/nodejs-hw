
import { Note } from '../models/note.js';
import createHttpError from 'http-errors'

// Отримати список усіх студентів
export const getAllNotes = async (req, res) => {
   const { page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;
  const notesQuery = Note.find();
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
// Отримати одного студента за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
	 throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
//post
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

//delete
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
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
    { _id: noteId }, // Шукаємо по id
    req.body,
    { returnDocument: "after" }, // повертаємо оновлений документ
  );

  if (!note) {
	throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
