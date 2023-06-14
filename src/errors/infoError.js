export const generateProductError = (prod) =>{
    return `Debes completar todos los campos:
    * Titulo era necesario: ${prod.titulo || undefined} 
    * Descripcion era necesario: ${prod.descripcion || undefined}
    * Precio era necesario: ${prod.precio || undefined} 
    * Imagen era necesario: ${prod.ruta || undefined} 
    * Codigo era necesario: ${prod.codigo || undefined} 
    * Stock era necesario: ${prod.cantidad || undefined} `
}

export const generateUpdateProductError = (campo, valor)=>{
    return `Debes completar todos los campos:
    * Campo a actualizar era necesario: ${campo || undefined}
    * Valor a actualizar era necesario: ${valor || undefined}
    `
}

export const generateInvalidSearchError = (obj, id) =>{
    return `No se encontró el ${obj} con el id: ${id || undefined}`
}

export const generateInvalidIdError = (id) =>{
    return `El id: ${id} no es valido. Se esperaban 24 caracteres, se obtuvieron: ${id.length}`
}

export const generateInvalidReadError = (obj) =>{
    return `No se encontraron los ${obj}`
}