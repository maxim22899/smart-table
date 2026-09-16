import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);


export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.parentElement.querySelector('input');

            if (input) {
                input.value = '';
            }

            if (state[field]) {
                state[field] = '';
            }
        }

        let result = data.filter(row => compare(row, state));

        if (state.totalFrom)  {
            const min = Number(state.totalFrom);
            result = result.filter(row => Number(row.total) >= min);
        }
        if (state.totalTo) {
            const max = Number(state.totalTo);
            result = result.filter(row => Number(row.total) <= max);
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return result;
    }
}