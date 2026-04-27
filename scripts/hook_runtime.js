// Script Frida pour Android : hook de la méthode Runtime.exec dans java.lang.Runtime
// Ce script intercepte les appels à Runtime.exec avec un argument String
// et log la commande exécutée pour surveiller les exécutions de commandes système

Java.perform(function () {
  console.log("[+] Hook Runtime.exec chargé");

  // Obtenir une référence à la classe java.lang.Runtime
  var Runtime = Java.use("java.lang.Runtime");

  // Hook de la surcharge de exec qui prend un String (la commande)
  Runtime.exec.overload("java.lang.String").implementation = function (cmd) {
    console.log("[Runtime.exec] " + cmd);  // Log la commande exécutée
    return this.exec(cmd);  // Appeler la méthode originale et retourner le résultat
  };
});