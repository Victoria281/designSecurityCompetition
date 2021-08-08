// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserFnSolution = require('./middlewares/checkUserFnSolution');
const checkUserRole = require('./middlewares/checkAdmin');

const verifyUserId = checkUserFnSolution.checkForValidUserRoleUser;
const verifyAdmin = checkUserRole.checkUserRoleAdmin;

// Match URL's with controllers
exports.appRoute = router => {

    //Login 
    router.post('/api/user/login', authController.processLogin);
    //Register 
    router.post('/api/user/register', authController.processRegister);
    //Submit Design
    router.post('/api/user/process-submission', verifyUserId, checkUserFn.getClientUserId, userController.processDesignSubmission);
    //Admin update user
    router.put('/api/user/', verifyUserId, verifyAdmin, userController.processUpdateOneUser);
    //Update design
    router.put('/api/user/design/', verifyUserId, userController.processUpdateOneDesign);
    //Manage Invite not done 
    router.post('/api/user/processInvitation/', verifyUserId, checkUserFn.getClientUserId, userController.processSendInvitation);

    
    //Get designs to update/manage submission
    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyUserId, checkUserFn.getClientUserId, userController.processGetSubmissionData);
    //Admin manage user
    router.get('/api/user/process-search-user/:pagenumber/:search?', verifyUserId, verifyAdmin, checkUserFn.getClientUserId, userController.processGetUserData);
    //Admin check search user sbmission
    router.get('/api/user/process-search-user-design/:pagenumber/:search?', verifyUserId, verifyAdmin, userController.processGetSubmissionsbyEmail);
    //get profile and admin get user profile
    router.get('/api/user/:recordId', verifyUserId, userController.processGetOneUserData);
    //Get design to update
    router.get('/api/user/design/:fileId', verifyUserId, userController.processGetOneDesignData);

};