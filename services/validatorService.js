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
        const ruleSet = this.rules[field];
        if (!ruleSet) return null;
        const value = ruleSet.value;
        const rules = ruleSet.rules;
        let error = '';

        for (let index = 0; index < rules.length; index++) {
            const rule = rules[index];
            if (error.length) return; // si ya hay un error, no seguir validando

            const ruleKey = rule.split(':')[0] || null;
            const ruleParam = rule.split(':')[1] || null;
            switch (ruleKey) {
                case 'required':
                    if (!value || (typeof value === 'string' && !value.trim().length)) {
                        error = `El campo ${field} es obligatorio.`;
                    }
                    break;
                case 'unique':
                    const modelKey = ruleParam.split(',')[0];
                    const fieldKey = ruleParam.split(',')[1] || key;
                    const excludeId = ruleParam.split(',')[2] ? ruleParam.split(',')[2] : null;
                    const query = { [fieldKey]: value };
                    if (excludeId) {
                        query._id = { $ne: excludeId };
                    }
                    const exists = await mongoose.models[modelKey].findOne(query);
                    if (exists?._id) {
                        error = `El campo ${field} debe ser unico.`;
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