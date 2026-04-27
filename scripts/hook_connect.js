// Script Frida pour hooker la fonction connect dans libc.so
// Ce script intercepte les appels à la fonction connect et log les arguments et la valeur de retour

console.log("[+] Hook connect chargé");

// Obtenir un pointeur vers la fonction connect dans libc.so
const connectPtr = Process.getModuleByName("libc.so").getExportByName("connect");

console.log("[+] connect trouvée à : " + connectPtr);

// Attacher un intercepteur à la fonction connect
Interceptor.attach(connectPtr, {
  // Fonction appelée avant l'exécution de connect
  onEnter(args) {
    console.log("[+] connect appelée");
    console.log("    fd = " + args[0]);  // Descripteur de fichier (socket)
    console.log("    sockaddr = " + args[1]);  // Structure sockaddr (adresse)
  },
  // Fonction appelée après l'exécution de connect
  onLeave(retval) {
    console.log("    retour = " + retval.toInt32());  // Valeur de retour (0 = succès, -1 = erreur)
  }
});