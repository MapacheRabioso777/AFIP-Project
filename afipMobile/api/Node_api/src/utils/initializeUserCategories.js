import categoryModel from '../models/category.model.js';
import { getAllPredefinedCategories } from '../config/predefinedCategories.js';

/**
 * Inicializa las categorías predefinidas para un nuevo usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const initializeUserCategories = async (userId) => {
    try {
        const predefinedCategories = getAllPredefinedCategories();
        
        // Crear todas las categorías predefinidas para el usuario
        const categoriesToCreate = predefinedCategories.map(category => ({
            ...category,
            user_FK: userId,
        }));

        await categoryModel.bulkCreate(categoriesToCreate);
        
        console.log(`Initialized ${categoriesToCreate.length} predefined categories for user ${userId}`);
    } catch (error) {
        console.error('Error initializing user categories:', error.message);
        throw error;
    }
};
