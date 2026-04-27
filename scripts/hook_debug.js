// Script Frida pour Android : hook des méthodes de débogage dans android.os.Debug
// Ce script intercepte les appels aux méthodes isDebuggerConnected et waitingForDebugger
// et log leurs valeurs de retour pour détecter les tentatives de débogage

Java.perform(function () {
  console.log("[+] Hook Debug chargé");

  // Obtenir une référence à la classe android.os.Debug
  var Debug = Java.use("android.os.Debug");

  // Hook de la méthode isDebuggerConnected
  Debug.isDebuggerConnected.implementation = function () {
    var result = this.isDebuggerConnected();  // Appeler la méthode originale
    console.log("[Debug] isDebuggerConnected() => " + result);  // Log le résultat
    return result;  // Retourner le résultat original
  };

  // Hook de la méthode waitingForDebugger
  Debug.waitingForDebugger.implementation = function () {
    var result = this.waitingForDebugger();  // Appeler la méthode originale
    console.log("[Debug] waitingForDebugger() => " + result);  // Log le résultat
    return result;  // Retourner le résultat original
  };
});