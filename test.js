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


function signInWithEmailPassword() {
    var email = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    console.log(email)
    console.log(password)
    
    // [START auth_signin_password]
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        if(email=="admin@gmail.com" && password=="123456"){
            window.location.href = "admin.html"
        }
        else{
            window.location.href = "game.html"
            
        }
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    // [END auth_signin_password]
  }
/* function fnLogin() {
    var uSer = document.getElementById("user");
    var pAss = document.getElementById("pass");
    var oError = document.getElementById("error_box");
    oError.innerHTML = "<br>";
    if (uSer.value.length < 6 || uSer.value.length > 20) {
        oError.innerHTML = "请输入6-20位用户名";
        return
    } else if ((uSer.value.charCodeAt(0) >= 48) && (uSer.value.charCodeAt(0) <= 57)) {
        oError.innerHTML = "用户名首字不能是数字";
        return
    } else for (var i = 0; i < uSer.value.length; i++) {
        if ((uSer.value.charCodeAt(i) < 48) || (uSer.value.charCodeAt(i) > 57) && (uSer.value.charCodeAt(i) < 97) || (uSer.value.charCodeAt(i) > 122)) {
            oError.innerHTML = "用户名只能是数字和字母";
            return
        }
    }

    if (pAss.value.length < 6 || pAss.value.length > 20) {
        oError.innerHTML = "请输入6-20位密码";
        return
    }
    // 验证弹框
    window.alert("成功")
}


function fnRegistration() {
    var uSer = document.getElementById("user");
    var pAss = document.getElementById("pass");
    var aGain = document.getElementById("again");
    var oError = document.getElementById("error_box");

    oError.innerHTML = "<br>";

    // 验证用户名
    if (uSer.value.length < 6 || uSer.value.length > 20) {
        oError.innerHTML = "请输入6-20位用户名";
        return
    } else if ((uSer.value.charCodeAt(0) >= 48) && (uSer.value.charCodeAt(0) <= 57)) {
        oError.innerHTML = "用户名首字不能是数字";
        return
    } else for (var i = 0; i < uSer.value.length; i++) {
        if ((uSer.value.charCodeAt(i) < 48) || (uSer.value.charCodeAt(i) > 57) && (uSer.value.charCodeAt(i) < 97) || (uSer.value.charCodeAt(i) > 122)) {
            oError.innerHTML = "用户名只能是数字和字母";
            return
        }
    }

    // 验证密码
    if (pAss.value.length < 6 || pAss.value.length > 20) {
        oError.innerHTML = "请输入6-20位密码";
        return
    }

    // 验证再次输入的密码
    if (aGain.value != pAss.value) {
        oError.innerHTML = "请输入相同的密码";
        return
    }
    // 验证弹框
    window.alert("成功")
} */