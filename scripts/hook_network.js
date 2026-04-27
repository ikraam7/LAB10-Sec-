// Script Frida pour hooker les fonctions réseau send et recv dans libc.so
// Ce script intercepte les appels aux fonctions send et recv et log les arguments pertinents

console.log("[+] Hooks réseau chargés");

// Obtenir les pointeurs vers les fonctions send et recv dans libc.so
const sendPtr = Process.getModuleByName("libc.so").getExportByName("send");
const recvPtr = Process.getModuleByName("libc.so").getExportByName("recv");

console.log("[+] send trouvée à : " + sendPtr);
console.log("[+] recv trouvée à : " + recvPtr);

// Attacher un intercepteur à la fonction send
Interceptor.attach(sendPtr, {
  // Fonction appelée avant l'exécution de send
  onEnter(args) {
    console.log("[+] send appelée");
    console.log("    fd = " + args[0]);  // Descripteur de fichier (socket)
    console.log("    len = " + args[2].toInt32());  // Longueur des données à envoyer
  }
});

// Attacher un intercepteur à la fonction recv
Interceptor.attach(recvPtr, {
  // Fonction appelée avant l'exécution de recv
  onEnter(args) {
    console.log("[+] recv appelée");
    console.log("    fd = " + args[0]);  // Descripteur de fichier (socket)
    console.log("    len demandé = " + args[2].toInt32());  // Longueur maximale à recevoir
  },
  // Fonction appelée après l'exécution de recv
  onLeave(retval) {
    console.log("    recv retourne = " + retval.toInt32());  // Nombre d'octets reçus (ou -1 en cas d'erreur)
  }
});