const Venue = require('../model/Venue');

const findAll = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching venues', error: e });
  }
};

const save = async (req, res) => {
  try {
    const { name, priceperplate, address, capacity, description } = req.body;

    const venue = new Venue({
      name,
      priceperplate,
      address,
      capacity,
      description,
      image: req.file.originalname,
    });

    await venue.save();
    res.status(201).json(venue);
  } catch (e) {
    res.status(500).json({ message: 'Error saving venue', error: e });
  }
};

const findById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json(venue);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching venue', error: e });
  }
};

const deleteById = async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting venue', error: e });
  }
};

const update = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json(venue);
  } catch (e) {
    res.status(500).json({ message: 'Error updating venue', error: e });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
};
