import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        [],
        [rules.searchMultipleFields(searchField, ['date','customer', 'seller'], false)]
        
    );

    return (data, state, action) => {
        

        // @todo: #5.2 — применить компаратор
        if (!state.search || String(state.search).trim() === '') {
            return data;
        } 

        const filtered = data.filter(row => {
            const res = compare(row, state);
        
            if (res) console.log('Строка подходит:', row.customer);
            return res;
        });
       
        return filtered;
    }
}  
