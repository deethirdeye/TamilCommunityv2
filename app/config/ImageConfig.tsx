const ImageConfig = {
    IMAGE_BASE_URL: process.env.NODE_ENV === 'production' 
         ? 'https://tamilcommunityapi.thirdeyeinfotech.com/'
         : 'https://localhost:7088/',
 
 
   };

   export default ImageConfig;