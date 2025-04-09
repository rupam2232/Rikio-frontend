export default function errorMessage(error){
    const htmlString = error?.response?.data?.message
    const match = htmlString?.match(/Error:.*?(?=<br>)/);
    if(match){
        return(match[0].slice(7).replaceAll("&quot;", `"`)) 
    }else{
        return(error.response?.data?.message)
    } 
}