// Script Frida pour hooker les fonctions de fichiers open et read dans libc.so
// Ce script intercepte les appels aux fonctions open et read et log les arguments pertinents

console.log("[+] Hook fichiers chargé");

// Obtenir les pointeurs vers les fonctions open et read dans libc.so
const openPtr = Process.getModuleByName("libc.so").getExportByName("open");
const readPtr = Process.getModuleByName("libc.so").getExportByName("read");

console.log("[+] open trouvée à : " + openPtr);
console.log("[+] read trouvée à : " + readPtr);

// Attacher un intercepteur à la fonction open
Interceptor.attach(openPtr, {
  // Fonction appelée avant l'exécution de open
  onEnter(args) {
    this.path = args[0].readUtf8String();  // Lire le chemin du fichier depuis le pointeur
    console.log("[+] open appelée : " + this.path);  // Afficher le chemin du fichier ouvert
  }
});

// Attacher un intercepteur à la fonction read
Interceptor.attach(readPtr, {
  // Fonction appelée avant l'exécution de read
  onEnter(args) {
    console.log("[+] read appelée");
    console.log("    fd = " + args[0]);  // Descripteur de fichier
    console.log("    taille = " + args[2].toInt32());  // Nombre d'octets à lire
  }
});