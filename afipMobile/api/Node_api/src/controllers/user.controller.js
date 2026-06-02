import bcryptjs from 'bcryptjs';
import userModel from '../models/user.model.js';
import { faker } from "@faker-js/faker";
import jwt from 'jsonwebtoken';
import { initializeUserCategories } from '../utils/initializeUserCategories.js';

export const createUser = async (req, res) => { //post
    try {
        await userModel.sync();
        const salt = await bcryptjs.genSalt(10);
        const dataUser = req.body;
        const passwordHashed = await bcryptjs.hash(dataUser.user_password, salt);
        const createUser = await userModel.create({
            user_user: dataUser.user_user,
            user_name: dataUser.user_name,
            user_password: passwordHashed
        });

        // Inicializar categorías predefinidas para el nuevo usuario
        try {
            await initializeUserCategories(createUser.user_id);
        } catch (categoryError) {
            console.error('Error initializing categories:', categoryError);
            // No fallar el registro si hay error en categorías
        }

        const token = jwt.sign({
            email: createUser.user_user,
            user_id: createUser.user_id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Created user :)",
            id: createUser.user_id,
            userName: createUser.user_name,
            token: token,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
            error: error.message,
        });
    }
};


export const showUser = async (req, res) => { //get - solo devuelve el usuario autenticado
    try {
        const user = await userModel.findOne({
            where: { user_id: req.user.user_id },
            attributes: { exclude: ['user_password'] } // No devolver la contraseña
        });

        if (!user) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Show user :)",
            body: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
        });
    }
};

export const showUserId = async (req, res) => { //get by id
    try {
        const idUser = req.params.id;

        // Validar que el usuario solo pueda ver su propia información
        if (parseInt(idUser) !== req.user.user_id) {
            return res.status(403).json({
                ok: false,
                status: 403,
                message: "No tienes permiso para acceder a este recurso"
            });
        }

        const user = await userModel.findOne({
            where: { user_id: idUser },
            attributes: { exclude: ['user_password'] }
        });

        if (!user) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Show user by id :)",
            body: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
        });
    }
};

export const updateUser = async (req, res) => { //put
    try {
        await userModel.sync();
        const dataUser = req.body;
        const idUser = req.params.id;

        // Validar que el usuario solo pueda actualizar su propia información
        if (parseInt(idUser) !== req.user.user_id) {
            return res.status(403).json({
                ok: false,
                status: 403,
                message: "No tienes permiso para modificar este recurso"
            });
        }

        const updateData = {
            user_user: dataUser.user_user,
        };

        // Si se proporciona una nueva contraseña, hashearla
        if (dataUser.user_password) {
            const salt = await bcryptjs.genSalt(10);
            updateData.user_password = await bcryptjs.hash(dataUser.user_password, salt);
        }

        const updateUser = await userModel.update(updateData, {
            where: { user_id: idUser }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Update user :)",
            body: updateUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
        });
    }
};

export const deleteUser = async (req, res) => { //delete
    try {
        await userModel.sync();
        const idUser = req.params.id;

        // Validar que el usuario solo pueda eliminar su propia cuenta
        if (parseInt(idUser) !== req.user.user_id) {
            return res.status(403).json({
                ok: false,
                status: 403,
                message: "No tienes permiso para eliminar este recurso"
            });
        }

        const deleteUser = await userModel.destroy({
            where: { user_id: idUser }
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Delete user by id :)",
            body: deleteUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
        });
    }
};

export const createUserFK = async (req, res) => { //post users fake
    try {
        await userModel.sync();
        const createUser = await userModel.create({
            user_user: faker.internet.email(),
            user_password: faker.internet.password()
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Create user fk :)",
            id: createUser.user_id,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
            status: 500,
        });
    }
};

export const loginUser = async (req, res) => { //post login
    try {
        await userModel.sync();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'

            });
        }

        const user = await userModel.findOne({
            where: {
                user_user: email,
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'user not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.user_password);
        if (!isMatch) {
            return res.status(401).json({ error: 'invalid credentials' });
        }

        const token = jwt.sign({
            email: user.user_user,
            user_id: user.user_id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Login successful",
            id: user.user_id,
            userName: user.user_name,
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong in the request",
        }
        );
    }
};

// Inicializar categorías para el usuario autenticado (útil para usuarios existentes)
export const initializeMyCategories = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // Verificar si el usuario ya tiene categorías
        const categoryModel = (await import('../models/category.model.js')).default;
        const existingCategories = await categoryModel.findAll({
            where: { user_FK: userId }
        });
        
        if (existingCategories.length > 0) {
            return res.status(200).json({
                ok: true,
                status: 200,
                message: `Ya tienes ${existingCategories.length} categorías creadas`,
                categoriesCount: existingCategories.length
            });
        }
        
        // Inicializar categorías predefinidas
        await initializeUserCategories(userId);
        
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Categorías predefinidas inicializadas exitosamente",
            categories: 'Las categorías han sido creadas'
        });
    } catch (error) {
        console.error('Error initializing categories:', error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al inicializar categorías",
            error: error.message
        });
    }
};

const UserController = {
    createUser,
    showUser,
    showUserId,
    updateUser,
    deleteUser,
    createUserFK,
    loginUser,
    initializeMyCategories
};

export default UserController;