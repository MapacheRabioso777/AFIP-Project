
import categoryModel from "../models/category.model.js";

// Create Category (POST)
export const createCategory = async (req, res) => {
    try {
        await categoryModel.sync();
        const dataCategory = req.body;

        // Usar el user_id del usuario autenticado
        const newCategory = await categoryModel.create({
            category_name: dataCategory.category_name,
            category_description: dataCategory.category_description,
            category_type: dataCategory.category_type || 'expense',
            user_FK: req.user.user_id, // Forzar el ID del usuario autenticado
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Category created successfully",
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error creating category",
            error: error.message
        });
    }
};

// Get All Categories (GET) - Solo del usuario autenticado
export const getCategories = async (req, res) => {
    try {
        await categoryModel.sync();
        const { type } = req.query; // Filtro opcional por tipo

        // Construir condiciones de búsqueda
        const whereConditions = { user_FK: req.user.user_id };
        if (type && (type === 'income' || type === 'expense')) {
            whereConditions.category_type = type;
        }

        // Filtrar solo las categorías del usuario autenticado
        const categories = await categoryModel.findAll({
            where: whereConditions,
            order: [['category_name', 'ASC']]
        });

        // Agregar campos calculados
        const categoriesWithCalculations = categories.map(category => {
            const categoryData = category.toJSON();
            const totalAmount = parseFloat(categoryData.category_allocated_amount || 0);
            
            return {
                ...categoryData,
                category_total: totalAmount // Total de ingresos/gastos en la categoría
            };
        });

        res.status(200).json({
            ok: true,
            status: 200,
            body: categoriesWithCalculations
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

// Get Category by ID (GET) - Solo si pertenece al usuario
export const getCategoryById = async (req, res) => {
    try {
        await categoryModel.sync();
        const { id } = req.params;

        // Buscar la categoría Y verificar que pertenece al usuario
        const category = await categoryModel.findOne({
            where: {
                category_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!category) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Category not found or you don't have permission to access it"
            });
        }

        // Agregar campos calculados
        const categoryData = category.toJSON();
        const totalAmount = parseFloat(categoryData.category_allocated_amount || 0);

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                ...categoryData,
                category_total: totalAmount // Total de ingresos/gastos en la categoría
            }
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error fetching category",
            error: error.message
        });
    }
};

// Update Category (PUT) - Solo si pertenece al usuario
export const updateCategory = async (req, res) => {
    try {
        await categoryModel.sync();
        const { id } = req.params;
        const dataCategory = req.body;

        // Buscar la categoría Y verificar que pertenece al usuario
        const category = await categoryModel.findOne({
            where: {
                category_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!category) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Category not found or you don't have permission to modify it"
            });
        }

        // Verificar si es una categoría predefinida
        if (category.category_is_predefined) {
            return res.status(403).json({
                ok: false,
                status: 403,
                message: "No se pueden editar las categorías predefinidas del sistema"
            });
        }

        await category.update({
            category_name: dataCategory.category_name,
            category_description: dataCategory.category_description,
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error updating category",
            error: error.message
        });
    }
};

// Delete Category (DELETE) - Solo si pertenece al usuario
export const deleteCategory = async (req, res) => {
    try {
        await categoryModel.sync();
        const { id } = req.params;

        // Buscar la categoría Y verificar que pertenece al usuario
        const category = await categoryModel.findOne({
            where: {
                category_id: id,
                user_FK: req.user.user_id
            }
        });

        if (!category) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Category not found or you don't have permission to delete it"
            });
        }

        // Verificar si es una categoría predefinida
        if (category.category_is_predefined) {
            return res.status(403).json({
                ok: false,
                status: 403,
                message: "No se pueden eliminar las categorías predefinidas del sistema"
            });
        }

        await category.destroy();

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error deleting category",
            error: error.message
        });
    }
};