const moodle = "https://moodle.iitd.ac.in/login/index.php"
const moodleNew = "https://moodlenew.iitd.ac.in/login/index.php"
const moodleNewDomain = "https://moodlenew.iitd.ac.in/"
const webmail = "https://webmail.iitd.ac.in/roundcube/"
const erp = "https://eacademics.iitd.ac.in/sportal/login"
const sportal = "https://ecampus.iitd.ac.in/scorner/login"
const oauth = "https://oauth.iitd.ac.in/login.php"
const timble = "http://10.8.2.111:8080/Default/ViewAttendance"

const byPass = () => window.confirm("Do you want to bypass login?")

// Utility functions for encoding and decoding
function bufferToBase64(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
}

function base64ToBuffer(b64) {
    var binary_string = atob(b64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// Derive a key from a password
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Decrypt a message
async function decryptMessage(iv, ciphertext) {
    const password = "create_your_own_password";
    const salt = "create_your_own_salt";
    const key = await deriveKey(password, salt);

    const decoder = new TextDecoder();
    const decryptedContent = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: base64ToBuffer(iv) },
        key,
        base64ToBuffer(ciphertext)
    );
    return decoder.decode(decryptedContent);
}


function KerberosLogin(URL, kerberos, kpass) {
    if (URL.startsWith(erp) && byPass()) {
        document.getElementsByTagName("a")[0].click();
        return
    }
    if (URL.startsWith(oauth) && byPass()) {
        document.getElementById("username").value = kerberos;
        document.getElementById("password").value = kpass;
        document.getElementById("captcha_code").focus();
        return
    }
    if (URL == moodle && byPass()) {
        const form = document.getElementById("login")
        const que = form.childNodes[10].textContent.replaceAll("\n", "")
        const ques = que.split(" ").filter(q => q != '')
        let res;
        if (ques[1] == "add") {
            res = +ques[2] + +ques[4]
        }
        else if (ques[1] == "subtract") {
            res = +ques[2] - +ques[4]
        }
        else if (ques[1] == "enter") {
            ques[2] == "first" ? res = +ques[4] : res = + ques[6]
        }
        else {
            return;
        }
        form.childNodes[11].value = res
        document.getElementById("username").value = kerberos;
        document.getElementById("password").value = kpass;
        setTimeout(() => { document.getElementById("loginbtn").click() }, 300)
        return
    }
    if (URL == moodleNew && byPass()) {
        document.getElementById("username").value = kerberos;
        document.getElementById("password").value = kpass;
        setTimeout(() => { document.getElementById("loginbtn").click() }, 300)
        return
    }
    if (URL.startsWith(webmail) && byPass()) {
        document.getElementById("rcmloginuser").value = kerberos;
        document.getElementById("rcmloginpwd").value = kpass;
        setTimeout(() => { document.getElementById("rcmloginsubmit").click() }, 300)
        return
    }
}
function EntryLogin(URL, entry, password) {
    if (URL.startsWith(sportal) && byPass()) {
        setTimeout(() => {
            document.getElementsByName("username")[0].value = entry;
            document.getElementsByName("password")[0].value = password;
            setTimeout(() => { document.getElementsByName("submit")[0].click() }, 300)
        }, 100)
        return
    }

}
function MobileLogin(URL, entry, mobile) {
    if (URL == timble && byPass()) {
        document.getElementById("UserCode").value = entry;
        document.getElementById("User_password").value = mobile;
        setTimeout(() => { document.getElementById("btn_login2").click() }, 300)
        return
    }
}
async function Login() {
    await chrome.storage.local.get(
        ["kuser", "kpass", "entry", "spass", "mobile", "kpass_iv", "spass_iv"],
        async function (result) {
            if (!(result.kpass || result.kuser || result.entry || result.spass || result.mobile)) return

            if (
                [moodle, moodleNew, moodleNew, webmail, erp, sportal, timble].some(l => window.location.href == (l)) ||
                window.location.href.startsWith(webmail + "?_task=logout") ||
                window.location.href.startsWith(oauth) ||
                window.location.href.startsWith(sportal + "?logout") ||
                window.location.href.startsWith(erp + "?logout")
            ) {
                let kpass, spass;
                if (result.kpass) kpass = await decryptMessage(result.kpass_iv, result.kpass);
                if (result.spass) spass = await decryptMessage(result.spass_iv, result.spass);

                const URL = window.location.href;
                if (URL == moodleNewDomain) {
                    window.location.href = moodleNew;
                    return;
                }
                if (result.kuser && kpass) { KerberosLogin(URL, result.kuser, kpass) }
                if (result.entry && spass) { EntryLogin(URL, result.entry, spass) }
                if (result.entry && result.mobile) { MobileLogin(URL, result.entry, result.mobile) }
            }
        }
    )
}

Login()

