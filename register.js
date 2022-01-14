const firebaseConfig = {
    apiKey: "AIzaSyCX77Q408aGdFZQf2J9DrSwXHdoHdzV5BU",
    authDomain: "aaaaaaaaa-821ad.firebaseapp.com",
    projectId: "aaaaaaaaa-821ad",
    storageBucket: "aaaaaaaaa-821ad.appspot.com",
    messagingSenderId: "144232618146",
    appId: "1:144232618146:web:ce551913ed833e9ea49ffb",
    measurementId: "G-9YKM1G72FS"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function signUpWithEmailPassword() {
    var email = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    console.log(email)
    console.log(password)
    // [START auth_signup_password]
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("success")
        // Signed in 
        var user = userCredential.user;
        window.location.href = "game.html"
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
    // [END auth_signup_password]
  }