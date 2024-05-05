//import ojSpResolver from "./dynamicPathContext/oj-sp-resolver";
import ojsResolver from "./dynamicPathContext/ojs-resolver";

const customRequire = function (paths, callback, reject) {
    try {
        let result = [].concat(paths).map(
            /**
             * 
             * @param {string} path 
             */
            (path)=>{
            switch(true){
                //case path.startsWith('oj-sp/'): return ojSpResolver(path);
                case path.startsWith('ojs/'): return ojsResolver(path);
            }
        });

        return callback?callback(...result): result[0];
    } catch (e) {
        reject(e);
    }
};

window.require = window.requirejs = customRequire;
export default customRequire;


