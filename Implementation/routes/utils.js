function isBusinessCustomer(req) {
    if(req.isAuthenticated()){
        return req.user._partitaIva !== undefined;
    }else return false;
}
function isSystemManager(req) {
    if(req.isAuthenticated()){
        if(req.user.systemManager === true) return true;
    }else return false;
}
module.exports = {
    isBusinessCustomer:isBusinessCustomer,
    isSystemManager:isSystemManager
};
