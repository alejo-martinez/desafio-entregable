const date = new Date();

export const actualDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
export const contarDias = (fecha)=>{
    return (new Date(fecha).getTime()) / 1000 / 60 / 60 / 24;
}
export const diasTotales = ((new Date(`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`)).getTime()) / 1000 / 60 / 60 / 24;
