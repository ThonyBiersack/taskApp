import * as v from "../validation/validator.js";
import Task from "../database/taskSchema.js";
// import askAI from "../AI/gemini.js";
import { toTaskMermaidMindmap } from "../helper/taskMindmap.js";

const dashboardController = (async (req, res) => {
    try {
        // Get all tasks for current user
        const allTasks = await Task.find({ userId: req.user.userId }).sort({ deadline: 1 });

        // Separate active and done tasks
        const activeTasks = allTasks.filter(task => task.status === 'active');
        const doneTasks = allTasks.filter(task => task.status === 'done');

        return res.render('page/dashboard', {
            title: 'Dashboard',
            activeTasks: activeTasks.map((task) => ({
                ...task.toObject(),
                mindmapSource: toTaskMermaidMindmap(task)
            })),
            doneTasks,
            stats: {
                total: allTasks.length,
                completed: doneTasks.length,
                inProgress: activeTasks.length,
                overdue: 0
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).render('page/handle', {
            title: 'Dashboard Error',
            status: 'error',
            message: 'Could not load dashboard'
        });
    }
});

// buat nerima pesan status 200/400/404
const handleController = (req, res) => {
    const status = ['success', 'error', 'not-found', 'unauthorized'].includes(req.query.status)
        ? req.query.status
        : 'error';
    const message = req.query.message || 'Something went wrong. Please try again.';

    return res.status(
        status === 'not-found' ? 404 :
        status === 'unauthorized' ? 401 :
        status === 'success' ? 200 : 400
    )
        .render('page/handle', { title: status === 'success' ? 'Success' : 'Request status', status, message });
};

const taskController = (async (req, res) => {
    try {
        const newTask = v.Tasks.safeParse(req.body);

        if (!newTask.success) {
            return res.status(400).render('page/handle', {
                title: 'Task creation error',
                status: 'error',
                message: newTask.prettifyError()
            })
        }

        const { title, description, deadline } = newTask.data;

        const data = {
            title: title,
            description: description,
            deadline: deadline,
            userId: req.user.userId
        }
        console.log(data);

        const task = await Task.create(data);

        return res.redirect(303, '/dashboard');
    } catch (error) {
        return res.status(500).render('page/handle', {
            title: 'Task creation error',
            status: 'error',
            message: 'Could not create task. Please try again.'
        })
    }
})

const updateTaskController = (async (req, res) => {
    try {
        const updatedTask = v.Tasks.safeParse(req.body);

        if (!updatedTask.success) {
            return res.status(400).render('page/handle', {
                title: 'Task update error',
                status: 'error',
                message: updatedTask.error.flattenError()
            });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            updatedTask.data,
            { runValidators: true, returnDocument: 'after' }
        );

        if (!task) {
            return res.status(404).render('page/handle', {
                title: 'Task not found',
                status: 'not-found',
                message: 'That task could not be found.'
            });
        }

        return res.redirect(303, '/dashboard');
    } catch (error) {
        console.error('Task update error:', error);
        return res.status(500).render('page/handle', {
            title: 'Task update error',
            status: 'error',
            message: 'Could not update task. Please try again.'
        });
    }
});

export { dashboardController, handleController, taskController, updateTaskController };