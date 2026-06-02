# Scripts y Utilidades

Esta carpeta contiene scripts de utilidad y migraciones históricas del proyecto.

## Estructura

### `utilities/`

Scripts útiles que puedes ejecutar cuando sea necesario:

- **`init_database.js`** - Inicializa roles y estados de usuario en la base de datos

  ```bash
  node scripts/utilities/init_database.js
  ```

- **`verificar_tablas.js`** - Verifica qué tablas existen en la base de datos

  ```bash
  node scripts/utilities/verificar_tablas.js
  ```

- **`check_indexes.js`** - Muestra los índices de las tablas principales

  ```bash
  node scripts/utilities/check_indexes.js
  ```

- **`cleanup_indexes.js`** - Limpia índices únicos problemáticos
  ```bash
  node scripts/utilities/cleanup_indexes.js
  ```

### `legacy_migrations/`

Migraciones que ya fueron aplicadas. Se mantienen para historial pero no necesitan ejecutarse nuevamente:

- `run-migration.js` - Hizo budget_FK nullable
- `migrate_categories.js` - Limpió campos de categorías
- `mark_predefined_categories.js` - Marcó categorías predefinidas
- `sync_categories.js` - Sincronizó modelo de categorías
- `add_current_amounts.js` - Agregó campos de montos actuales
- `migrate_unique_constraints.js` - Migró restricciones únicas

## Importante

- Los scripts en `utilities/` son seguros de ejecutar cuando sea necesario
- Los scripts en `legacy_migrations/` ya fueron aplicados y **no deben ejecutarse nuevamente**
- Siempre haz backup de tu base de datos antes de ejecutar scripts que modifiquen la estructura
