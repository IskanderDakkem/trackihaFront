const ApiLinks = {
  Admin: {
    Signin: "admin/signin",
    verifyAdmin: "admin/me",
  },
  offers: {
    getAll: "offer/",
    getOne: "offer/", //+id
    delete: "offer/", //+id
    update: "offer/", //+id
    create: "offer/", //+id
  },
  Users: {
    getAll: "user/all/",
    delete: "user/",
    create: "auth/signup",
    getUser: "user/",
    //+id => get a specific user
  },
  User: {
    updateCompanyName: "user/companyName/",
    updateResponsableName: "user/responsableName/",
    updateEmail: "user/email/", //+id => update the user profile
    updatePassword: "user/password/",
    updateAvatar: "user/avatar/", //+id
    updateTel: "user/Tel/", //+id => update the user password
    getUser: "user/",
    update: "update/",
  },
  Company: {
    create: "company/", // => create a company
    update: "company/", //=> update a company
    delete: "company/", //=> delete a company
    getSpecificCompany: "company/", //+id => get a specific company
    getClientCompanies: "company/client/", //+id => get all the client companies
    getAllUserCompanies: "company/user/all/", //+id
    uploadCompanyLogo: "company/companyLogo/", //+id
    getAll: "company/all",
  },
  Icons: {
    Upload: "icon/",
    Delete: "icon/delete",
    getIcons: "icon/", //+id
    getDefault: "icon/",
  },
  Steps: {
    Create: "steps/", //+id
    Delete: "steps/", //+id
    getAllUserSteps: "steps/all/",
    getUserSteps: "steps/client/",
    getStep: "steps/", //+id
    getAllSteps: "steps/",
    getStepName: "steps/name/", //+id
    Update: "steps/", //+id
  },
  Sequence: {
    Create: "sequence/",
    Delete: "sequence/",
    Update: "sequence/",
    getSequence: "sequence/",
    getAllUserSequences: "sequence/user/all/",
    getClientSequence: "sequence/client/",
    getSequenceSteps: "sequence/steps/", //+id
    getOrderSequenceSteps: "sequence/order/", //+id
  },
  Auth: {
    verifyUser: "auth/me",
    signup: "auth/signup", //=> signup
    login: "auth/login", //=> login
    forgotPassword: "auth/forgot-password", //=> forgot password
    resetPassword: "auth/reset-password/", //=> reset the password
    CreatePassword: "auth/create-password/",
  },
  Orders: {
    Create: "orders/", //+id
    Update: "orders/", //+id
    Delete: "orders/", //+id
    getOne: "orders/", //+id
    getUserOrders: "orders/client/", //+id
    sendIsFollowedEmail: "orders/isSuivi/",
    sendIsLateEmail: "orders/isLate/", //+id,
    sendIsDeliveredEmail: "orders/isDelivered/", //++id
    Cancel: "orders/cancel/", //+id
    Track: "orders/track/",
    getAllAtOnce: "/orders/client/all/",
    getOrderEvolution: "/orders/evolution/",
  },
  deliveryCompany: {
    getAll: "deliveryCompany/user",
  },
  Crm: {
    getAll: "crm/all",
    Create: "crm/",
    Delete: "crm/",
    Update: "crm/",
    getOne: "crm/",
  },
  Hubspot: {
    getAll: "deliveryCompany/all",
    Create: "deliveryCompany/",
    Delete: "deliveryCompany/",
    Update: "deliveryCompany/",
    getOne: "deliveryCompany/",
  },
};

export default ApiLinks;
