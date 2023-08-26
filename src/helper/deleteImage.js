const fs = require('fs').promises;


const deleteImage = async (userImagePath)=>{

    try {
        await fs.access(userImagePath);
        await fs.access(userImagePath);
        console.log('User image was deleted');
    } catch (error) {
        console.error('User image does not exist');
    }
    
};


module.exports={deleteImage};