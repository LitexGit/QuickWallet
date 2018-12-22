
import I18n from '../I18n';

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

export const formatDate = d => {
    let date = '';
    if(d instanceof Date) {
        date = d.toISOString().slice(0,10);
    }
    return date;
};

export const sectionlize = (items) => {
    const sections = [];
    if(Array.isArray(items) && items.length) {
        const dateGroup = groupBy(items, 'date');
        const d = new Date();
        const today = formatDate(d);
        d.setDate(d.getDate() - 1);
        const yesterday = formatDate(d);
        Object.keys(dateGroup).forEach(key=>{
            const data = dateGroup[key];
            key===today && (key=I18n.t('today'));
            key===yesterday && (key=I18n.t('yesterday'));
            sections.push({ key, data });
        });
    }

    return sections;
};

