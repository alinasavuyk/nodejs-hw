
import { Note } from '../models/note.js';
import createHttpError from 'http-errors'

// Отримати список усіх студентів
export const getAllNotes = async (req, res) => {
   const { page = 1, perPage = 10, search,tag } = req.query;

  const skip = (page - 1) * perPage;
  const notesQuery = Note.find();
  const countQuery = Note.countDocuments();
  // Пошук по частині імені
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

const [totalNotes, notes] = await Promise.all([
    countQuery,
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
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
