const { default: mongoose } = require("mongoose");

class ValidatorService {
    rules;

    constructor(rules) {
        this.rules = rules;
    }

    async validate() {
        const errors = [];

        const fields = Object.keys(this.rules);
        for (let field of fields) {
            const result = await this.validateField(field);
            if (result) {
                errors.push(result);
            }
        }

        return errors;
    }

    async validateField(field) {
        const ruleSet = this.rules[field]; // obtenemos el conjunto de reglas para el campo
        if (!ruleSet) return null; // si no hay reglas, no hacemos nada
        const value = ruleSet.value; // valor del campo a validar
        const rules = ruleSet.rules; // reglas a aplicar
        let error = ''; // inicializamos el error como vacio

        for (let index = 0; index < rules.length; index++) { // recorremos las reglas
            const rule = rules[index]; // regla actual
            if (error.length) return; // si ya hay un error, no seguir validando

            const ruleKey = rule.split(':')[0] || null; // extraemos la clave de la regla
            const ruleParam = rule.split(':')[1] || null; // extraemos el parametro de la regla si existe
            switch (ruleKey) {
                case 'required': // validacion de campo obligatorio
                    if (!value || (typeof value === 'string' && !value.trim().length)) {
                        error = `El campo ${field} es obligatorio.`;
                    }
                    break;
                case 'unique': // validacion de campo unico en la base de datos
                    const modelKey = ruleParam.split(',')[0]; // nombre del modelo
                    const fieldKey = ruleParam.split(',')[1] || key; // campo del modelo
                    const excludeId = ruleParam.split(',')[2] ? ruleParam.split(',')[2] : null; // id a excluir de la busqueda
                    const query = { [fieldKey]: value }; // construimos la query
                    if (excludeId) {
                        query._id = { $ne: excludeId }; // excluimos el id si se proporciona
                    }
                    const exists = await mongoose.models[modelKey].findOne(query); // buscamos en la base de datos
                    if (exists?._id) {
                        error = `El campo ${field} debe ser unico.`;
                    }
                    break;
                case 'exists': // validacion de existencia en la base de datos
                    const existsModelKey = ruleParam.split(',')[0]; // nombre del modelo
                    const existsFieldKey = ruleParam.split(',')[1] || key; // campo del modelo
                    const existsQuery = { [existsFieldKey]: value }; // construimos la query
                    const existsRecord = await mongoose.models[existsModelKey].findOne(existsQuery); // buscamos en la base de datos
                    
                    if (!existsRecord?._id) {
                        error = `El campo ${field} no existe en la base de datos.`;
                    }
                case 'minLength': // validacion de longitud minima
                    const minLength = parseInt(ruleParam, 10); // convertimos a entero
                    if (typeof value === 'string' && value.length < minLength) { // si la longitud es menor que la minima
                        error = `El campo ${field} debe tener al menos ${minLength} caracteres.`;
                    }
                    break;
                case 'maxLength': // validacion de longitud maxima
                    const maxLength = parseInt(ruleParam, 10); // convertimos a entero
                    if (typeof value === 'string' && value.length > maxLength) { // si la longitud es mayor que la maxima
                        error = `El campo ${field} debe tener como maximo ${maxLength} caracteres.`;
                    }
                    break;
                default:
                    break;
            }
        }
            

        return error.length ? { field, message: error } : null;
    }
}

module.exports = ValidatorService;