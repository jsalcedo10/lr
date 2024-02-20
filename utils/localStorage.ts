

const toggleData = ( id: number ) => {

    let data: number[] = JSON.parse( localStorage.getItem('data') || '[]' );
    
    if ( data.includes( id ) ) {
        data = data.filter( dataId => dataId !== id );
    } else {
        data.push( id );
    }

    localStorage.setItem('data', JSON.stringify( data ) );
}

const existData = ( id: number ): boolean => {

    if ( typeof window === 'undefined' ) return false;
    
    const data: number[] = JSON.parse( localStorage.getItem('data') || '[]' );

    return data.includes( id );
}


const dataArray = (): number[] => {
    return JSON.parse( localStorage.getItem('data') || '[]' );
}



export default {
    existData,
    toggleData,
    dataArray,
}