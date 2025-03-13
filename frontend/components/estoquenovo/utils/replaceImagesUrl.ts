export const cleanUrl = (imageUrl:string) =>{
    console.log('url chegada na função'+imageUrl)
    console.log(imageUrl.replace(/\\/g, ""))
    return imageUrl.replace(/\\/g, "");
}