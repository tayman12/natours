const express = require('express');
const tourService = require('../services/tourService');

exports.getAllTours = async (req, res) => {
  const tours = await tourService.getTours(req.query);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestedAt,
    data: { tours: tours },
  });
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await tourService.addTour(req.body);
    res.status(201).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateTourById = async (req, res) => {
  try {
    const tour = await tourService.updateTour(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    await tourService.deleteTour(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (error) {
    if (error.message === 'Tour not found') {
      res.status(404).json({ status: 'fail', message: 'Tour not found' });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
