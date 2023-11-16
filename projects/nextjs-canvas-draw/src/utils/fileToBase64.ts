import { isString } from 'lodash-es';

export const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(isString(reader.result) ? reader.result : null);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};
