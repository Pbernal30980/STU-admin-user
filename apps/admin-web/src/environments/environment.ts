export const environment = {
  production: false,
  authBypass: true,
  // Variables visuales del menú
  companyName: 'STU',
  companySubName: 'Panel Administrativo',
  
  // URLs temporales para que los servicios compilen (luego las cambiaremos a Firebase)
  backEndGTU_AssignDriver: 'http://localhost:3000',
  backEndGTU_Login: 'http://localhost:3000',
  backEndGTU_ResetPasswordRequest: 'http://localhost:3000',
  backEndGTU_ChangePassword: 'http://localhost:3000',
  backEndGTU_RouteStop: 'http://localhost:3000',
  backEndGTU_Users: 'http://localhost:3000',

  // Tu configuración real de Firebase
  firebase: {
    apiKey: "AIzaSyAuXgP7H_mM11gWBqGu1TSivtADHtFSC5k",
    authDomain: "stu-calima.firebaseapp.com",
    projectId: "stu-calima",
    storageBucket: "stu-calima.firebasestorage.app",
    messagingSenderId: "334031507348",
    appId: "1:334031507348:web:aadc8cb1cdaef624a14981"
  }
};