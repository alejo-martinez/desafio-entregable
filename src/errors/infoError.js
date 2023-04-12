export const generateProductError = (prod) =>{
    return `Debes completar todos los campos:
    * Titulo era necesario ${prod.titulo} 
    * Descripcion era necesario ${prod.descripcion}
    * Precio era necesario ${prod.precio} 
    * Imagen era necesario ${prod.ruta} 
    * Codigo era necesario ${prod.codigo} 
    * Stock era necesario ${prod.cantidad} `
}