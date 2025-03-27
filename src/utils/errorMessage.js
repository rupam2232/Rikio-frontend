export default function errorMessage(error){
    const htmlString = error?.response?.data
    const match = htmlString?.match(/Error:.*?(?=<br>)/);
    if(match){
        return(match[0].slice(7).replaceAll("&quot;", `"`)) 
    }else{
        return(error.message)
    } 
}