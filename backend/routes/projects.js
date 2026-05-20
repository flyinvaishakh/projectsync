const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route GET /api/projects
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user._id }, { members: req.user._id }]
        }).populate('owner', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/projects
router.post('/', protect, async (req, res) => {
    try {
        const project = await Project.create({
            name: req.body.name,
            description: req.body.description,
            owner: req.user._id,
            members: [req.user._id]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner members', 'name email');
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update' });
            }
            project.name = req.body.name || project.name;
            project.description = req.body.description || project.description;
            project.status = req.body.status || project.status;
            
            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete' });
            }
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
