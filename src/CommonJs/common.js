// 获取当前日期的前后val日期
export const setDateTime = (n) => {
    let s, d, t, t2;
    t = new Date().getTime();
    t2 = n * 1000 * 3600 * 24;
    t += t2;
    d = new Date(t);
    s = d.getUTCFullYear() + '-';
    s += ('00' + (d.getUTCMonth() + 1)).slice(-2) + '-';
    s += ('00' + d.getUTCDate()).slice(-2);
    return s;
};
// 获取毫秒数
export const setNewDateTime = (n) => {
    let s, d, t, t2;
    t = new Date().getTime();
    t2 = n * 1000 * 3600 * 24;
    t += t2;
    d = new Date(t).getTime();
    return d;
};
//current: 时间选择器穿过来的参数，n：天数, lt: 小于， gt: 大于
export const disabledDate = (current, type, n) => {
    if(type == 'lt'){
        return current && current.valueOf() < setNewDateTime(n);
    }else{
        return current && current.valueOf() > setNewDateTime(n);
    }
};

/*
* 获取localStorage
*/
export const getStore = name => {
    if (!name) return;
    let contentBody = window.localStorage.getItem(name);
    if (typeof contentBody != 'string') {
        contentBody = JSON.parse(window.localStorage.getItem(name))
    }
    return contentBody;
};

/*
* 存储localStorage
*/
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name)
};
export default {
    setDateTime,
    setNewDateTime,
    disabledDate,
    getStore,
    removeStore,
    setStore,

}

