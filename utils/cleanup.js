import { userConnections } from '../controllers/auth.js';  


const cleanupExpiredConnections = () => {
    const now = Date.now(); 
    userConnections.forEach((value, token) => {
        if (value.lastUsed && now - value.lastUsed > 31536000000) {  
            console.log(`Removing expired connection for token: ${token}`);
            userConnections.delete(token); 
        }
    });
};

setInterval(cleanupExpiredConnections, 31536000000); 

export default cleanupExpiredConnections;