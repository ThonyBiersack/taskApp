import express from 'express';
import {
    loginFormController,
    loginController,
    registController,
    formRegController,
    forgetFormController,
    forgetController,
    logOutController,
} from '../controller/userController.js';
import {
    handleController,
    dashboardController,
    taskController,
    updateTaskController,
} from "../controller/uiController.js";
import verifikasi from '../middleware/authentication.js';

const router = express.Router();

router.route('/')
    .get(loginFormController)
    .post(loginController)

router.route('/register')
    .get(formRegController)
    .post(registController);

router.route('/forgot-password')
    .get(forgetFormController)
    .post(forgetController);

router.route('/handle')
    .get(handleController);

router.route('/dashboard')
    .get(verifikasi, dashboardController)

router.route('/logout')
    .get(logOutController)

router.route('/tasks')
    .post(verifikasi, taskController)

router.route('/tasks/:id')
    .post(verifikasi, updateTaskController)

// router.route('/admin')
//     .get(verifikasi, adminController)

export default router;