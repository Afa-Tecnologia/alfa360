export const cleanUrl = (imageUrl:string) =>{
    if(imageUrl){
        console.log('url chegada na função'+imageUrl)
        console.log(imageUrl.replace(/\\/g, ""))
        return imageUrl.replace(/\\/g, "");
    }
    return null;
}