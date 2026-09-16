import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        {
            ...rules.searchMultipleFields(searchField, ['date','customer', 'seller'], false)
        }
    );

    return (data, state, action) => {
        console.log('--- searching вызван ---');
        console.log('action:', action);
        console.log('state.search:', state.search);

        // @todo: #5.2 — применить компаратор
        if (!action || action.name !== 'search') {
            return data;
        }

        const filtered = data.filter(row => {
            const res = compare(row, state);
            if (res) console.log('Строка подходит:', row.customer);
            return res;
        });
        
        console.log('Отфльтровано строк:', filtered.length);
        return filtered;
    }
}  
