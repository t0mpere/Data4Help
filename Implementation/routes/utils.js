function isBusinessCustomer(req) {
    if(req.isAuthenticated()){
        if(req.user._partitaIva !== undefined) return true;
    }else return false;
}
function isSystemManager(req) {
    if(req.isAuthenticated()){
        if(req.user.systemManager === true) return true;
    }else return false;
}
function isPrivateCustomer(req) {
    if(req.isAuthenticated()){
        if(req.user._codiceFiscale !== undefined) return true;
    }else return false;
}
module.exports = {
    isBusinessCustomer:isBusinessCustomer,
    isPrivateCustomer:isPrivateCustomer,
    isSystemManager:isSystemManager
};